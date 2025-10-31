// Global Variables
let products = [];
let catalogItems = [];
let cart = [];
let siteSettings = {
    title: 'm.cosmetis x Farmasi',
    description: 'Productos de skincare premium',
    contactEmail: 'info@mcosmetis.com',
    contactPhone: '+1 (555) 123-4567'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    loadData();
    renderProducts();
    renderCatalog();
    updateCartCount();
    loadAdminProducts();
});

// Data Management
function loadData() {
    // Load from localStorage or use default data
    const savedProducts = localStorage.getItem('products');
    const savedCatalog = localStorage.getItem('catalogItems');
    const savedCart = localStorage.getItem('cart');
    const savedSettings = localStorage.getItem('siteSettings');

    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        // Default products
        products = [
            {
                id: 1,
                name: 'Limpiador Facial Suave',
                price: 29.99,
                category: 'cleansers',
                description: 'Limpiador facial suave que elimina impurezas sin resecar la piel.',
                image: 'https://via.placeholder.com/200x200/f8d7da/d63384?text=Limpiador'
            },
            {
                id: 2,
                name: 'Serum Vitamina C',
                price: 45.99,
                category: 'serums',
                description: 'Serum antioxidante con vitamina C para iluminar y proteger la piel.',
                image: 'https://via.placeholder.com/200x200/f8d7da/d63384?text=Serum+C'
            },
            {
                id: 3,
                name: 'Crema Hidratante Día',
                price: 35.99,
                category: 'moisturizers',
                description: 'Crema hidratante ligera para uso diario con SPF 15.',
                image: 'https://via.placeholder.com/200x200/f8d7da/d63384?text=Hidratante'
            },
            {
                id: 4,
                name: 'Protector Solar SPF 50',
                price: 32.99,
                category: 'suncare',
                description: 'Protección solar de amplio espectro, resistente al agua.',
                image: 'https://via.placeholder.com/200x200/f8d7da/d63384?text=SPF+50'
            }
        ];
    }

    if (savedCatalog) {
        catalogItems = JSON.parse(savedCatalog);
    } else {
        // Default catalog items
        catalogItems = [
            {
                id: 1,
                title: 'Rutina Matutina',
                description: 'Descubre la rutina perfecta para comenzar tu día con energía y luminosidad.',
                image: 'https://via.placeholder.com/300x200/f8d7da/d63384?text=Rutina+Matutina'
            },
            {
                id: 2,
                title: 'Cuidado Nocturno',
                description: 'Productos especializados para la regeneración y reparación nocturna de tu piel.',
                image: 'https://via.placeholder.com/300x200/f8d7da/d63384?text=Cuidado+Nocturno'
            }
        ];
    }

    if (savedCart) {
        cart = JSON.parse(savedCart);
    }

    if (savedSettings) {
        siteSettings = JSON.parse(savedSettings);
    }
}

function saveData() {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('catalogItems', JSON.stringify(catalogItems));
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('siteSettings', JSON.stringify(siteSettings));
}

