// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 轮播图功能
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

    // 搜索功能
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');

    searchBtn.addEventListener('click', function() {
        const keyword = searchInput.value;
        if (keyword.trim() !== '') {
            alert(`搜索关键词: ${keyword}`);
            // 实际应用中这里应该是跳转到搜索结果页面或发送AJAX请求
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

    // 商品卡片悬停效果
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });

    // 页脚链接悬停效果
    const footerLinks = document.querySelectorAll('.footer-column li');

    footerLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.color = '#ff5000';
        });

        link.addEventListener('mouseleave', function() {
            this.style.color = '#666';
        });
    });
});