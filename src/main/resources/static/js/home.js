// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 1. 轮播图功能
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');

    function showSlide(n) {
        // 隐藏所有幻灯片
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // 显示当前幻灯片
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    // 自动轮播
    setInterval(() => {
        showSlide(currentSlide + 1);
    }, 4000);

    // 点击圆点切换幻灯片
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });

    // 2. 搜索功能 - 修改为页面跳转
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');

    searchBtn.addEventListener('click', function() {
        performSearch();
    });

    // 回车键搜索
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // 执行搜索函数
    function performSearch() {
        const keyword = searchInput.value.trim();

        if (keyword !== '') {
            // 有关键词，跳转到带参数的搜索结果页
            window.location.href = 'search-result?keyword=' + encodeURIComponent(keyword);
        } else {
            // 没有关键词，跳转到原始搜索结果页
            window.location.href = 'search-result';
        }
    }

    // 3. 分类菜单悬停效果
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

    // 4. 主导航菜单悬停效果
    const navItems = document.querySelectorAll('.nav-items li');

    navItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#ff6a00';
        });

        item.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });

    // 5. 商品卡片功能
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        // 商品卡片悬停效果
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });

        // 商品卡片点击跳转
        card.addEventListener('click', function(e) {
            // 获取商品ID
            const productId = this.getAttribute('data-product-id');
            if (productId) {
                // 跳转到商品详情页
                window.location.href = 'MerchandisePage.html?id=' + productId;
            }
        });

        // 添加指针样式
        card.style.cursor = 'pointer';
    });

    // 6. 页脚链接悬停效果
    const footerLinks = document.querySelectorAll('.footer-column li');

    footerLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.color = '#ff5000';
        });

        link.addEventListener('mouseleave', function() {
            this.style.color = '#666';
        });
    });

    // 7. 顶部导航链接悬停效果
    const topNavLinks = document.querySelectorAll('.top-nav a');

    topNavLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.color = '#ff5000';
        });

        link.addEventListener('mouseleave', function() {
            this.style.color = '#666';
        });
    });

    // 8. 购物车悬停效果
    const cart = document.querySelector('.cart');
    if (cart) {
        cart.addEventListener('mouseenter', function() {
            this.style.color = '#ff5000';
        });

        cart.addEventListener('mouseleave', function() {
            this.style.color = '#333';
        });
    }
});

// 辅助函数：防抖函数，用于优化搜索等频繁触发的事件
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 辅助函数：格式化价格显示
function formatPrice(price) {
    return '¥' + parseFloat(price).toFixed(2);
}

// 辅助函数：获取URL参数
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// 页面加载动画
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});