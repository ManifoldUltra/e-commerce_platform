// 全局变量
let productData = null;
let selectedSku = null;
let selectedSpecs = {};
let quantity = 1;

// API基础URL - 根据您的实际后端地址修改
const API_BASE_URL = 'http://localhost:8080/api';

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        loadProductDetail(productId);
    } else {
        showError('商品ID参数缺失');
    }

    // 绑定事件
    bindEvents();
});

// 绑定所有事件
function bindEvents() {
    // 数量选择事件
    document.getElementById('decrease').addEventListener('click', decreaseQuantity);
    document.getElementById('increase').addEventListener('click', increaseQuantity);
    document.getElementById('quantity').addEventListener('change', validateQuantity);

    // 操作按钮事件
    document.getElementById('buyNowBtn').addEventListener('click', buyNow);
    document.getElementById('addCartBtn').addEventListener('click', addToCart);

    // 标签页切换事件
    document.querySelectorAll('.tab-header').forEach(tab => {
        tab.addEventListener('click', function() {
            switchTab(this.getAttribute('data-tab'));
        });
    });

    // 分类菜单悬停效果
    const allCategories = document.querySelector('.all-categories');
    const categoriesMenu = document.querySelector('.categories-menu');

    if (allCategories && categoriesMenu) {
        allCategories.addEventListener('mouseenter', function() {
            categoriesMenu.style.display = 'block';
        });

        allCategories.addEventListener('mouseleave', function() {
            categoriesMenu.style.display = 'none';
        });

        categoriesMenu.addEventListener('mouseenter', function() {
            this.style.display = 'block';
        });

        categoriesMenu.addEventListener('mouseleave', function() {
            this.style.display = 'none';
        });
    }

    // 主导航菜单悬停效果
    const navItems = document.querySelectorAll('.nav-items li');
    navItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#ff6a00';
        });

        item.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });

    // 顶部导航链接悬停效果
    const topNavLinks = document.querySelectorAll('.top-nav a');
    topNavLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.color = '#ff5000';
        });

        link.addEventListener('mouseleave', function() {
            this.style.color = '#666';
        });
    });
}

// 切换标签页
function switchTab(tabName) {
    // 移除所有active类
    document.querySelectorAll('.tab-header').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

    // 添加active类
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName + 'Tab').classList.add('active');
}

// 加载商品详情
async function loadProductDetail(productId) {
    showLoading(true);

    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`);
        const data = await response.json();

        if (data.success) {
            productData = data.data;
            displayProductDetail();
            initializeSpecSelection();
            document.getElementById('productContent').style.display = 'block';

            // 加载评价数据
            loadEvaluations(productId);
        } else {
            showError('加载商品详情失败：' + data.message);
        }
    } catch (error) {
        console.error('加载商品详情错误:', error);
        showError('网络错误：' + error.message);
    } finally {
        showLoading(false);
    }
}

// 显示商品详情
function displayProductDetail() {
    const { spuInfo, spuDetail, skus } = productData;

    // 设置商品基本信息
    document.getElementById('productTitle').textContent = spuInfo.title;
    document.title = `${spuInfo.title} - 京里多多`;

    // 设置面包屑导航
    document.getElementById('productBreadcrumb').textContent = spuInfo.title;

    // 设置商品图片
    if (skus && skus.length > 0) {
        const firstSku = skus[0];
        updateProductImages(firstSku.images);
    }

    // 设置商品详情内容
    document.getElementById('productDescription').innerHTML = spuDetail.description || '暂无商品描述';
    document.getElementById('afterService').textContent = spuDetail.afterService || '暂无售后服务信息';

    // 设置规格参数表格
    updateSpecTable(spuDetail);
}

// 初始化规格选择
function initializeSpecSelection() {
    const { spuDetail, skus } = productData;

    // 解析特有规格
    let specialSpec = {};
    try {
        specialSpec = JSON.parse(spuDetail.specialSpec || '{}');
    } catch (e) {
        console.error('解析规格参数错误:', e);
    }

    const specContainer = document.getElementById('specSelection');

    specContainer.innerHTML = Object.entries(specialSpec).map(([specName, specValues]) => `
            <div class="spec-group">
                <div class="spec-title">${specName}</div>
                <div class="spec-options">
                    ${specValues.map(value => `
                        <span class="spec-option"
                              data-spec="${specName}"
                              data-value="${value}"
                              onclick="selectSpec('${specName}', '${value}')">
                            ${value}
                        </span>
                    `).join('')}
                </div>
            </div>
        `).join('');

    // 默认选择第一个SKU
    if (skus && skus.length > 0) {
        selectSku(skus[0]);
    }
}

// 选择规格
async function selectSpec(specName, specValue) {
    // 更新选择的规格
    selectedSpecs[specName] = specValue;

    // 更新UI显示
    document.querySelectorAll(`[data-spec="${specName}"]`).forEach(option => {
        option.classList.remove('selected');
        if (option.getAttribute('data-value') === specValue) {
            option.classList.add('selected');
        }
    });

    // 调用API查找匹配的SKU
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productData.spuInfo.id}/sku`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(selectedSpecs)
        });

        const data = await response.json();

        if (data.success) {
            selectSku(data.data.sku, data.data.stock);
        } else {
            // 如果没有完全匹配的SKU，更新规格可用性
            updateSpecAvailability();
        }
    } catch (error) {
        console.error('查找SKU失败：', error);
        updateSpecAvailability();
    }
}

