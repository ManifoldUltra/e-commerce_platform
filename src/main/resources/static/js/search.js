// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 模拟搜索结果数据
    const searchResults = [
        {
            id: 1,
            title: "苹果iPhone 14 Pro Max 5G手机 全网通 128GB 深空黑",
            price: 8999,
            originalPrice: 9999,
            sales: 12500,
            rating: 4.9,
            ratingCount: 5600,
            tag: "新品"
        },
        {
            id: 2,
            title: "华为Mate 50 Pro 5G手机 全网通 256GB 曜金黑",
            price: 6799,
            originalPrice: 7999,
            sales: 8900,
            rating: 4.8,
            ratingCount: 4200,
            tag: "旗舰"
        },
        {
            id: 3,
            title: "小米13 Ultra 5G手机 全网通 512GB 白色",
            price: 5999,
            originalPrice: 6499,
            sales: 15600,
            rating: 4.7,
            ratingCount: 7800,
            tag: "热销"
        },
        {
            id: 4,
            title: "OPPO Find X6 Pro 5G手机 全网通 256GB 星空黑",
            price: 5999,
            originalPrice: 6999,
            sales: 6300,
            rating: 4.6,
            ratingCount: 3200,
            tag: "新品"
        },
        {
            id: 5,
            title: "vivo X90 Pro+ 5G手机 全网通 512GB 华夏红",
            price: 6999,
            originalPrice: 7999,
            sales: 5200,
            rating: 4.8,
            ratingCount: 2900,
            tag: "旗舰"
        },
        {
            id: 6,
            title: "三星Galaxy S23 Ultra 5G手机 全网通 256GB 悠雾紫",
            price: 8999,
            originalPrice: 9699,
            sales: 3800,
            rating: 4.7,
            ratingCount: 2100,
            tag: "旗舰"
        },
        {
            id: 7,
            title: "荣耀Magic5 Pro 5G手机 全网通 512GB 燃橙色",
            price: 5699,
            originalPrice: 6199,
            sales: 7200,
            rating: 4.6,
            ratingCount: 3600,
            tag: "热销"
        },
        {
            id: 8,
            title: "一加11 5G手机 全网通 256GB 无尽黑",
            price: 4399,
            originalPrice: 4999,
            sales: 8900,
            rating: 4.7,
            ratingCount: 4500,
            tag: "性价比"
        },
        {
            id: 9,
            title: "realme GT Neo5 5G手机 全网通 240W快充 150W光速秒充",
            price: 3299,
            originalPrice: 3599,
            sales: 11200,
            rating: 4.5,
            ratingCount: 6800,
            tag: "热销"
        },
        {
            id: 10,
            title: "魅族20 PRO 5G手机 全网通 512GB 晨曦紫",
            price: 4799,
            originalPrice: 5399,
            sales: 4200,
            rating: 4.6,
            ratingCount: 2300,
            tag: "新品"
        },
        {
            id: 11,
            title: "红米K60 Pro 5G手机 全网通 256GB 晴雪白",
            price: 3299,
            originalPrice: 3899,
            sales: 15800,
            rating: 4.5,
            ratingCount: 8900,
            tag: "热销"
        },
        {
            id: 12,
            title: "iQOO 11 5G手机 全网通 256GB 传奇版",
            price: 4299,
            originalPrice: 4999,
            sales: 6800,
            rating: 4.6,
            ratingCount: 3400,
            tag: "性价比"
        }
    ];

    // 渲染搜索结果
    function renderResults(results) {
        const resultsList = document.getElementById('resultsList');
        resultsList.innerHTML = '';

        results.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';

            // 生成星级评分
            const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));

            productCard.innerHTML = `
                <div class="product-img">
                    <div class="product-tag">${product.tag}</div>
                    商品图片
                </div>
                <div class="product-info">
                    <div class="product-title">${product.title}</div>
                    <div class="product-price">¥${product.price.toLocaleString()}</div>
                    <div class="product-original-price">¥${product.originalPrice.toLocaleString()}</div>
                    <div class="product-sales">已售${(product.sales / 10000).toFixed(1)}万件</div>
                    <div class="product-rating">
                        <div class="rating-stars">${stars}</div>
                        <div class="rating-count">${product.ratingCount}评价</div>
                    </div>
                </div>
            `;

            resultsList.appendChild(productCard);
        });
    }

    // 初始化渲染
    renderResults(searchResults);

    // 搜索功能
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');

    searchBtn.addEventListener('click', function() {
        const keyword = searchInput.value;
        if (keyword.trim() !== '') {
            // 在实际应用中，这里应该发送AJAX请求获取搜索结果
            alert(`搜索关键词: ${keyword}`);

            // 更新面包屑导航
            document.querySelector('.breadcrumb .current').textContent = `搜索"${keyword}"`;

            // 更新搜索结果统计
            document.querySelector('.results-count').textContent = searchResults.length;
        } else {
            alert('请输入搜索关键词');
        }
    });

    // 回车键搜索
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });

    // 分类菜单悬停效果
    const allCategories = document.querySelector('.all-categories');
    const categoriesMenu = document.querySelector('.categories-menu');

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

    // 排序选项功能
    const sortItems = document.querySelectorAll('.sort-item');

    sortItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有排序选项的active类
            sortItems.forEach(sortItem => {
                sortItem.classList.remove('active');
            });

            // 给当前点击的排序选项添加active类
            this.classList.add('active');

            // 获取排序类型
            const sortType = this.getAttribute('data-sort');

            // 根据排序类型对结果进行排序
            let sortedResults = [...searchResults];

            switch(sortType) {
                case 'sales':
                    sortedResults.sort((a, b) => b.sales - a.sales);
                    break;
                case 'price-asc':
                    sortedResults.sort((a, b) => a.price - b.price);
                    break;
                case 'price-desc':
                    sortedResults.sort((a, b) => b.price - a.price);
                    break;
                case 'new':
                    // 假设新品是ID较大的商品
                    sortedResults.sort((a, b) => b.id - a.id);
                    break;
                case 'rating':
                    sortedResults.sort((a, b) => b.rating - a.rating);
                    break;
                default:
                    // 默认排序，按ID排序
                    sortedResults.sort((a, b) => a.id - b.id);
            }

            // 重新渲染排序后的结果
            renderResults(sortedResults);
        });
    });

    // 筛选条件功能
    const filterCheckboxes = document.querySelectorAll('.filter-options input');

    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // 在实际应用中，这里应该根据选中的筛选条件发送AJAX请求
            // 这里只是模拟筛选效果
            const selectedFilters = {
                brand: Array.from(document.querySelectorAll('input[name="brand"]:checked')).map(cb => cb.value),
                price: Array.from(document.querySelectorAll('input[name="price"]:checked')).map(cb => cb.value),
                memory: Array.from(document.querySelectorAll('input[name="memory"]:checked')).map(cb => cb.value),
                screen: Array.from(document.querySelectorAll('input[name="screen"]:checked')).map(cb => cb.value)
            };

            console.log('筛选条件:', selectedFilters);

            // 模拟筛选后的结果
            let filteredResults = [...searchResults];

            // 如果选择了品牌筛选
            if (selectedFilters.brand.length > 0) {
                filteredResults = filteredResults.filter(product => {
                    // 这里只是简单模拟，实际应根据品牌名称匹配
                    return selectedFilters.brand.some(brand =>
                        product.title.toLowerCase().includes(brand)
                    );
                });
            }

            // 更新搜索结果统计
            document.querySelector('.results-count').textContent = filteredResults.length;

            // 重新渲染筛选后的结果
            renderResults(filteredResults);
        });
    });

    // 分页功能
    const pageItems = document.querySelectorAll('.page-item:not(.disabled)');

    pageItems.forEach(item => {
        item.addEventListener('click', function() {
            if (this.textContent === '上一页' || this.textContent === '下一页') {
                // 处理上一页/下一页逻辑
                alert(`跳转到${this.textContent}`);
            } else {
                // 处理页码点击
                document.querySelectorAll('.page-item').forEach(page => {
                    page.classList.remove('active');
                });

                this.classList.add('active');
                alert(`跳转到第${this.textContent}页`);

                // 在实际应用中，这里应该发送AJAX请求获取对应页面的数据
            }
        });
    });

    // 商品卡片悬停效果
    document.addEventListener('mouseover', function(e) {
        if (e.target.closest('.product-card')) {
            const card = e.target.closest('.product-card');
            card.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
            card.style.transform = 'translateY(-3px)';
        }
    });

    document.addEventListener('mouseout', function(e) {
        if (e.target.closest('.product-card')) {
            const card = e.target.closest('.product-card');
            card.style.boxShadow = '';
            card.style.transform = '';
        }
    });
});