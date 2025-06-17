// DOM Elements
const elements = {
    productGrid: document.querySelector('.product-grid'),
    dealsGrid: document.querySelector('.deals-grid'),
    newArrivalsGrid: document.querySelector('.new-arrivals .product-grid'),
    topRatedGrid: document.querySelector('.top-rated .product-grid'),
    categoryGrid: document.querySelector('.category-grid'),
    mobileMenuCategories: document.querySelector('.mobile-menu-categories'),
    cartCount: document.querySelector('.cart-count'),
    cartItems: document.querySelector('.cart-items'),
    cartItemCount: document.querySelector('.cart-item-count'),
    cartTotal: document.querySelector('.cart-total'),
    searchInput: document.querySelector('.search-input'),
    searchButton: document.querySelector('.search-button'),
    searchSelect: document.querySelector('.search-select'),
    accountDropdown: document.querySelector('.account-dropdown'),
    accountTrigger: document.querySelector('.account-trigger'),
    cartDropdown: document.querySelector('.cart-dropdown'),
    cartTrigger: document.querySelector('.cart-trigger'),
    mobileMenu: document.querySelector('.mobile-menu'),
    mobileMenuBtn: document.querySelector('.mobile-menu-btn'),
    mobileMenuClose: document.querySelector('.mobile-menu-close'),
    mobileMenuOverlay: document.createElement('div'),
    slides: document.querySelectorAll('.slide'),
    indicators: document.querySelectorAll('.indicator'),
    prevBtn: document.querySelector('.slide-nav.prev'),
    nextBtn: document.querySelector('.slide-nav.next'),
    mobileNavItems: document.querySelectorAll('.mobile-nav-item'),
    offlineNotification: document.querySelector('.offline-notification'),
    backToTop: document.querySelector('.back-to-top'),
    newsletterForm: document.querySelector('.newsletter-form'),
    viewCartBtn: document.querySelector('.btn-view-cart'),
    checkoutBtn: document.querySelector('.btn-checkout'),
    signInBtn: document.querySelector('.btn-signin'),
    registerBtn: document.querySelector('.btn-register')
};

// App State
let state = {
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    currentSlide: 0,
    slideInterval: null,
    searchQuery: '',
    selectedCategory: 'all',
    isOnline: navigator.onLine
};

// Initialize the app
function init() {
    renderCategories();
    renderProducts();
    renderMobileMenuCategories();
    updateCart();
    setupEventListeners();
    startSlideshow();
    checkOnlineStatus();
}

// Render product categories
function renderCategories() {
    elements.categoryGrid.innerHTML = categories.map(category => `
        <div class="category-card" data-id="${category.id}">
            <div class="category-icon" style="background-color: ${category.color};">
                <i class="${category.icon}"></i>
            </div>
            <h3>${category.name}</h3>
        </div>
    `).join('');
}

// Render mobile menu categories
function renderMobileMenuCategories() {
    elements.mobileMenuCategories.innerHTML = categories.map(category => `
        <a href="#" class="mobile-menu-category" data-id="${category.id}">
            <div class="mobile-menu-category-icon" style="background-color: ${category.color};">
                <i class="${category.icon}"></i>
            </div>
            <span>${category.name}</span>
            <i class="fas fa-chevron-right"></i>
        </a>
    `).join('');
}

// Render products based on current filter
function renderProducts(productsToRender = products) {
    // Clear existing products
    elements.productGrid.innerHTML = '';
    elements.dealsGrid.innerHTML = '';
    elements.newArrivalsGrid.innerHTML = '';
    elements.topRatedGrid.innerHTML = '';
    
    // Render filtered products
    if (productsToRender.length === 0) {
        elements.productGrid.innerHTML = '<div class="no-results">No products found matching your search</div>';
        return;
    }
    
    // Render all product grids
    renderProductGrid(productsToRender, elements.productGrid);
    renderProductGrid(dealProducts, elements.dealsGrid);
    renderProductGrid(newArrivals, elements.newArrivalsGrid);
    renderProductGrid(topRated, elements.topRatedGrid);
}

