// 商品数据 - 模拟从后端API获取
const productData = {
    id: "P001",
    title: "2023新款夏季男士短袖T恤 纯棉休闲百搭潮流上衣 多色可选",
    price: 89.00,
    originalPrice: 129.00,
    sales: 2586,
    reviews: 1258,
    favorites: 856,
    rating: 4.8,
    images: [
        "https://via.placeholder.com/400x400",
        "https://via.placeholder.com/400x400/ff5000/ffffff",
        "https://via.placeholder.com/400x400/007bff/ffffff",
        "https://via.placeholder.com/400x400/28a745/ffffff",
        "https://via.placeholder.com/400x400/6f42c1/ffffff"
    ],
    specifications: [
        {
            name: "颜色",
            options: ["白色", "黑色", "灰色", "蓝色"]
        },
        {
            name: "尺码",
            options: ["S", "M", "L", "XL", "XXL"]
        }
    ],
    services: [
        "7天无理由退货",
        "48小时发货",
        "运费险",
        "正品保证"
    ],
    details: {
        description: [
            "商品详情内容区域...",
            "这里可以展示商品的详细图片、文字描述、尺寸信息等。",
            "https://via.placeholder.com/800x400"
        ],
        specs: [
            "材质：100%棉",
            "款式：圆领",
            "厚度：适中",
            "季节：夏季"
        ],
        service: [
            "本店支持7天无理由退货",
            "商品质量问题免费退换",
            "全国包邮（偏远地区除外）",
            "提供正规发票"
        ]
    },
    evaluations: {
        summary: {
            total: 1258,
            good: 1156,
            medium: 89,
            bad: 13,
            withImages: 256,
            additional: 45
        },
        list: [
            {
                user: "用户123456",
                rating: 5,
                content: "衣服质量很好，穿着舒适，尺码标准，颜色也很正，下次还会再来购买。",
                date: "2023-06-15",
                hasImage: true
            },
            {
                user: "买家789012",
                rating: 4,
                content: "物流很快，第二天就收到了。衣服面料不错，透气性好，夏天穿很舒服。",
                date: "2023-06-10",
                hasImage: false
            },
            {
                user: "购物达人888",
                rating: 5,
                content: "非常满意的一次购物，衣服版型很好，颜色没有色差，值得推荐！",
                date: "2023-06-05",
                hasImage: true
            }
        ]
    }
};