// Product Management
function renderProducts(filter = 'all') {
    const productsGrid = document.getElementById('products-grid');
    const filteredProducts = filter === 'all' ? products : products.filter(p => p.category === filter);

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                ${product.image ? `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">` : `<i class="fas fa-image fa-3x"></i>`}
            </div>
            <h3>${product.name}</h3>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <p class="product-description">${product.description}</p>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                <i class="fas fa-cart-plus"></i> Agregar al Carrito
            </button>
        </div>
    `).join('');
}

function filterProducts(category) {
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    renderProducts(category);
}

function addProduct(event) {
    event.preventDefault();

    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const category = document.getElementById('product-category').value;
    const description = document.getElementById('product-description').value;
    const image = document.getElementById('product-image').value;

    const newProduct = {
        id: Date.now(),
        name,
        price,
        category,
        description,
        image
    };

    products.push(newProduct);
    saveData();
    renderProducts();
    loadAdminProducts();

    // Reset form
    event.target.reset();

    showNotification('Producto agregado exitosamente');
}

function deleteProduct(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        products = products.filter(p => p.id !== id);
        saveData();
        renderProducts();
        loadAdminProducts();
        showNotification('Producto eliminado exitosamente');
    }
}

// Catalog Management
function renderCatalog() {
    const catalogGrid = document.getElementById('catalog-grid');

    catalogGrid.innerHTML = catalogItems.map(item => `
        <div class="catalog-item">
            <div class="catalog-image" style="width: 100%; height: 200px; background: var(--light-gray); border-radius: 10px; margin-bottom: 1rem; display: flex; align-items: center; justify-content: center;">
                ${item.image ? `<img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">` : `<i class="fas fa-image fa-3x" style="color: var(--text-light);"></i>`}
            </div>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
        </div>
    `).join('');
}

function addCatalogItem(event) {
    event.preventDefault();

    const title = document.getElementById('catalog-title').value;
    const description = document.getElementById('catalog-description').value;
    const image = document.getElementById('catalog-image').value;

    const newItem = {
        id: Date.now(),
        title,
        description,
        image
    };

    catalogItems.push(newItem);
    saveData();
    renderCatalog();

    // Reset form
    event.target.reset();

    showNotification('Elemento agregado al catálogo exitosamente');
}

// Cart Management
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1
            });
        }

        saveData();
        updateCartCount();
        renderCartItems();
        showNotification('Producto agregado al carrito');
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveData();
    updateCartCount();
    renderCartItems();
    showNotification('Producto eliminado del carrito');
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function renderCartItems() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 2rem;">Tu carrito está vacío</p>';
        cartTotal.textContent = '0.00';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

function toggleCart() {
    const cartOverlay = document.getElementById('cart-overlay');
    const cartSidebar = document.getElementById('cart-sidebar');

    if (cartSidebar.classList.contains('open')) {
        cartSidebar.classList.remove('open');
        cartOverlay.style.display = 'none';
    } else {
        cartSidebar.classList.add('open');
        cartOverlay.style.display = 'block';
        renderCartItems();
    }
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const message = `¡Gracias por tu compra! Total: $${total.toFixed(2)}\\n\\nEn breve nos pondremos en contacto contigo para coordinar el pago y envío.`;

    // Crear mensaje detallado para WhatsApp
    let whatsappMessage = '¡Hola! Me interesa realizar esta compra:\n\n';
    whatsappMessage += '*PRODUCTOS:*\n';

    cart.forEach((item, index) => {
        whatsappMessage += `${index + 1}. ${item.name}\n`;
        whatsappMessage += `   Precio: $${item.price.toFixed(2)}\n`;
        whatsappMessage += `   Cantidad: ${item.quantity}\n`;
        whatsappMessage += `   Subtotal: $${(item.price * item.quantity).toFixed(2)}\n\n`;
    });

    whatsappMessage += `*TOTAL: $${total.toFixed(2)}*\n\n`;
    whatsappMessage += 'Por favor, confirma la disponibilidad y el proceso de pago. ¡Gracias!';

    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(whatsappMessage);

    // Crear URL de WhatsApp
    const whatsappURL = `https://wa.me/+584129237530?text=${encodedMessage}`;

    // Abrir WhatsApp en nueva ventana
    window.open(whatsappURL, '_blank');

    // Mostrar notificación de éxito
    showNotification('Redirigiendo a WhatsApp para completar tu compra...');

    // Limpiar carrito después de un breve delay
    setTimeout(() => {
        cart = [];
        saveData();
        updateCartCount();
        renderCartItems();
        toggleCart();
    }, 2000);
}

// Admin Panel Management
function toggleAdmin() {
    const adminOverlay = document.getElementById('admin-overlay');
    const adminPanel = document.getElementById('admin-panel');

    if (adminPanel.classList.contains('open')) {
        adminPanel.classList.remove('open');
        adminOverlay.style.display = 'none';
    } else {
        adminPanel.classList.add('open');
        adminOverlay.style.display = 'block';
        loadAdminProducts();
    }
}