// Helper function to render a single product grid
function renderProductGrid(productsArray, gridElement) {
    gridElement.innerHTML = productsArray.map(product => `
        <div class="product-card" data-id="${product.id}">
            ${product.deal ? `<div class="product-badge badge-danger">${product.discount}% OFF</div>` : ''}
            ${product.stock < 10 ? `<div class="product-badge badge-warning">Low Stock</div>` : ''}
            <button class="product-wishlist">
                <i class="far fa-heart"></i>
            </button>
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                    ${product.discount ? `<span class="discount">Save ${product.discount}%</span>` : ''}
                </div>
                <div class="product-rating">
                    <span class="rating-stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</span>
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary btn-sm btn-add-to-cart">Add to Cart</button>
                    <button class="btn btn-secondary btn-sm btn-view">View</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Update cart UI
function updateCart() {
    const itemCount = state.cart.reduce((total, item) => total + item.quantity, 0);
    const subtotal = state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Update cart count
    elements.cartCount.textContent = itemCount;
    elements.cartItemCount.textContent = `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`;
    
    // Update cart items
    elements.cartItems.innerHTML = state.cart.length === 0 ? 
        `<div class="empty-cart">
            <i class="fas fa-shopping-cart"></i>
            <p>Your cart is empty</p>
        </div>` :
        state.cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn plus">+</button>
                    </div>
                    <button class="btn-remove">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `).join('');
    
    // Update cart total
    elements.cartTotal.textContent = `$${subtotal.toFixed(2)}`;
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(state.cart));
}

// Add product to cart
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = state.cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        state.cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    updateCart();
    showToast(`Added ${product.title} to cart`);
}

// Remove product from cart
function removeFromCart(productId) {
    const product = products.find(p => p.id === productId);
    state.cart = state.cart.filter(item => item.id !== productId);
    updateCart();
    showToast(`Removed ${product.title} from cart`);
}

// Update product quantity in cart
function updateCartItemQuantity(productId, newQuantity) {
    const item = state.cart.find(item => item.id === productId);
    if (!item) return;
    
    if (newQuantity < 1) {
        removeFromCart(productId);
    } else {
        item.quantity = newQuantity;
        updateCart();
    }
}

// Search products
function searchProducts() {
    const query = elements.searchInput.value.toLowerCase();
    const category = elements.searchSelect.value.toLowerCase();
    
    let filteredProducts = products;
    
    if (category !== 'all') {
        filteredProducts = filteredProducts.filter(product => 
            product.category === category
        );
    }
    
    if (query) {
        filteredProducts = filteredProducts.filter(product => 
            product.title.toLowerCase().includes(query) || 
            (product.description && product.description.toLowerCase().includes(query)) ||
            (product.tags && product.tags.some(tag => tag.includes(query)))
        );
    }
    
    renderProducts(filteredProducts);
}

// View product details
function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // In a real app, this would navigate to a product detail page
    // For this demo, we'll show a modal with product info
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <div class="product-modal-images">
                <div class="main-image">
                    <img src="${product.image}" alt="${product.title}">
                </div>
                <div class="thumbnail-images">
                    ${[product.image, ...(product.images || [])].slice(0, 4).map(img => `
                        <img src="${img}" alt="${product.title}">
                    `).join('')}
                </div>
            </div>
            <div class="product-modal-info">
                <h2>${product.title}</h2>
                <div class="product-modal-brand">Brand: ${product.brand || 'Unknown'}</div>
                <div class="product-modal-rating">
                    <span class="rating-stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</span>
                    <span class="rating-count">${product.reviews} reviews</span>
                </div>
                <div class="product-modal-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                    ${product.discount ? `<span class="discount">Save ${product.discount}%</span>` : ''}
                </div>
                <div class="product-modal-stock">
                    ${product.stock > 10 ? 
                        '<span class="in-stock"><i class="fas fa-check-circle"></i> In Stock</span>' : 
                        `<span class="low-stock"><i class="fas fa-exclamation-circle"></i> Only ${product.stock} left!</span>`}
                </div>
                <div class="product-modal-actions">
                    <div class="quantity-selector">
                        <button class="quantity-btn minus">-</button>
                        <span class="quantity-value">1</span>
                        <button class="quantity-btn plus">+</button>
                    </div>
                    <button class="btn btn-primary btn-add-to-cart">Add to Cart</button>
                    <button class="btn btn-secondary btn-buy-now">Buy Now</button>
                </div>
                <div class="product-modal-wishlist">
                    <button class="btn-wishlist">
                        <i class="far fa-heart"></i> Add to Wishlist
                    </button>
                </div>
                <div class="product-modal-description">
                    <h3>Description</h3>
                    <p>${product.description}</p>
                </div>
                ${product.features ? `
                <div class="product-modal-features">
                    <h3>Features</h3>
                    <ul>
                        ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>` : ''}
                ${product.specifications ? `
                <div class="product-modal-specs">
                    <h3>Specifications</h3>
                    <table>
                        ${Object.entries(product.specifications).map(([key, value]) => `
                            <tr>
                                <th>${key}</th>
                                <td>${value}</td>
                            </tr>
                        `).join('')}
                    </table>
                </div>` : ''}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Add event listeners for modal
    modal.querySelector('.modal-overlay').addEventListener('click', () => {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
    });
    
    modal.querySelector('.modal-close').addEventListener('click', () => {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
    });
    
    // Add to cart from modal
    modal.querySelector('.btn-add-to-cart').addEventListener('click', () => {
        const quantity = parseInt(modal.querySelector('.quantity-value').textContent);
        addToCart(productId, quantity);
        document.body.removeChild(modal);
        document.body.style.overflow = '';
    });
}

