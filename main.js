// Complete Functional JavaScript for E-commerce Website

// Sample Product Data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 99.99,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
        rating: 4.5,
        description: "High-quality wireless headphones with noise cancellation. 30-hour battery life and comfortable over-ear design.",
        stock: 15
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 199.99,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
        rating: 4.3,
        description: "Feature-rich smartwatch with health tracking, GPS, and smartphone notifications. Water-resistant up to 50m.",
        stock: 8
    },
    {
        id: 3,
        name: "Running Shoes",
        price: 79.99,
        category: "fashion",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
        rating: 4.7,
        description: "Comfortable running shoes with responsive cushioning. Perfect for daily runs and workouts.",
        stock: 20
    },
    {
        id: 4,
        name: "Leather Jacket",
        price: 149.99,
        category: "fashion",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop",
        rating: 4.4,
        description: "Stylish leather jacket made from genuine leather. Available in multiple sizes.",
        stock: 5
    },
    {
        id: 5,
        name: "Coffee Maker",
        price: 89.99,
        category: "home",
        image: "https://images.unsplash.com/photo-1517668808822-9ebb4f404f8d?w=300&h=300&fit=crop",
        rating: 4.6,
        description: "Automatic coffee maker with programmable timer. Brews up to 12 cups.",
        stock: 12
    },
    {
        id: 6,
        name: "Table Lamp",
        price: 45.99,
        category: "home",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&h=300&fit=crop",
        rating: 4.2,
        description: "Modern LED table lamp with adjustable brightness. Perfect for reading.",
        stock: 25
    },
    {
        id: 7,
        name: "Best Seller Book",
        price: 24.99,
        category: "books",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop",
        rating: 4.8,
        description: "New York Times bestselling fiction novel. A gripping story that will keep you reading all night.",
        stock: 30
    },
    {
        id: 8,
        name: "Cookbook Set",
        price: 39.99,
        category: "books",
        image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=300&fit=crop",
        rating: 4.5,
        description: "Collection of gourmet recipes from world-renowned chefs. Includes 3 books.",
        stock: 10
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeMobileMenu();
    updateCartCount();
    
    // Load content based on current page
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'index.html':
        case '':
            renderFeaturedProducts();
            break;
        case 'shop.html':
            initializeShopPage();
            break;
        case 'product.html':
            loadProductDetails();
            initializeProductPage();
            break;
        case 'cart.html':
            renderCart();
            break;
        case 'checkout.html':
            initializeCheckout();
            break;
        case 'account.html':
            initializeAccountPage();
            break;
    }
});

// Mobile Menu
function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
}

// Update cart count in header
function updateCartCount() {
    const cartCounts = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCounts.forEach(count => {
        count.textContent = totalItems;
    });
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add to cart
function addToCart(productId, quantity = 1, size = null, color = null) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Check stock
    if (product.stock < quantity) {
        showNotification('Sorry, not enough stock!', 'error');
        return;
    }
    
    const existingItem = cart.find(item => 
        item.id === productId && 
        item.size === size && 
        item.color === color
    );
    
    if (existingItem) {
        if (product.stock >= existingItem.quantity + quantity) {
            existingItem.quantity += quantity;
        } else {
            showNotification('Sorry, not enough stock!', 'error');
            return;
        }
    } else {
        cart.push({
            ...product,
            quantity,
            size,
            color
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Product added to cart!');
}

// Remove from cart
function removeFromCart(productId, size = null, color = null) {
    cart = cart.filter(item => 
        !(item.id === productId && 
          item.size === size && 
          item.color === color)
    );
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
    showNotification('Item removed from cart');
}

// Update cart item quantity
function updateCartQuantity(productId, newQuantity, size = null, color = null) {
    const item = cart.find(item => 
        item.id === productId && 
        item.size === size && 
        item.color === color
    );
    
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId, size, color);
        } else {
            // Check stock
            const product = products.find(p => p.id === productId);
            if (product && newQuantity <= product.stock) {
                item.quantity = parseInt(newQuantity);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
                updateCartCount();
            } else {
                showNotification('Quantity exceeds available stock!', 'error');
            }
        }
    }
}