// 更新规格可用性
function updateSpecAvailability() {
    const { skus } = productData;
    const availableCombinations = new Set();

    // 收集所有可用的规格组合
    skus.forEach(sku => {
        if (sku.enable && sku.stock > 0) {
            try {
                const ownSpec = JSON.parse(sku.ownSpec || '{}');
                Object.entries(ownSpec).forEach(([specName, specValue]) => {
                    availableCombinations.add(`${specName}:${specValue}`);
                });
            } catch (e) {
                console.error('解析SKU规格错误:', e);
            }
        }
    });

    // 更新规格选项状态
    document.querySelectorAll('.spec-option').forEach(option => {
        const specName = option.getAttribute('data-spec');
        const specValue = option.getAttribute('data-value');
        const isAvailable = availableCombinations.has(`${specName}:${specValue}`);

        option.classList.toggle('disabled', !isAvailable);
    });
}

// 选择SKU
function selectSku(sku, stock) {
    selectedSku = sku;

    // 更新价格和库存
    document.getElementById('productPrice').textContent = `¥${formatPrice(sku.price)}`;

    // 更新商品图片
    updateProductImages(sku.images);

    // 更新数量选择器的最大值
    const maxQuantity = stock ? Math.min(stock.stock, 999) : 1;
    document.getElementById('quantity').max = maxQuantity;

    // 解析并显示规格
    try {
        const ownSpec = JSON.parse(sku.ownSpec || '{}');
        selectedSpecs = { ...ownSpec };

        // 更新规格选择UI
        Object.entries(ownSpec).forEach(([specName, specValue]) => {
            document.querySelectorAll(`[data-spec="${specName}"]`).forEach(option => {
                option.classList.remove('selected');
                if (option.getAttribute('data-value') === specValue) {
                    option.classList.add('selected');
                }
            });
        });
    } catch (e) {
        console.error('解析SKU规格错误:', e);
    }
}

// 更新商品图片
function updateProductImages(images) {
    if (!images || images.length === 0) {
        images = ['/images/placeholder.jpg'];
    }

    const mainImage = document.getElementById('mainImg');
    const thumbnailList = document.getElementById('thumbnailsContainer');

    // 设置主图
    mainImage.src = images[0];
    mainImage.alt = productData.spuInfo.title;

    // 设置缩略图
    thumbnailList.innerHTML = images.map((image, index) => `
            <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeMainImage('${image}', this)">
                <img src="${image}" alt="商品图片 ${index + 1}" onerror="this.src='/images/placeholder.jpg'">
            </div>
        `).join('');
}

// 切换主图
function changeMainImage(imageUrl, element) {
    document.getElementById('mainImg').src = imageUrl;

    // 更新缩略图激活状态
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    element.classList.add('active');
}

