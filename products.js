// Extensive product database
const products = [
    {
        id: 1,
        title: 'Wireless Bluetooth Headphones with Noise Cancellation',
        price: 89.99,
        originalPrice: 129.99,
        rating: 4.5,
        reviews: 1245,
        image: 'assets/products/headphones.jpg',
        images: [
            'assets/products/headphones-1.jpg',
            'assets/products/headphones-2.jpg',
            'assets/products/headphones-3.jpg'
        ],
        category: 'electronics',
        brand: 'SoundMaster',
        colors: ['Black', 'White', 'Blue'],
        deal: true,
        discount: 31,
        stock: 45,
        description: 'Premium wireless headphones with active noise cancellation technology. Enjoy crystal-clear sound with 30-hour battery life and comfortable over-ear design.',
        features: [
            'Active Noise Cancellation',
            '30-hour battery life',
            'Bluetooth 5.0',
            'Built-in microphone',
            'Foldable design'
        ],
        specifications: {
            'Weight': '250g',
            'Dimensions': '18.5 x 17.5 x 8.5 cm',
            'Connectivity': 'Bluetooth 5.0',
            'Battery': '30 hours playback'
        },
        tags: ['headphones', 'audio', 'wireless', 'bluetooth', 'noise cancellation']
    },
    {
        id: 2,
        title: 'Smart Watch with Fitness Tracker and Heart Rate Monitor',
        price: 129.99,
        originalPrice: 179.99,
        rating: 4.7,
        reviews: 892,
        image: 'assets/products/smartwatch.jpg',
        category: 'electronics',
        brand: 'TechFit',
        colors: ['Black', 'Silver', 'Rose Gold'],
        deal: true,
        discount: 28,
        stock: 32,
        description: 'Stay connected and track your fitness with this advanced smartwatch. Features include heart rate monitoring, sleep tracking, and smartphone notifications.',
        features: [
            'Heart rate monitor',
            'Sleep tracking',
            'Water resistant',
            '7-day battery life',
            'Smart notifications'
        ]
    },
    // Add 28 more products with similar structure across different categories
    {
        id: 30,
        title: 'Organic Cotton Bed Sheets Set - Queen Size',
        price: 49.99,
        originalPrice: 69.99,
        rating: 4.3,
        reviews: 456,
        image: 'assets/products/bedsheets.jpg',
        category: 'home',
        brand: 'HomeComfort',
        colors: ['White', 'Beige', 'Light Blue', 'Gray'],
        deal: false,
        stock: 78,
        description: 'Soft and breathable 100% organic cotton bed sheets set. Includes 1 flat sheet, 1 fitted sheet, and 2 pillowcases.',
        features: [
            '100% organic cotton',
            '300 thread count',
            'Oeko-Tex certified',
            'Machine washable',
            'Queen size'
        ]
    }
];

const categories = [
    {
        id: 'electronics',
        name: 'Electronics',
        icon: 'fas fa-laptop',
        color: '#FFD700',
        subcategories: ['Smartphones', 'Laptops', 'Headphones', 'Cameras']
    },
    {
        id: 'fashion',
        name: 'Fashion',
        icon: 'fas fa-tshirt',
        color: '#FF6347',
        subcategories: ['Men', 'Women', 'Kids', 'Accessories']
    },
    {
        id: 'home',
        name: 'Home & Kitchen',
        icon: 'fas fa-home',
        color: '#4682B4',
        subcategories: ['Furniture', 'Appliances', 'Decor', 'Cookware']
    },
    {
        id: 'beauty',
        name: 'Beauty & Personal Care',
        icon: 'fas fa-spa',
        color: '#FF69B4',
        subcategories: ['Skincare', 'Haircare', 'Makeup', 'Fragrances']
    },
    {
        id: 'sports',
        name: 'Sports & Outdoors',
        icon: 'fas fa-basketball-ball',
        color: '#32CD32',
        subcategories: ['Fitness', 'Camping', 'Cycling', 'Team Sports']
    },
    {
        id: 'toys',
        name: 'Toys & Games',
        icon: 'fas fa-gamepad',
        color: '#9370DB',
        subcategories: ['Board Games', 'Action Figures', 'Puzzles', 'Educational']
    }
];

// Featured, deals, new arrivals, and top rated products
const featuredProducts = products.filter(p => p.id % 2 === 0);
const dealProducts = products.filter(p => p.deal);
const newArrivals = [...products].sort((a, b) => b.id - a.id).slice(0, 8);
const topRated = [...products].sort((a, b) => b.rating - a.rating).slice(0, 8);