// 全局变量
let currentPage = 1;
let pageSize = 12;
let totalProducts = 0;
let currentFilters = {};
let currentSort = 'default';

// API基础URL - 根据您的实际后端地址修改
const API_BASE_URL = 'http://localhost:8080/api';

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadProducts();
    loadFilters();
});

// 初始化事件监听器
function initializeEventListeners() {
    // 绑定搜索按钮事件
    document.getElementById('searchBtn').addEventListener('click', searchProducts);

    // 绑定输入框回车事件
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchProducts();
        }
    });

    // 绑定价格筛选事件
    document.querySelectorAll('input[name="price"]').forEach(checkbox => {
        checkbox.addEventListener('change', filterProducts);
    });

    // 绑定排序选项事件
    document.querySelectorAll('.sort-item').forEach(item => {
        item.addEventListener('click', function() {
            changeSort(this.getAttribute('data-sort'));
        });
    });

    // 绑定分类和品牌筛选事件（动态加载的元素使用事件委托）
    document.addEventListener('change', function(e) {
        if (e.target.name === 'category' || e.target.name === 'brand') {
            filterProducts();
        }
    });

    // 绑定商品卡片点击事件（事件委托）
    document.getElementById('resultsList').addEventListener('click', function(e) {
        const productCard = e.target.closest('.product-card');
        if (productCard && !e.target.closest('.product-actions')) {
            const productId = productCard.getAttribute('data-product-id');
            if (productId) {
                viewProductDetail(productId);
            }
        }

        // 处理详情按钮点击
        if (e.target.classList.contains('detail-btn')) {
            const productId = e.target.closest('.product-card').getAttribute('data-product-id');
            if (productId) {
                viewProductDetail(productId);
            }
        }

        // 处理加入购物车按钮点击
        if (e.target.classList.contains('add-to-cart')) {
            const productId = e.target.closest('.product-card').getAttribute('data-product-id');
            if (productId) {
                addToCart(productId);
            }
        }
    });
}

// 加载商品列表
async function loadProducts() {
    showLoading(true);

    try {
        const response = await fetch(buildProductListUrl());
        const data = await response.json();

        if (data.success) {
            displayProducts(data.data);
            updatePagination(data.total);
            updateProductCount(data.total);
        } else {
            showError('加载商品失败：' + data.message);
        }
    } catch (error) {
        console.error('加载商品列表错误:', error);
        showError('网络错误：' + error.message);
    } finally {
        showLoading(false);
    }
}

// 构建商品列表请求URL
function buildProductListUrl() {
    const params = new URLSearchParams({
        page: currentPage,
        size: pageSize,
        sort: currentSort
    });

    // 添加筛选参数
    if (currentFilters.categoryId) {
        params.append('categoryId', currentFilters.categoryId);
    }
    if (currentFilters.brandId) {
        params.append('brandId', currentFilters.brandId);
    }
    if (currentFilters.keyword) {
        params.append('keyword', currentFilters.keyword);
    }

    // 添加价格筛选
    const priceFilters = Array.from(document.querySelectorAll('input[name="price"]:checked'))
        .map(checkbox => checkbox.value);
    if (priceFilters.length > 0) {
        params.append('priceRanges', priceFilters.join(','));
    }

    return `${API_BASE_URL}/products/list?${params.toString()}`;
}

// 显示商品列表
function displayProducts(products) {
    const container = document.getElementById('resultsList');

    if (!products || products.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px 0;">
                <p style="color: #999; font-size: 16px;">没有找到符合条件的商品</p>
            </div>
        `;
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-img">
                <img src="${product.mainImage || '/images/placeholder.jpg'}" 
                     alt="${product.title}" 
                     onerror="this.src='/images/placeholder.jpg'">
                <div class="product-tag">热卖</div>
            </div>
            <div class="product-info">
                <div class="product-title">${product.title}</div>
                <div class="product-price">¥${formatPrice(product.price)}</div>
                <div class="product-sales">月销 ${product.sales || 0} 件</div>
                <div class="product-rating">
                    <div class="rating-stars">★★★★★</div>
                    <div class="rating-count">${product.rating || 4.9}</div>
                </div>
                <div class="product-actions">
                    <button class="detail-btn">查看详情</button>
                    <button class="add-to-cart">加入购物车</button>
                </div>
            </div>
        </div>
    `).join('');
}

// 价格格式化（分转元）
function formatPrice(priceInFen) {
    if (!priceInFen) return '0.00';
    return (priceInFen / 100).toFixed(2);
}

// 更新分页
function updatePagination(total) {
    const totalPages = Math.ceil(total / pageSize);
    const pagination = document.getElementById('pagination');

    let html = '';

    // 上一页
    if (currentPage > 1) {
        html += `<div class="page-item" onclick="changePage(${currentPage - 1})">上一页</div>`;
    } else {
        html += `<div class="page-item disabled">上一页</div>`;
    }

    // 页码
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            html += `<div class="page-item ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</div>`;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += `<div class="page-item disabled">...</div>`;
        }
    }

    // 下一页
    if (currentPage < totalPages) {
        html += `<div class="page-item" onclick="changePage(${currentPage + 1})">下一页</div>`;
    } else {
        html += `<div class="page-item disabled">下一页</div>`;
    }

    pagination.innerHTML = html;
}

// 切换页码
function changePage(page) {
    if (page < 1 || page > Math.ceil(totalProducts / pageSize)) return;

    currentPage = page;
    loadProducts();
    window.scrollTo(0, 0);
}