// 更新规格参数表格
function updateSpecTable(spuDetail) {
    const specTable = document.getElementById('specTable');

    // 解析通用规格
    let genericSpec = {};
    try {
        genericSpec = JSON.parse(spuDetail.genericSpec || '{}');
    } catch (e) {
        console.error('解析通用规格错误:', e);
    }

    specTable.innerHTML = Object.entries(genericSpec).map(([name, value]) => `
            <tr>
                <td>${name}</td>
                <td>${value}</td>
            </tr>
        `).join('');
}

// 增加数量
function increaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    let current = parseInt(quantityInput.value);

    if (current < parseInt(quantityInput.max)) {
        quantityInput.value = current + 1;
        quantity = quantityInput.value;
    }
}

// 减少数量
function decreaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    let current = parseInt(quantityInput.value);

    if (current > 1) {
        quantityInput.value = current - 1;
        quantity = quantityInput.value;
    }
}

// 验证数量
function validateQuantity() {
    const quantityInput = document.getElementById('quantity');
    let value = parseInt(quantityInput.value);

    if (isNaN(value) || value < 1) {
        quantityInput.value = 1;
    } else if (value > parseInt(quantityInput.max)) {
        quantityInput.value = quantityInput.max;
    }

    quantity = quantityInput.value;
}

// 加入购物车
async function addToCart() {
    if (!selectedSku) {
        showError('请选择商品规格');
        return;
    }

    // 检查库存
    try {
        const stockCheckResponse = await fetch(`${API_BASE_URL}/products/${selectedSku.id}/stock?quantity=${quantity}`);
        const stockCheckData = await stockCheckResponse.json();

        if (!stockCheckData.success || !stockCheckData.data) {
            showError('库存不足');
            return;
        }

        const response = await fetch(`${API_BASE_URL}/cart/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                skuId: selectedSku.id,
                quantity: parseInt(quantity)
            })
        });

        const data = await response.json();

        if (data.success) {
            showSuccess('商品已成功加入购物车');
        } else {
            showError('加入购物车失败：' + data.message);
        }
    } catch (error) {
        console.error('加入购物车错误:', error);
        showError('网络错误：' + error.message);
    }
}

// 立即购买
function buyNow() {
    if (!selectedSku) {
        showError('请选择商品规格');
        return;
    }

    // 跳转到确认订单页面
    window.location.href = `order-confirm.html?skuId=${selectedSku.id}&quantity=${quantity}`;
}

// 加载评价数据
async function loadEvaluations(productId) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}/evaluations`);
        const data = await response.json();

        if (data.success) {
            displayEvaluations(data.data);
        } else {
            console.error('加载评价失败：' + data.message);
        }
    } catch (error) {
        console.error('加载评价错误:', error);
    }
}

// 显示评价
function displayEvaluations(evaluations) {
    if (!evaluations || evaluations.length === 0) {
        document.getElementById('evaluationList').innerHTML = '<p class="text-center text-muted">暂无评价</p>';
        return;
    }

    // 更新评价统计
    document.getElementById('reviewCount').textContent = `评价：${evaluations.length}`;

    // 显示评价列表
    document.getElementById('evaluationList').innerHTML = evaluations.map(eval => `
            <div class="evaluation-item">
                <div class="user-info">
                    <div class="user-avatar">
                        ${eval.userName ? eval.userName.charAt(0) : '用'}
                    </div>
                    <div>${eval.userName || '匿名用户'}</div>
                </div>
                <div class="evaluation-rating">
                    ${generateStarRating(eval.rating || 5)}
                </div>
                <div class="evaluation-content">${eval.content || '此用户没有填写评价。'}</div>
                ${eval.images && eval.images.length > 0 ? `
                    <div class="evaluation-images">
                        ${eval.images.map(img => `
                            <img src="${img}" class="eval-image" alt="评价图片">
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('');
}

// 生成星级评分
function generateStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '★';
        } else {
            stars += '☆';
        }
    }
    return stars;
}

// 价格格式化（分转元）
function formatPrice(priceInFen) {
    if (!priceInFen) return '0.00';
    return (priceInFen / 100).toFixed(2);
}

// 显示加载状态
function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
}

// 显示错误信息
function showError(message) {
    alert('错误: ' + message);
}

// 显示成功信息
function showSuccess(message) {
    alert('成功: ' + message);
}