// Clear cart
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
        showNotification('Cart cleared');
    }
}

// Calculate cart totals
function calculateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 5.99;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;
    
    return { subtotal, shipping, tax, total };
}

// Render cart page
function renderCart() {
    const cartItemsList = document.getElementById('cart-items-list');
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');
    
    if (!cartItemsList) return;
    
    if (cart.length === 0) {
        cartItemsList.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
            </div>
        `;
    } else {
        cartItemsList.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}" data-size="${item.size || ''}" data-color="${item.color || ''}">
                <div class="cart-item-product">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        ${item.size ? `<p>Size: ${item.size}</p>` : ''}
                        ${item.color ? `<p>Color: ${item.color}</p>` : ''}
                    </div>
                </div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button onclick="updateCartQuantity(${item.id}, ${item.quantity - 1}, '${item.size || ''}', '${item.color || ''}')">-</button>
                    <input type="number" value="${item.quantity}" min="1" max="${item.stock}" 
                           onchange="updateCartQuantity(${item.id}, this.value, '${item.size || ''}', '${item.color || ''}')">
                    <button onclick="updateCartQuantity(${item.id}, ${item.quantity + 1}, '${item.size || ''}', '${item.color || ''}')">+</button>
                </div>
                <div class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
                <div class="remove-item" onclick="removeFromCart(${item.id}, '${item.size || ''}', '${item.color || ''}')">
                    <i class="fas fa-trash"></i>
                </div>
            </div>
        `).join('');
    }
    
    // Update totals
    const totals = calculateTotals();
    if (subtotalEl) subtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = `$${totals.shipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${totals.tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${totals.total.toFixed(2)}`;
    
    // Update checkout totals if on checkout page
    updateCheckoutTotals();
}

