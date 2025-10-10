// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    // 渲染商品基本信息
    document.getElementById('productTitle').textContent = productData.title;
    document.getElementById('productPrice').textContent = `¥${productData.price.toFixed(2)}`;
    document.getElementById('salesCount').textContent = `销量：${productData.sales}件`;
    document.getElementById('reviewCount').textContent = `评价：${productData.reviews}条`;
    document.getElementById('favoriteCount').textContent = `收藏：${productData.favorites}人`;

    // 渲染商品图片
    renderProductImages();

    // 渲染规格选项
    renderSpecifications();

    // 渲染服务信息
    renderServices();

    // 渲染商品详情
    renderProductDetails();

    // 渲染评价信息
    renderEvaluations();

    // 绑定事件
    bindEvents();
});

// 渲染商品图片
function renderProductImages() {
    const mainImg = document.getElementById('mainImg');
    const thumbnailsContainer = document.getElementById('thumbnailsContainer');

    // 设置主图
    mainImg.src = productData.images[0];

    // 渲染缩略图
    productData.images.forEach((img, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.setAttribute('data-img', img);

        const imgElement = document.createElement('img');
        imgElement.src = img.replace('400x400', '60x60');
        imgElement.alt = `缩略图${index + 1}`;

        thumbnail.appendChild(imgElement);
        thumbnailsContainer.appendChild(thumbnail);
    });
}

// 渲染规格选项
function renderSpecifications() {
    const specContainer = document.querySelector('.spec-selector');

    productData.specifications.forEach(spec => {
        const specGroup = document.createElement('div');

        const specTitle = document.createElement('div');
        specTitle.className = 'spec-title';
        specTitle.textContent = spec.name;
        specGroup.appendChild(specTitle);

        const specOptions = document.createElement('div');
        specOptions.className = 'spec-options';

        spec.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = `spec-option ${index === 0 ? 'selected' : ''}`;
            optionElement.textContent = option;
            specOptions.appendChild(optionElement);
        });

        specGroup.appendChild(specOptions);
        specContainer.appendChild(specGroup);
    });
}

// 渲染服务信息
function renderServices() {
    const serviceContainer = document.querySelector('.service-info');

    productData.services.forEach(service => {
        const serviceItem = document.createElement('div');
        serviceItem.className = 'service-item';

        const icon = document.createElement('i');
        icon.textContent = '✓';

        serviceItem.appendChild(icon);
        serviceItem.appendChild(document.createTextNode(service));
        serviceContainer.appendChild(serviceItem);
    });
}

// 渲染商品详情
function renderProductDetails() {
    const tabContent = document.querySelector('.tab-content');

    productData.details.description.forEach(detail => {
        if (detail.startsWith('http')) {
            const img = document.createElement('img');
            img.src = detail;
            img.alt = '商品详情图';
            img.style.width = '100%';
            img.style.marginTop = '15px';
            tabContent.appendChild(img);
        } else {
            const p = document.createElement('p');
            p.textContent = detail;
            tabContent.appendChild(p);
        }
    });
}

// 渲染评价信息
function renderEvaluations() {
    // 评价标题
    document.getElementById('evaluationTitle').textContent = `商品评价 (${productData.evaluations.summary.total})`;

    // 评分
    document.getElementById('ratingScore').textContent = productData.rating;

    // 评价标签
    const ratingTags = document.getElementById('ratingTags');
    const tagData = [
        { text: `全部(${productData.evaluations.summary.total})`, active: true, type: 'all' },
        { text: `好评(${productData.evaluations.summary.good})`, type: 'good' },
        { text: `中评(${productData.evaluations.summary.medium})`, type: 'medium' },
        { text: `差评(${productData.evaluations.summary.bad})`, type: 'bad' },
        { text: `有图(${productData.evaluations.summary.withImages})`, type: 'withImages' },
        { text: `追评(${productData.evaluations.summary.additional})`, type: 'additional' }
    ];

    tagData.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.className = `rating-tag ${tag.active ? 'active' : ''}`;
        tagElement.textContent = tag.text;
        tagElement.setAttribute('data-type', tag.type);
        ratingTags.appendChild(tagElement);
    });

    // 评价列表
    renderEvaluationList(productData.evaluations.list);
}