// Slideshow functionality
function startSlideshow() {
    state.slideInterval = setInterval(nextSlide, 5000);
}

function nextSlide() {
    state.currentSlide = (state.currentSlide + 1) % elements.slides.length;
    showSlide(state.currentSlide);
}

function prevSlide() {
    state.currentSlide = (state.currentSlide - 1 + elements.slides.length) % elements.slides.length;
    showSlide(state.currentSlide);
}

function showSlide(index) {
    elements.slides.forEach(slide => slide.classList.remove('active'));
    elements.indicators.forEach(indicator => indicator.classList.remove('active'));
    
    elements.slides[index].classList.add('active');
    elements.indicators[index].classList.add('active');
    state.currentSlide = index;
    
    // Reset interval
    clearInterval(state.slideInterval);
    state.slideInterval = setInterval(nextSlide, 5000);
}

// Show toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <i class="fas fa-check-circle"></i> ${message}
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Check online status
function checkOnlineStatus() {
    state.isOnline = navigator.onLine;
    elements.offlineNotification.style.display = state.isOnline ? 'none' : 'block';
}

// Back to top button
function handleScroll() {
    if (window.scrollY > 300) {
        elements.backToTop.classList.add('show');
    } else {
        elements.backToTop.classList.remove('show');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    elements.searchButton.addEventListener('click', searchProducts);
    elements.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchProducts();
    });
    elements.searchSelect.addEventListener('change', searchProducts);
    
    // Account dropdown
    elements.accountTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        elements.accountDropdown.classList.toggle('show');
        elements.cartDropdown.classList.remove('show');
    });
    
    // Cart dropdown
    elements.cartTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        elements.cartDropdown.classList.toggle('show');
        elements.accountDropdown.classList.remove('show');
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        elements.accountDropdown.classList.remove('show');
        elements.cartDropdown.classList.remove('show');
    });
    
    // Mobile menu
    elements.mobileMenuBtn.addEventListener('click', () => {
        elements.mobileMenu.classList.add('show');
        elements.mobileMenuOverlay.classList.add('show');
    });
    
    elements.mobileMenuClose.addEventListener('click', () => {
        elements.mobileMenu.classList.remove('show');
        elements.mobileMenuOverlay.classList.remove('show');
    });
    
    elements.mobileMenuOverlay.className = 'mobile-menu-overlay';
    document.body.appendChild(elements.mobileMenuOverlay);
    
    elements.mobileMenuOverlay.addEventListener('click', () => {
        elements.mobileMenu.classList.remove('show');
        elements.mobileMenuOverlay.classList.remove('show');
    });
    
    // Slideshow controls
    elements.indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => showSlide(index));
    });
    
    elements.prevBtn.addEventListener('click', prevSlide);
    elements.nextBtn.addEventListener('click', nextSlide);
    
    // Mobile navigation
    elements.mobileNavItems.forEach(item => {
        item.addEventListener('click', () => {
            elements.mobileNavItems.forEach(navItem => navItem.classList.remove('active'));
            item.classList.add('active');
        });
    });
    
    // Online/offline events
    window.addEventListener('online', checkOnlineStatus);
    window.addEventListener('offline', checkOnlineStatus);
    
    // Back to top button
    elements.backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', handleScroll);
    
    // Newsletter subscription
    elements.newsletterForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input').value;
        if (email) {
            showToast('Thanks for subscribing to our newsletter!');
            e.target.querySelector('input').value = '';
        }
    });
    
    // View cart button
    elements.viewCartBtn?.addEventListener('click', () => {
        elements.cartDropdown.classList.remove('show');
        // In a real app, this would navigate to the cart page
        alert('Navigating to cart page');
    });
    
    // Checkout button
    elements.checkoutBtn?.addEventListener('click', () => {
        if (state.cart.length === 0) return;
        elements.cartDropdown.classList.remove('show');
        // In a real app, this would navigate to checkout
        alert('Proceeding to checkout with ' + state.cart.reduce((t, i) => t + i.quantity, 0) + ' items');
    });
    
    // Account buttons
    elements.signInBtn?.addEventListener('click', () => {
        // In a real app, this would show a sign in modal
        alert('Sign in functionality would go here');
    });
    
    elements.registerBtn?.addEventListener('click', () => {
        // In a real app, this would show a registration modal
        alert('Registration functionality would go here');
    });
    
    // Category filtering
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const categoryId = card.dataset.id;
            const filteredProducts = products.filter(product => 
                product.category === categoryId
            );
            renderProducts(filteredProducts);
            window.scrollTo({ top: elements.productGrid.offsetTop - 100, behavior: 'smooth' });
        });
    });
    
    // Mobile menu category filtering
    document.querySelectorAll('.mobile-menu-category').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const categoryId = item.dataset.id;
            const filteredProducts = products.filter(product => 
                product.category === categoryId
            );
            renderProducts(filteredProducts);
            elements.mobileMenu.classList.remove('show');
            elements.mobileMenuOverlay.classList.remove('show');
            window.scrollTo({ top: elements.productGrid.offsetTop - 100, behavior: 'smooth' });
        });
    });
    
    // Product interactions (delegated events)
    document.addEventListener('click', (e) => {
        // Add to cart button
        if (e.target.classList.contains('btn-add-to-cart')) {
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                const productId = parseInt(productCard.dataset.id);
                addToCart(productId);
            }
        }
        
        // View product button
        if (e.target.classList.contains('btn-view')) {
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                const productId = parseInt(productCard.dataset.id);
                viewProduct(productId);
            }
        }
        
        // Wishlist button
        if (e.target.classList.contains('product-wishlist') || e.target.closest('.product-wishlist')) {
            const btn = e.target.classList.contains('product-wishlist') ? e.target : e.target.closest('.product-wishlist');
            btn.querySelector('i').classList.toggle('far');
            btn.querySelector('i').classList.toggle('fas');
            const productCard = btn.closest('.product-card');
            if (productCard) {
                const productId = parseInt(productCard.dataset.id);
                const action = btn.querySelector('i').classList.contains('fas') ? 'added to' : 'removed from';
                showToast(`Product ${action} wishlist`);
            }
        }
    });
    
    // Cart interactions (delegated events)
    elements.cartItems.addEventListener('click', (e) => {
        const cartItem = e.target.closest('.cart-item');
        if (!cartItem) return;
        
        const productId = parseInt(cartItem.dataset.id);
        
        // Remove item
        if (e.target.classList.contains('btn-remove') || e.target.closest('.btn-remove')) {
            removeFromCart(productId);
        }
        
        // Decrease quantity
        if (e.target.classList.contains('minus')) {
            const item = state.cart.find(item => item.id === productId);
            if (item) updateCartItemQuantity(productId, item.quantity - 1);
        }
        
        // Increase quantity
        if (e.target.classList.contains('plus')) {
            const item = state.cart.find(item => item.id === productId);
            if (item) updateCartItemQuantity(productId, item.quantity + 1);
        }
    });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);