// Generate rating stars
function generateRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Render featured products on homepage
function renderFeaturedProducts() {
    const featuredContainer = document.getElementById('featured-products');
    if (!featuredContainer) return;
    
    const featured = products.slice(0, 4);
    
    featuredContainer.innerHTML = featured.map(product => `
        <div class="product-card">
            ${product.rating >= 4.5 ? '<span class="product-badge">Featured</span>' : ''}
            <a href="product.html?id=${product.id}">
                <img src="${product.image}" alt="${product.name}" class="product-image">
            </a>
            <div class="product-details">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-rating">
                    ${generateRatingStars(product.rating)}
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Shop page functionality
function initializeShopPage() {
    renderShopProducts();
    initializeFilters();
}

// Render products on shop page
function renderShopProducts(filteredProducts = products) {
    const shopContainer = document.getElementById('shop-products');
    const productCount = document.getElementById('product-count');
    
    if (!shopContainer) return;
    
    if (productCount) productCount.textContent = filteredProducts.length;
    
    if (filteredProducts.length === 0) {
        shopContainer.innerHTML = `
            <div class="no-products">
                <p>No products found matching your criteria.</p>
            </div>
        `;
        return;
    }
    
    shopContainer.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            ${product.rating >= 4.5 ? '<span class="product-badge">Hot</span>' : ''}
            <a href="product.html?id=${product.id}">
                <img src="${product.image}" alt="${product.name}" class="product-image">
            </a>
            <div class="product-details">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-rating">
                    ${generateRatingStars(product.rating)}
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Initialize filters on shop page
function initializeFilters() {
    const categoryLinks = document.querySelectorAll('.category-list a');
    const priceRange = document.getElementById('price-range');
    const sortSelect = document.getElementById('sort-select');
    
    let currentCategory = 'all';
    let currentPrice = 1000;
    let currentSort = 'default';
    
    // Category filter
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            categoryLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            currentCategory = link.dataset.category;
            applyFilters();
        });
    });
    
    // Price filter
    if (priceRange) {
        priceRange.addEventListener('input', (e) => {
            currentPrice = e.target.value;
            document.getElementById('price-value').textContent = `$${currentPrice}`;
        });
        
        priceRange.addEventListener('change', () => {
            applyFilters();
        });
    }
    
    // Sort filter
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            applyFilters();
        });
    }
    
    function applyFilters() {
        let filtered = [...products];
        
        // Apply category filter
        if (currentCategory !== 'all') {
            filtered = filtered.filter(p => p.category === currentCategory);
        }
        
        // Apply price filter
        filtered = filtered.filter(p => p.price <= currentPrice);
        
        // Apply sorting
        switch(currentSort) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
        
        renderShopProducts(filtered);
    }
}

// Product page functionality
function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        window.location.href = 'shop.html';
        return;
    }
    
    document.getElementById('product-title').textContent = product.name;
    document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('product-description').textContent = product.description;
    document.getElementById('product-category').textContent = product.category;
    document.getElementById('main-product-image').src = product.image;
    
    // Set rating stars
    const ratingContainer = document.querySelector('.product-rating');
    if (ratingContainer) {
        ratingContainer.innerHTML = generateRatingStars(product.rating) + 
            '<span> (' + Math.floor(Math.random() * 100 + 50) + ' reviews)</span>';
    }
    
    // Set thumbnails (using same image for demo)
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, index) => {
        thumb.src = product.image;
        thumb.addEventListener('click', () => {
            document.getElementById('main-product-image').src = product.image;
            thumbnails.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    });
    
    // Set product ID for add to cart button
    const addToCartBtn = document.querySelector('.product-actions .btn-primary');
    if (addToCartBtn) {
        addToCartBtn.onclick = () => {
            const quantity = parseInt(document.getElementById('quantity').value);
            const size = document.getElementById('size')?.value;
            const color = document.querySelector('.color-option.active')?.dataset.color;
            addToCart(product.id, quantity, size, color);
        };
    }
}

function initializeProductPage() {
    // Quantity controls
    window.incrementQuantity = function() {
        const input = document.getElementById('quantity');
        const max = parseInt(input.max) || 10;
        if (parseInt(input.value) < max) {
            input.value = parseInt(input.value) + 1;
        }
    };
    
    window.decrementQuantity = function() {
        const input = document.getElementById('quantity');
        if (parseInt(input.value) > 1) {
            input.value = parseInt(input.value) - 1;
        }
    };
    
    // Color selector
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            colorOptions.forEach(o => o.classList.remove('active'));
            option.classList.add('active');
        });
    });
}

// Checkout functionality
function initializeCheckout() {
    renderCheckoutItems();
    
    // Form validation
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            placeOrder();
        });
    }
}

function renderCheckoutItems() {
    const checkoutItems = document.getElementById('checkout-items');
    if (!checkoutItems) return;
    
    if (cart.length === 0) {
        window.location.href = 'shop.html';
        return;
    }
    
    checkoutItems.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <span>${item.name} x${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    updateCheckoutTotals();
}

function updateCheckoutTotals() {
    const totals = calculateTotals();
    
    const subtotalEl = document.getElementById('checkout-subtotal');
    const taxEl = document.getElementById('checkout-tax');
    const totalEl = document.getElementById('checkout-total');
    
    if (subtotalEl) subtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${totals.tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${totals.total.toFixed(2)}`;
}

// Place order
function placeOrder() {
    // Validate form
    const requiredFields = ['first-name', 'last-name', 'email', 'address', 'city', 'state', 'zip', 'phone'];
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field || !field.value.trim()) {
            isValid = false;
            if (field) field.style.borderColor = 'red';
        } else if (field) {
            field.style.borderColor = '#ddd';
        }
    });
    
    if (!isValid) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Validate email
    const email = document.getElementById('email').value;
    if (!email.includes('@') || !email.includes('.')) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Validate payment if credit card selected
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    if (paymentMethod === 'credit') {
        const cardName = document.getElementById('card-name').value;
        const cardNumber = document.getElementById('card-number').value;
        const expiry = document.getElementById('expiry').value;
        const cvv = document.getElementById('cvv').value;
        
        if (!cardName || !cardNumber || !expiry || !cvv) {
            showNotification('Please fill in all credit card details', 'error');
            return;
        }
    }
    
    // Process order
    showNotification('Order placed successfully!');
    
    // Clear cart
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Redirect to thank you page or home
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// Account page functionality
function initializeAccountPage() {
    // Tab switching
    window.switchTab = function(tabName) {
        const tabs = document.querySelectorAll('.tab-content');
        const tabBtns = document.querySelectorAll('.tab-btn');
        
        tabs.forEach(tab => tab.classList.remove('active'));
        tabBtns.forEach(btn => btn.classList.remove('active'));
        
        document.getElementById(`${tabName}-tab`).classList.add('active');
        event.target.classList.add('active');
    };
    
    // Load orders
    loadOrders();
    
    // Load wishlist
    loadWishlist();
}

