// product-detail.js

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
});

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
            showProductContent(true);
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

    // 设置页面标题
    document.title = `${spuInfo.title} - 电商平台`;
    document.getElementById('pageTitle').textContent = spuInfo.title;

    // 设置商品基本信息
    document.getElementById('productTitle').textContent = spuInfo.title;
    document.getElementById('productSubTitle').textContent = spuInfo.subTitle || '';

    // 设置面包屑导航
    updateBreadcrumb(spuInfo);

    // 设置商品图片
    if (skus && skus.length > 0) {
        const firstSku = skus[0];
        updateProductImages(firstSku.images);
    }

    // 设置商品详情内容
    document.getElementById('productDescription').innerHTML = spuDetail.description || '暂无商品描述';
    document.getElementById('packingList').textContent = spuDetail.packingList || '暂无包装清单信息';
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
        specialSpec = {};
    }

    const specContainer = document.getElementById('specSelection');

    // 如果没有规格，隐藏规格选择区域
    if (Object.keys(specialSpec).length === 0) {
        specContainer.style.display = 'none';
        return;
    }

    specContainer.innerHTML = Object.entries(specialSpec).map(([specName, specValues]) => `
        <div class="mb-3">
            <label class="form-label">${specName}</label>
            <div>
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
            showError('该规格组合暂无库存');
        }
    } catch (error) {
        console.error('查找SKU失败：', error);
        updateSpecAvailability();
        showError('查找商品失败，请重试');
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
    document.getElementById('currentPrice').textContent = `¥${formatPrice(sku.price)}`;
    document.getElementById('stockCount').textContent = stock ? stock.stock : 0;

    // 更新商品图片
    updateProductImages(sku.images);

    // 更新数量选择器的最大值
    const maxQuantity = stock ? Math.min(stock.stock, 999) : 1;
    document.getElementById('quantity').max = maxQuantity;

    // 如果库存为0，禁用购买按钮
    const addToCartBtn = document.querySelector('.btn-danger');
    const buyNowBtn = document.querySelector('.btn-warning');
    if (stock && stock.stock === 0) {
        addToCartBtn.disabled = true;
        buyNowBtn.disabled = true;
        addToCartBtn.textContent = '缺货';
        buyNowBtn.textContent = '缺货';
    } else {
        addToCartBtn.disabled = false;
        buyNowBtn.disabled = false;
        addToCartBtn.innerHTML = '<i class="bi bi-cart-plus"></i> 加入购物车';
        buyNowBtn.innerHTML = '<i class="bi bi-lightning"></i> 立即购买';
    }

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

    const mainImage = document.getElementById('mainImage');
    const thumbnailList = document.getElementById('thumbnailList');

    // 设置主图
    mainImage.src = images[0];
    mainImage.alt = productData.spuInfo.title;

    // 设置缩略图
    thumbnailList.innerHTML = images.map((image, index) => `
        <img src="${image}" 
             class="thumbnail ${index === 0 ? 'active' : ''}" 
             alt="商品图片 ${index + 1}"
             onclick="changeMainImage('${image}', this)"
             onerror="this.src='/images/placeholder.jpg'">
    `).join('');
}

// 切换主图
function changeMainImage(imageUrl, element) {
    document.getElementById('mainImage').src = imageUrl;

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
        genericSpec = {};
    }

    if (Object.keys(genericSpec).length === 0) {
        specTable.innerHTML = '<tr><td colspan="2" class="text-center">暂无规格参数</td></tr>';
        return;
    }

    specTable.innerHTML = Object.entries(genericSpec).map(([name, value]) => `
        <tr>
            <td class="spec-name">${name}</td>
            <td>${value}</td>
        </tr>
    `).join('');
}

// 更新面包屑导航
function updateBreadcrumb(spuInfo) {
    // 这里需要根据分类ID加载分类路径
    // 简化实现，直接显示商品标题
    const breadcrumb = document.getElementById('breadcrumb');
    breadcrumb.innerHTML = `
        <li class="breadcrumb-item"><a href="product-list.html">首页</a></li>
        <li class="breadcrumb-item active">${spuInfo.title}</li>
    `;
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

// 价格格式化（分转元）
function formatPrice(priceInFen) {
    if (!priceInFen) return '0.00';
    return (priceInFen / 100).toFixed(2);
}

// 显示加载状态
function showLoading(show) {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = show ? 'block' : 'none';
    }
}

// 显示/隐藏商品内容
function showProductContent(show) {
    const contentElement = document.getElementById('productContent');
    if (contentElement) {
        contentElement.style.display = show ? 'block' : 'none';
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

// 处理键盘事件
document.addEventListener('keydown', function(event) {
    // 可以添加键盘快捷键等
});