function showAdminTab(tabName) {
    // Update active tab
    document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');

    // Show corresponding content
    document.querySelectorAll('.admin-tab-content').forEach(content => {
        content.style.display = 'none';
    });
    document.getElementById(`admin-${tabName}`).style.display = 'block';

    if (tabName === 'settings') {
        loadSettings();
    }
}

function loadAdminProducts() {
    const adminProductsList = document.getElementById('admin-products-list');

    adminProductsList.innerHTML = products.map(product => `
        <div class="admin-product-item">
            <div class="admin-product-info">
                <h4>${product.name}</h4>
                <p>$${product.price.toFixed(2)} - ${product.category}</p>
            </div>
            <button class="delete-product" onclick="deleteProduct(${product.id})">
                <i class="fas fa-trash"></i> Eliminar
            </button>
        </div>
    `).join('');
}

function loadSettings() {
    document.getElementById('site-title').value = siteSettings.title;
    document.getElementById('site-description').value = siteSettings.description;
    document.getElementById('contact-email').value = siteSettings.contactEmail;
    document.getElementById('contact-phone').value = siteSettings.contactPhone;
}

function updateSettings(event) {
    event.preventDefault();

    siteSettings.title = document.getElementById('site-title').value;
    siteSettings.description = document.getElementById('site-description').value;
    siteSettings.contactEmail = document.getElementById('contact-email').value;
    siteSettings.contactPhone = document.getElementById('contact-phone').value;

    saveData();

    // Update site title
    document.title = `${siteSettings.title} - Skincare Premium`;
    document.querySelector('.logo h1').textContent = siteSettings.title;
    document.querySelector('.logo p').textContent = siteSettings.description;

    // Update contact info
    const contactItems = document.querySelectorAll('.contact-item span');
    contactItems[0].textContent = siteSettings.contactPhone;
    contactItems[1].textContent = siteSettings.contactEmail;

    showNotification('Configuración actualizada exitosamente');
}

// Contact Form
function submitContact(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const name = formData.get('name') || event.target.querySelector('input[type="text"]').value;
    const email = formData.get('email') || event.target.querySelector('input[type="email"]').value;
    const message = formData.get('message') || event.target.querySelector('textarea').value;

    // Simulate form submission
    showNotification('¡Mensaje enviado exitosamente! Te contactaremos pronto.');
    event.target.reset();
}

// Utility Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    const headerHeight = document.querySelector('.header').offsetHeight;
    const sectionTop = section.offsetTop - headerHeight;

    window.scrollTo({
        top: sectionTop,
        behavior: 'smooth'
    });
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--dark-pink);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 4000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
});

// Close modals when clicking outside
document.addEventListener('click', function (e) {
    const cartSidebar = document.getElementById('cart-sidebar');
    const adminPanel = document.getElementById('admin-panel');

    if (e.target.classList.contains('cart-overlay')) {
        toggleCart();
    }

    if (e.target.classList.contains('admin-overlay')) {
        toggleAdmin();
    }
});

// Responsive navigation toggle (for mobile)
function toggleMobileNav() {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('mobile-open');
}

// Add mobile navigation styles
const mobileStyles = document.createElement('style');
mobileStyles.textContent = `
    @media (max-width: 768px) {
        .nav {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: var(--white);
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            display: none;
        }
        
        .nav.mobile-open {
            display: block;
        }
        
        .nav ul {
            flex-direction: column;
            padding: 1rem;
        }
        
        .nav ul li {
            margin-bottom: 1rem;
        }
        
        .header .container {
            position: relative;
        }
        
        .mobile-menu-btn {
            display: block;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--dark-pink);
            cursor: pointer;
        }
    }
    
    @media (min-width: 769px) {
        .mobile-menu-btn {
            display: none;
        }
    }
`;
document.head.appendChild(mobileStyles);

// Add mobile menu button to header
document.addEventListener('DOMContentLoaded', function () {
    const headerActions = document.querySelector('.header-actions');
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    mobileMenuBtn.onclick = toggleMobileNav;

    headerActions.insertBefore(mobileMenuBtn, headerActions.firstChild);
});