function loadOrders() {
    const ordersList = document.querySelector('.orders-list');
    if (!ordersList) return;
    
    // Sample orders (in real app, these would come from backend)
    const orders = [
        {
            id: '12345',
            date: 'January 15, 2024',
            status: 'delivered',
            total: 199.98,
            items: [
                { name: 'Wireless Headphones', quantity: 1, price: 99.99 },
                { name: 'Running Shoes', quantity: 1, price: 79.99 }
            ]
        },
        {
            id: '12346',
            date: 'January 10, 2024',
            status: 'shipped',
            total: 89.99,
            items: [
                { name: 'Coffee Maker', quantity: 1, price: 89.99 }
            ]
        }
    ];
    
    ordersList.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <span class="order-id">Order #${order.id}</span>
                <span class="order-date">${order.date}</span>
                <span class="order-status ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=50&h=50&fit=crop" alt="${item.name}">
                        <div class="item-details">
                            <h4>${item.name}</h4>
                            <p>Quantity: ${item.quantity}</p>
                            <p>$${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="order-footer">
                <span>Total: $${order.total.toFixed(2)}</span>
                <button class="btn btn-text" onclick="viewOrder('${order.id}')">View Details</button>
            </div>
        </div>
    `).join('');
}

function loadWishlist() {
    const wishlistContainer = document.getElementById('wishlist-products');
    if (!wishlistContainer) return;
    
    // Sample wishlist (in real app, this would come from backend)
    const wishlist = products.slice(0, 3);
    
    wishlistContainer.innerHTML = wishlist.map(product => `
        <div class="product-card">
            <a href="product.html?id=${product.id}">
                <img src="${product.image}" alt="${product.name}" class="product-image">
            </a>
            <div class="product-details">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Promo code functionality
function applyPromo() {
    const promoInput = document.getElementById('promo-input');
    if (!promoInput) return;
    
    const code = promoInput.value.toUpperCase();
    
    if (code === 'SAVE10') {
        showNotification('Promo code applied! 10% off', 'success');
        // Apply discount logic here
    } else {
        showNotification('Invalid promo code', 'error');
    }
}

// View order details
function viewOrder(orderId) {
    alert(`Viewing order #${orderId} (Demo functionality)`);
}

// Buy now function
function buyNow() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const quantity = parseInt(document.getElementById('quantity').value);
    const size = document.getElementById('size')?.value;
    const color = document.querySelector('.color-option.active')?.dataset.color;
    
    addToCart(productId, quantity, size, color);
    window.location.href = 'checkout.html';
}

// Export functions for global use
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.clearCart = clearCart;
window.applyPromo = applyPromo;
window.placeOrder = placeOrder;
window.viewOrder = viewOrder;
window.buyNow = buyNow;
window.incrementQuantity = incrementQuantity;
window.decrementQuantity = decrementQuantity;