// 渲染评价列表
function renderEvaluationList(evaluations) {
    const evaluationList = document.getElementById('evaluationList');
    evaluationList.innerHTML = '';

    evaluations.forEach(evaluation => {
        const evaluationItem = document.createElement('div');
        evaluationItem.className = 'evaluation-item';

        const userInfo = document.createElement('div');
        userInfo.className = 'user-info';

        const userAvatar = document.createElement('div');
        userAvatar.className = 'user-avatar';

        const userName = document.createElement('div');
        userName.textContent = evaluation.user;

        userInfo.appendChild(userAvatar);
        userInfo.appendChild(userName);

        const evaluationContent = document.createElement('div');
        evaluationContent.className = 'evaluation-content';
        evaluationContent.textContent = evaluation.content;

        evaluationItem.appendChild(userInfo);
        evaluationItem.appendChild(evaluationContent);
        evaluationList.appendChild(evaluationItem);
    });
}

// 绑定事件
function bindEvents() {
    // 缩略图点击切换主图
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.addEventListener('click', function() {
            // 移除所有缩略图的active类
            document.querySelectorAll('.thumbnail').forEach(t => {
                t.classList.remove('active');
            });

            // 给当前点击的缩略图添加active类
            this.classList.add('active');

            // 切换主图
            const mainImg = document.getElementById('mainImg');
            mainImg.src = this.getAttribute('data-img');
        });
    });

    // 规格选择
    document.querySelectorAll('.spec-option').forEach(option => {
        option.addEventListener('click', function() {
            // 获取同一规格组的其他选项
            const siblings = Array.from(this.parentElement.children);

            // 移除同一规格组的所有selected类
            siblings.forEach(sibling => {
                sibling.classList.remove('selected');
            });

            // 给当前点击的选项添加selected类
            this.classList.add('selected');
        });
    });

    // 数量增减
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decrease');
    const increaseBtn = document.getElementById('increase');

    decreaseBtn.addEventListener('click', function() {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    increaseBtn.addEventListener('click', function() {
        let currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
    });

    // 标签页切换
    document.querySelectorAll('.tab-header').forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有标签的active类
            document.querySelectorAll('.tab-header').forEach(t => {
                t.classList.remove('active');
            });

            // 给当前点击的标签添加active类
            this.classList.add('active');

            // 切换标签内容
            const tabType = this.getAttribute('data-tab');
            switchTabContent(tabType);
        });
    });

    // 评价标签切换
    document.querySelectorAll('.rating-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            // 移除所有标签的active类
            document.querySelectorAll('.rating-tag').forEach(t => {
                t.classList.remove('active');
            });

            // 给当前点击的标签添加active类
            this.classList.add('active');

            // 筛选对应的评价
            const type = this.getAttribute('data-type');
            filterEvaluations(type);
        });
    });
}

// 切换标签内容
function switchTabContent(tabType) {
    const tabContent = document.querySelector('.tab-content');
    tabContent.innerHTML = '';

    switch(tabType) {
        case 'details':
            productData.details.description.forEach(detail => {
                if (detail.startsWith('http')) {
                    const img = document.createElement('img');
                    img.src = detail;
                    img.alt = '商品详情图';
                    img.style.width = '100%';
                    img.style.marginTop = '15px';
                    tabContent.appendChild(img);
                } else {
                    const p = document.createElement('p');
                    p.textContent = detail;
                    tabContent.appendChild(p);
                }
            });
            break;
        case 'specs':
            productData.details.specs.forEach(spec => {
                const p = document.createElement('p');
                p.textContent = spec;
                tabContent.appendChild(p);
            });
            break;
        case 'service':
            productData.details.service.forEach(service => {
                const p = document.createElement('p');
                p.textContent = service;
                tabContent.appendChild(p);
            });
            break;
    }
}

// 筛选评价
function filterEvaluations(type) {
    let filteredEvaluations = [...productData.evaluations.list];

    switch(type) {
        case 'good':
            filteredEvaluations = productData.evaluations.list.filter(e => e.rating >= 4);
            break;
        case 'medium':
            filteredEvaluations = productData.evaluations.list.filter(e => e.rating === 3);
            break;
        case 'bad':
            filteredEvaluations = productData.evaluations.list.filter(e => e.rating <= 2);
            break;
        case 'withImages':
            filteredEvaluations = productData.evaluations.list.filter(e => e.hasImage);
            break;
        case 'additional':
            // 这里简化处理，实际应用中可能需要额外的字段标识追评
            filteredEvaluations = productData.evaluations.list.slice(0, 1);
            break;
        default:
            // 全部评价
            break;
    }

    renderEvaluationList(filteredEvaluations);
}