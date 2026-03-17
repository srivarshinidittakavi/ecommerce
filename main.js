// Sample Product Data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 99.99,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
        rating: 4.5,
        description: "High-quality wireless headphones with noise cancellation"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 199.99,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
        rating: 4.3,
        description: "Feature-rich smartwatch with health tracking"
    },
    {
        id: 3,
        name: "Running Shoes",
        price: 79.99,
        category: "fashion",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
        rating: 4.7,
        description: "Comfortable running shoes for athletes"
    },
    {
        id: 4,
        name: "Leather Jacket",
        price: 149.99,
        category: "fashion",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop",
        rating: 4.4,
        description: "Stylish leather jacket for all seasons"
    },
    {
        id: 5,
        name: "Coffee Maker",
        price: 89.99,
        category: "home",
        image: "https://images.unsplash.com/photo-1517668808822-9ebb4f404f8d?w=300&h=300&fit=crop",
        rating: 4.6,
        description: "Automatic coffee maker with timer"
    },
    {
        id: 6,
        name: "Table Lamp",
        price: 45.99,
        category: "home",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&h=300&fit=crop",
        rating: 4.2,
        description: "Modern LED table lamp"
    },
    {
        id: 7,
        name: "Best Seller Book",
        price: 24.99,
        category: "books",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop",
        rating: 4.8,
        description: "Bestselling fiction novel"
    },
    {
        id: 8,
        name: "Cookbook Set",
        price: 39.99,
        category: "books",
        image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=300&fit=crop",
        rating: 4.5,
        description: "Collection of gourmet recipes"
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count in header
function updateCartCount() {
    const cartCounts = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCounts.forEach(count => {
        count.textContent = totalItems;
    });
}

// Add to cart
function addToCart(productId, quantity = 1, size = null, color = null) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const existingItem = cart.find(item => 
        item.id === productId && 
        item.size === size && 
        item.color === color
    );
    
    if (existingItem) {
        existingItem.quantity += quantity;
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
            item.quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        }
    }
    
    updateCartCount();
}

// Clear cart
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
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
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');
    
    if (!cartItemsList) return;
    
    if (cart.length === 0) {
        cartItemsList.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart" style="font-size: 3rem; color: #ddd;"></i>
                <p>Your cart is empty</p>
                <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
            </div>
        `;
    } else {
        cartItemsList.innerHTML = cart.map(item => `
            <div class="cart-item">
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
                    <input type="number" value="${item.quantity}" min="1" max="10" 
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
    if (taxEl) taxEl.textContent = `$${totals.tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${totals.total.toFixed(2)}`;
    
    // Update checkout totals if on checkout page
    updateCheckoutTotals();
}

// Render products on homepage
function renderFeaturedProducts() {
    const featuredContainer = document.getElementById('featured-products');
    if (!featuredContainer) return;
    
    const featured = products.slice(0, 4); // Show first 4 products
    
    featuredContainer.innerHTML = featured.map(product => `
        <div class="product-card">
            ${product.rating >= 4.5 ? '<span class="product-badge">Featured</span>' : ''}
            <img src="${product.image}" alt="${product.name}" class="product-image">
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

// Render products on shop page
function renderShopProducts() {
    const shopContainer = document.getElementById('shop-products');
    if (!shopContainer) return;
    
    const productCount = document.getElementById('product-count');
    if (productCount) productCount.textContent = products.length;
    
    shopContainer.innerHTML = products.map(product => `
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

// Load product details
function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    const product = products.find(p => p.id === productId);
    
    if (product) {
        document.getElementById('product-title').textContent = product.name;
        document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;
        document.getElementById('product-description').textContent = product.description;
        document.getElementById('product-category').textContent = product.category;
        document.getElementById('main-product-image').src = product.image;
        
        // Set thumbnails
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, index) => {
           