// 筛选商品
function filterProducts() {
    currentPage = 1;

    // 获取分类筛选
    const categoryCheckbox = document.querySelector('#categoryFilter input:checked');
    currentFilters.categoryId = categoryCheckbox ? categoryCheckbox.value : '';

    // 获取品牌筛选
    const brandCheckbox = document.querySelector('#brandFilter input:checked');
    currentFilters.brandId = brandCheckbox ? brandCheckbox.value : '';

    // 获取搜索关键词
    currentFilters.keyword = document.getElementById('searchInput').value;

    // 更新面包屑
    updateBreadcrumb();

    loadProducts();
}

// 搜索商品
function searchProducts() {
    currentFilters.keyword = document.getElementById('searchInput').value;
    currentPage = 1;
    updateBreadcrumb();
    filterProducts();
}

// 更改排序
function changeSort(sortOption) {
    currentSort = sortOption;
    currentPage = 1;

    // 更新排序UI
    document.querySelectorAll('.sort-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`.sort-item[data-sort="${sortOption}"]`).classList.add('active');

    loadProducts();
}

// 重置筛选
function resetFilters() {
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    document.getElementById('searchInput').value = '';

    currentFilters = {};
    currentSort = 'default';

    // 重置排序UI
    document.querySelectorAll('.sort-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector('.sort-item[data-sort="default"]').classList.add('active');

    updateBreadcrumb();
    loadProducts();
}

// 加载筛选条件
async function loadFilters() {
    try {
        // 加载分类
        const categoryResponse = await fetch(`${API_BASE_URL}/categories`);
        const categoryData = await categoryResponse.json();

        if (categoryData.success) {
            const categoryContainer = document.getElementById('categoryFilter');
            categoryContainer.innerHTML = categoryData.data.map(cat =>
                `<label><input type="radio" name="category" value="${cat.id}"> ${cat.name}</label>`
            ).join('');
        }

        // 加载品牌
        const brandResponse = await fetch(`${API_BASE_URL}/brands`);
        const brandData = await brandResponse.json();

        if (brandData.success) {
            const brandContainer = document.getElementById('brandFilter');
            brandContainer.innerHTML = brandData.data.map(brand =>
                `<label><input type="radio" name="brand" value="${brand.id}"> ${brand.name}</label>`
            ).join('');
        }
    } catch (error) {
        console.error('加载筛选条件失败：', error);
    }
}

// 查看商品详情
function viewProductDetail(productId) {
    // 跳转到商品详情页，这里假设商品详情页的URL格式为 product.html?id=xxx
    window.location.href = `MerchandisePage?id=${productId}`;

    // 如果使用的是单页应用，可以改为：
    // showProductDetailModal(productId);
}

// 商品详情模态框（如果使用单页应用）
function showProductDetailModal(productId) {
    // 这里可以实现一个模态框来显示商品详情
    // 在实际项目中，能需要根据产品ID获取详细信息
    console.log(`显示商品详情: ${productId}`);

    // 示例代码：
    // fetch(`${API_BASE_URL}/products/${productId}`)
    //   .then(response => response.json())
    //   .then(data => {
    //       if (data.success) {
    //           // 显示模态框并填充数据
    //           showModal(data.data);
    //       } else {
    //           showError('获取商品详情失败');
    //       }
    //   })
    //   .catch(error => {
    //       console.error('获取商品详情错误:', error);
    //       showError('网络错误，请稍后重试');
    //   });
}

// 加入购物车
function addToCart(productId) {
    // 阻止事件冒泡，避免触发商品卡片点击事件
    event.stopPropagation();

    // 这里可以添加加入购物车的逻辑
    console.log(`加入购物车: ${productId}`);

    // 模拟添加到购物车的API调用
    fetch(`${API_BASE_URL}/cart/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            productId: productId,
            quantity: 1
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showMessage('商品已成功加入购物车');
                // 可以更新购物车图标上的数量
                updateCartCount();
            } else {
                showError('加入购物车失败: ' + data.message);
            }
        })
        .catch(error => {
            console.error('加入购物车错误:', error);
            showError('网络错误，请稍后重试');
        });
}

// 显示消息
function showMessage(message) {
    // 可以使用更优雅的方式显示消息，比如Toast通知
    alert(message);
}

// 更新购物车数量
function updateCartCount() {
    // 这里可以更新购物车图标上的商品数量
    console.log('更新购物车数量');
}

// 显示/隐藏加载状态
function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
}

// 显示错误信息
function showError(message) {
    // 可以使用Toast或Alert显示错误信息
    alert(message);
}

// 更新商品数量显示
function updateProductCount(total) {
    document.getElementById('productCount').textContent = total;
    totalProducts = total;
}

// 更新面包屑导航
function updateBreadcrumb() {
    const breadcrumbText = document.getElementById('breadcrumbText');
    if (currentFilters.keyword) {
        breadcrumbText.textContent = `搜索"${currentFilters.keyword}"`;
    } else {
        breadcrumbText.textContent = '全部商品';
    }
}

// 为动态生成的元素添加全局事件处理
document.addEventListener('click', function(e) {
    // 处理分页点击事件
    if (e.target.classList.contains('page-item') && !e.target.classList.contains('disabled') && !e.target.classList.contains('active')) {
        const pageText = e.target.textContent;
        if (pageText === '上一页') {
            changePage(currentPage - 1);
        } else if (pageText === '下一页') {
            changePage(currentPage + 1);
        } else if (!isNaN(pageText)) {
            changePage(parseInt(pageText));
        }
    }
});
