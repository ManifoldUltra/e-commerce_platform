// product-list.js

// 全局变量
let currentPage = 1;
let pageSize = 12;
let totalProducts = 0;
let currentFilters = {};

// API基础URL - 根据您的实际后端地址修改
const API_BASE_URL = 'http://localhost:8080/api';

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    loadFilters();
});

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
        size: pageSize
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

    return `${API_BASE_URL}/products/list?${params.toString()}`;
}

// 显示商品列表
function displayProducts(products) {
    const container = document.getElementById('productList');

    if (!products || products.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-search" style="font-size: 3rem; color: #ccc;"></i>
                <p class="text-muted mt-3">没有找到符合条件的商品</p>
            </div>
        `;
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="card product-card h-100">
                <img src="${getProductImage(product)}" 
                     class="card-img-top product-image" 
                     alt="${product.title}"
                     onerror="this.src='/images/placeholder.jpg'">
                <div class="card-body d-flex flex-column">
                    <h6 class="card-title">${product.title}</h6>
                    <p class="card-text text-muted small flex-grow-1">${product.subTitle || ''}</p>
                    <div class="price-range">
                        ¥${formatPrice(getProductPrice(product))}
                    </div>
                    <div class="mt-2">
                        <button class="btn btn-outline-primary btn-sm w-100" 
                                onclick="viewProductDetail(${product.id})">
                            查看详情
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// 获取商品图片
function getProductImage(product) {
    // 这里可以根据实际情况调整图片获取逻辑
    // 例如从SKU中获取第一张图片，或者使用默认图片
    return product.mainImage || product.images || '/images/placeholder.jpg';
}

// 获取商品价格
function getProductPrice(product) {
    // 这里可以根据实际情况调整价格获取逻辑
    // 如果是SPU，可能需要从SKU中计算价格范围
    // 如果是单个价格，直接返回
    return product.price || product.minPrice || 0;
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
    html += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">上一页</a>
        </li>
    `;

    // 页码
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            html += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
                </li>
            `;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }

    // 下一页
    html += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">下一页</a>
        </li>
    `;

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

    currentFilters = {
        categoryId: document.getElementById('categoryFilter').value,
        brandId: document.getElementById('brandFilter').value,
        keyword: document.getElementById('searchInput').value
    };

    // 移除空值
    Object.keys(currentFilters).forEach(key => {
        if (!currentFilters[key]) delete currentFilters[key];
    });

    loadProducts();
}

// 搜索商品
function searchProducts() {
    currentFilters.keyword = document.getElementById('searchInput').value;
    filterProducts();
}

// 排序商品
function sortProducts() {
    currentFilters.sort = document.getElementById('sortOption').value;
    loadProducts();
}

// 重置筛选
function resetFilters() {
    document.getElementById('categoryFilter').value = '';
    document.getElementById('brandFilter').value = '';
    document.getElementById('searchInput').value = '';
    document.getElementById('sortOption').value = 'default';

    currentFilters = {};
    loadProducts();
}

// 加载筛选条件
async function loadFilters() {
    try {
        // 加载分类
        const categoryResponse = await fetch(`${API_BASE_URL}/categories`);
        const categoryData = await categoryResponse.json();

        if (categoryData.success) {
            const categorySelect = document.getElementById('categoryFilter');
            categorySelect.innerHTML = '<option value="">全部分类</option>' +
                categoryData.data.map(cat =>
                    `<option value="${cat.id}">${cat.name}</option>`
                ).join('');
        } else {
            console.error('加载分类失败:', categoryData.message);
        }

        // 加载品牌
        const brandResponse = await fetch(`${API_BASE_URL}/brands`);
        const brandData = await brandResponse.json();

        if (brandData.success) {
            const brandSelect = document.getElementById('brandFilter');
            brandSelect.innerHTML = '<option value="">全部品牌</option>' +
                brandData.data.map(brand =>
                    `<option value="${brand.id}">${brand.name}</option>`
                ).join('');
        } else {
            console.error('加载品牌失败:', brandData.message);
        }
    } catch (error) {
        console.error('加载筛选条件失败：', error);
        showError('加载筛选条件失败，请刷新页面重试');
    }
}

// 查看商品详情
function viewProductDetail(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

// 显示/隐藏加载状态
function showLoading(show) {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = show ? 'block' : 'none';
    }
}

// 显示错误信息
function showError(message) {
    // 使用Alert显示错误信息，可以替换为更优雅的提示方式
    alert('错误: ' + message);
}

// 显示成功信息
function showSuccess(message) {
    // 使用Alert显示成功信息，可以替换为更优雅的提示方式
    alert('成功: ' + message);
}

// 更新商品数量显示
function updateProductCount(total) {
    const countElement = document.getElementById('productCount');
    if (countElement) {
        countElement.textContent = `共 ${total} 件商品`;
    }
}

// 处理键盘事件（回车搜索）
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const searchInput = document.getElementById('searchInput');
        if (searchInput && document.activeElement === searchInput) {
            searchProducts();
        }
    }
});