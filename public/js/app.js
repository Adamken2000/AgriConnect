let activeUser = null;
let produceData = [];
let ordersData = [];

// Global Initialization on every page
document.addEventListener("DOMContentLoaded", async () => {
    // Restore user session from localStorage
    const savedUser = localStorage.getItem('agri_current_user') || localStorage.getItem('agri_active_user');
    if (savedUser) {
        try {
            activeUser = JSON.parse(savedUser);
        } catch (e) {
            activeUser = null;
        }
    }

    updateUserSessionDisplay();
    updateCartBadge();
    await loadGlobalData();

    // Page-specific initializers based on elements present
    if (document.getElementById('home-produce-grid')) renderHomeViews();
    if (document.getElementById('catalogue-produce-grid')) renderCatalogue();
    if (document.getElementById('product-detail-container')) loadProductDetail();
    if (document.getElementById('cart-items-container')) renderCartItems();
    if (document.getElementById('farmer-produce-tbody')) renderFarmerDashboard();
    if (document.getElementById('buyer-orders-list')) renderBuyerDashboard();
    if (document.getElementById('admin-orders-container')) renderAdminDashboard();
});

// --- SESSION MANAGEMENT ---
function updateUserSessionDisplay() {
    const nameElem = document.getElementById('header-user-name');
    const roleElem = document.getElementById('header-user-role-badge');
    const heroName = document.getElementById('hero-user-display-name');
    const checkoutNameInput = document.getElementById('checkout-name');
    const btnLogout = document.getElementById('btn-logout');
    const btnLoginReg = document.getElementById('btn-login-register');

    if (activeUser) {
        if (nameElem) nameElem.textContent = activeUser.name;
        if (roleElem) roleElem.textContent = activeUser.role.toUpperCase();
        if (heroName) heroName.textContent = activeUser.name;
        if (checkoutNameInput) checkoutNameInput.value = activeUser.name;
        if (btnLogout) btnLogout.classList.remove('hidden');
        if (btnLoginReg) btnLoginReg.classList.add('hidden');
    } else {
        if (nameElem) nameElem.textContent = "Guest User";
        if (roleElem) roleElem.textContent = "Not Logged In";
        if (heroName) heroName.textContent = "Guest";
        if (checkoutNameInput) checkoutNameInput.value = "";
        if (btnLogout) btnLogout.classList.add('hidden');
        if (btnLoginReg) btnLoginReg.classList.remove('hidden');
    }
}

function handleLogout() {
    activeUser = null;
    localStorage.removeItem('agri_current_user');
    localStorage.removeItem('agri_active_user');
    showToast("Logged out successfully.");
    setTimeout(() => { window.location.href = 'index.html'; }, 1000);
}

// --- DATA FETCHING & METRICS ---
async function loadGlobalData() {
    const remoteProduce = await ApiService.getProduce();
    if (remoteProduce && Array.isArray(remoteProduce)) {
        produceData = remoteProduce.map(p => ({
            ...p,
            is_approved: Boolean(p.is_approved)
        }));
    }

    const remoteOrders = await ApiService.getOrders();
    if (remoteOrders && Array.isArray(remoteOrders)) {
        ordersData = remoteOrders;
    }

    updateGlobalMetrics();
}

function updateGlobalMetrics() {
    const approvedProduce = produceData.filter(p => p.is_approved);
    const totalStock = approvedProduce.reduce((sum, p) => sum + Number(p.stock || 0), 0);
    const totalVolumeKES = ordersData.reduce((sum, o) => sum + Number(o.total || 0), 0);

    setElementText('stat-active-produce', approvedProduce.length);
    setElementText('stat-traded-volume', `${totalStock.toLocaleString()} Units`);
    setElementText('stat-total-orders', ordersData.length);
    setElementText('footer-stat-listings', approvedProduce.length);
    setElementText('footer-stat-orders', ordersData.length);
    setElementText('footer-stat-volume', `KES ${totalVolumeKES.toLocaleString()}`);
}

function setElementText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

// --- HOME & CATALOGUE ---
const categoriesData = [
    { name: "Vegetables", icon: "fa-leaf" },
    { name: "Fruits", icon: "fa-apple-whole" },
    { name: "Grains", icon: "fa-wheat-awn" },
    { name: "Tubers", icon: "fa-carrot" },
    { name: "Dairy", icon: "fa-cow" }
];

function renderHomeViews() {
    const catGrid = document.getElementById('home-categories-grid');
    if (catGrid) {
        catGrid.innerHTML = categoriesData.map(c => `
            <div onclick="window.location.href='catalogue.html?category=${c.name}'" class="bg-white p-4 rounded-2xl border border-slate-200 hover:border-green-500 hover:shadow-md transition cursor-pointer text-center space-y-2">
                <div class="w-10 h-10 bg-green-100 text-green-700 rounded-xl flex items-center justify-center mx-auto text-lg">
                    <i class="fa-solid ${c.icon}"></i>
                </div>
                <div class="font-bold text-slate-800 text-xs">${c.name}</div>
            </div>
        `).join('');
    }

    const homeGrid = document.getElementById('home-produce-grid');
    if (homeGrid) {
        const approved = produceData.filter(p => p.is_approved).slice(0, 4);
        homeGrid.innerHTML = approved.length ? approved.map(p => createProduceCardHTML(p)).join('') : '<p class="col-span-full text-center text-slate-400 text-xs">No approved produce available right now.</p>';
    }
}

function renderCatalogue() {
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('category');
    if (catParam) {
        const selectEl = document.getElementById('catalogue-category-filter');
        if (selectEl) selectEl.value = catParam;
    }
    filterProduce();
}

function createProduceCardHTML(item) {
    const fallbackImage = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80';
    
    return `
        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition flex flex-col justify-between">
            <div>
                <div class="relative h-48 bg-slate-100 overflow-hidden">
                    <img src="${item.image_url || fallbackImage}" 
                         alt="${item.title}" 
                         onerror="this.onerror=null; this.src='${fallbackImage}';" 
                         class="w-full h-full object-cover">
                    <span class="absolute top-3 left-3 bg-white/90 backdrop-blur text-green-800 font-bold text-[10px] px-2.5 py-1 rounded-full uppercase">
                        ${item.category}
                    </span>
                </div>
                <div class="p-4 space-y-2">
                    <span class="text-xs text-slate-500 font-medium flex items-center space-x-1">
                        <i class="fa-solid fa-location-dot text-green-600"></i>
                        <span>${item.farmer_location || item.location || 'Kenya'}</span>
                    </span>
                    <h3 class="font-bold text-slate-900 text-sm">${item.title}</h3>
                    <p class="text-xs text-slate-500 line-clamp-2">${item.description || ''}</p>
                    <div class="text-[11px] text-slate-400 font-medium">Farmer: <span class="text-slate-700 font-bold">${item.farmer_name || 'Verified Farmer'}</span></div>
                </div>
            </div>
            <div class="p-4 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                <div>
                    <span class="text-xs text-slate-400">Price</span>
                    <div class="font-extrabold text-slate-900 text-base">KES ${item.price} <span class="text-xs font-normal text-slate-500">/ ${item.unit}</span></div>
                </div>
                <button onclick="addToCart(${item.id})" class="bg-green-700 hover:bg-green-800 text-white p-2.5 rounded-xl shadow transition">
                    <i class="fa-solid fa-cart-plus"></i>
                </button>
            </div>
        </div>
    `;
}

function filterProduce() {
    const searchInput = document.getElementById('catalogue-search-input');
    const categoryFilter = document.getElementById('catalogue-category-filter');
    
    const query = searchInput ? searchInput.value.toLowerCase() : '';
    const category = categoryFilter ? categoryFilter.value : 'ALL';

    let filtered = produceData.filter(p => p.is_approved);

    if (category !== 'ALL') filtered = filtered.filter(p => p.category === category);
    if (query) {
        filtered = filtered.filter(p => 
            p.title.toLowerCase().includes(query) || 
            (p.farmer_location && p.farmer_location.toLowerCase().includes(query)) ||
            (p.farmer_name && p.farmer_name.toLowerCase().includes(query))
        );
    }

    const grid = document.getElementById('catalogue-produce-grid');
    if (grid) {
        grid.innerHTML = filtered.length ? filtered.map(p => createProduceCardHTML(p)).join('') : `<div class="col-span-full py-12 text-center text-slate-400 text-xs">No approved produce matching your filter.</div>`;
    }
}

// --- CART & CHECKOUT ---
function getCart() {
    return JSON.parse(localStorage.getItem('agri_cart') || '[]');
}

function saveCart(cart) {
    localStorage.setItem('agri_cart', JSON.stringify(cart));
    updateCartBadge();
}

function addToCart(produceId) {
    const item = produceData.find(p => p.id === produceId);
    if (!item) return;

    let cart = getCart();
    const existing = cart.find(c => c.id === produceId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id: item.id, title: item.title, price: item.price, unit: item.unit, quantity: 1 });
    }

    saveCart(cart);
    showToast(`Added "${item.title}" to cart.`);
}

function updateCartBadge() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-badge-count');
    if (badge) badge.textContent = count;
}

function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    let cart = getCart();
    const countLabel = document.getElementById('cart-item-count-label');
    if (countLabel) countLabel.textContent = `${cart.length} unique items`;

    if (cart.length === 0) {
        container.innerHTML = `<div class="py-8 text-center text-slate-400 text-xs">Your shopping cart is empty.</div>`;
        setElementText('cart-subtotal', 'KES 0.00');
        setElementText('cart-grand-total', 'KES 250.00');
        return;
    }

    let subtotal = 0;
    container.innerHTML = cart.map((c, index) => {
        const itemTotal = c.price * c.quantity;
        subtotal += itemTotal;
        return `
            <div class="py-3 flex items-center justify-between text-xs">
                <div>
                    <div class="font-bold text-slate-900">${c.title}</div>
                    <div class="text-slate-500">KES ${c.price} / ${c.unit}</div>
                </div>
                <div class="flex items-center space-x-3">
                    <div class="flex items-center border border-slate-300 rounded-lg overflow-hidden">
                        <button onclick="updateCartQty(${index}, -1)" class="px-2 py-1 bg-slate-100 hover:bg-slate-200">-</button>
                        <span class="px-3 font-bold">${c.quantity}</span>
                        <button onclick="updateCartQty(${index}, 1)" class="px-2 py-1 bg-slate-100 hover:bg-slate-200">+</button>
                    </div>
                    <span class="font-bold text-slate-800 min-w-[70px] text-right">KES ${itemTotal}</span>
                    <button onclick="removeFromCart(${index})" class="text-red-500 hover:text-red-700"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `;
    }).join('');

    const shipping = 250;
    setElementText('cart-subtotal', `KES ${subtotal.toLocaleString()}`);
    setElementText('cart-grand-total', `KES ${(subtotal + shipping).toLocaleString()}`);
}

function updateCartQty(index, delta) {
    let cart = getCart();
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    saveCart(cart);
    renderCartItems();
}

function removeFromCart(index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCartItems();
}

async function handleCheckout(event) {
    event.preventDefault();
    if (!activeUser) {
        showToast("Please login or register to complete your order.", "error");
        setTimeout(() => window.location.href = 'auth.html', 1200);
        return;
    }

    let cart = getCart();
    if (cart.length === 0) {
        showToast("Cannot checkout with an empty cart!", "error");
        return;
    }

    const name = document.getElementById('checkout-name').value;
    const address = document.getElementById('checkout-address').value;
    const paymentMethod = document.getElementById('checkout-payment').value;
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = 250;
    const grandTotal = subtotal + shippingFee;

    const orderPayload = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        buyer_id: activeUser.id,
        recipient_name: name,
        delivery_address: address,
        subtotal: subtotal,
        shipping_fee: shippingFee,
        total: grandTotal,
        payment_method: paymentMethod,
        items: cart.map(c => ({ produce_id: c.id, quantity: c.quantity, unit_price: c.price }))
    };

    const result = await ApiService.createOrder(orderPayload);
    if (result && result.error) {
        showToast(`Checkout failed: ${result.error}`, "error");
        return;
    }

    localStorage.removeItem('agri_cart');
    updateCartBadge();
    showToast("Order placed successfully!");
    setTimeout(() => window.location.href = 'buyer-dash.html', 1500);
}

// --- ORDER LIFECYCLE MANAGEMENT ---
function getOrderStatusBadge(status) {
    const s = (status || 'placed').toLowerCase();
    switch (s) {
        case 'placed': return '<span class="bg-amber-100 text-amber-800 px-2.5 py-1 rounded text-xs font-bold uppercase">Placed</span>';
        case 'confirmed': return '<span class="bg-blue-100 text-blue-800 px-2.5 py-1 rounded text-xs font-bold uppercase">Confirmed</span>';
        case 'dispatched': return '<span class="bg-purple-100 text-purple-800 px-2.5 py-1 rounded text-xs font-bold uppercase">Dispatched</span>';
        case 'delivered': return '<span class="bg-green-100 text-green-800 px-2.5 py-1 rounded text-xs font-bold uppercase">Delivered</span>';
        default: return `<span class="bg-slate-100 text-slate-800 px-2 py-1 rounded text-xs uppercase">${status}</span>`;
    }
}

async function updateOrderStatus(orderId, newStatus) {
    const res = await ApiService.updateOrderStatus(orderId, newStatus);
    if (res && !res.error) {
        showToast(`Order status updated to: ${newStatus.toUpperCase()}`);
        setTimeout(() => location.reload(), 1000);
    } else {
        showToast('Failed to update order status', 'error');
    }
}

// --- DASHBOARDS & PORTALS ---
function renderFarmerDashboard() {
    const tbody = document.getElementById('farmer-produce-tbody');
    if (!tbody) return;

    if (!activeUser || activeUser.role !== 'farmer') {
        tbody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-slate-400 text-xs">Please log in as a farmer to manage listings.</td></tr>`;
        return;
    }

    const myProduce = produceData.filter(p => p.farmer_id === activeUser.id);
    setElementText('farmer-items-count-badge', `${myProduce.length} Items`);

    if (myProduce.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-slate-400 text-xs">You have not listed any produce yet.</td></tr>`;
        return;
    }

    tbody.innerHTML = myProduce.map(p => `
        <tr class="hover:bg-slate-50">
            <td class="p-4 font-bold text-slate-900">${p.title}</td>
            <td class="p-4">${p.category || '-'}</td>
            <td class="p-4 font-bold">KES ${p.price} / ${p.unit}</td>
            <td class="p-4">${p.stock} ${p.unit}s</td>
            <td class="p-4">${p.farmer_location || p.location || 'Kenya'}</td>
            <td class="p-4">
                ${p.is_approved ? 
                    `<span class="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">Approved & Live</span>` : 
                    `<span class="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px]">Pending Approval</span>`
                }
            </td>
            <td class="p-4 text-right">
                <button onclick="deleteProduceItem(${p.id})" class="text-red-500 hover:text-red-700 font-bold text-xs"><i class="fa-solid fa-trash"></i> Delete</button>
            </td>
        </tr>
    `).join('');
}

function renderBuyerDashboard() {
    const container = document.getElementById('buyer-orders-list');
    if (!container) return;

    if (!activeUser) {
        container.innerHTML = `<div class="bg-white p-6 rounded-2xl text-center text-slate-400 text-xs">Please log in to view your orders.</div>`;
        return;
    }

    const myOrders = ordersData.filter(o => o.buyer_id === activeUser.id);
    if (myOrders.length === 0) {
        container.innerHTML = `<div class="bg-white p-6 rounded-2xl text-center text-slate-400 text-xs">No orders placed yet.</div>`;
        return;
    }

    container.innerHTML = myOrders.map(o => `
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div class="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
                <div>
                    <span class="font-extrabold text-slate-900 text-sm">Order ID: ${o.id}</span>
                    <span class="block text-[11px] text-slate-400">Recipient: ${o.recipient_name} (${o.delivery_address})</span>
                </div>
                <div class="flex items-center space-x-3">
                    ${getOrderStatusBadge(o.status)}
                    <button onclick="viewReceipt('${o.id}')" class="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-300 transition flex items-center space-x-1.5">
                        <i class="fa-solid fa-receipt text-green-700"></i>
                        <span>Receipt</span>
                    </button>
                </div>
            </div>
            <div class="text-xs text-slate-600 flex justify-between items-center">
                <span>Payment Method: <strong class="uppercase">${o.payment_method || 'M-Pesa'}</strong></span>
                <div>
                    <span class="text-slate-400">Total Paid: </span>
                    <span class="font-extrabold text-green-700 text-base">KES ${Number(o.total).toLocaleString()}</span>
                </div>
            </div>
        </div>
    `).join('');
}

let activeReceiptOrder = null;

function viewReceipt(orderId) {
    const order = ordersData.find(o => o.id === orderId);
    if (!order) {
        showToast("Order details not found.", "error");
        return;
    }

    const receiptContainer = document.getElementById('receipt-content');
    if (!receiptContainer) return;

    let itemsHTML = '';
    if (order.items && Array.isArray(order.items) && order.items.length > 0) {
        itemsHTML = order.items.map(i => `
            <div class="flex justify-between text-xs py-1.5 border-b border-slate-100">
                <div>
                    <span class="font-bold text-slate-800">${i.title || 'Produce Item'}</span>
                    <span class="block text-[10px] text-slate-500">Qty: ${i.quantity} ${i.unit || 'units'} × KES ${Number(i.unit_price).toLocaleString()}</span>
                </div>
                <span class="font-semibold text-slate-900 self-center">KES ${(i.quantity * i.unit_price).toLocaleString()}</span>
            </div>
        `).join('');
    } else {
        itemsHTML = `<p class="text-xs text-slate-400 italic py-2 text-center">No itemized breakdown recorded for this order.</p>`;
    }

    receiptContainer.innerHTML = `
        <div class="space-y-4 text-left" data-order-id="${order.id}">
            <div class="flex justify-between items-start border-b border-slate-200 pb-4">
                <div>
                    <div class="flex items-center space-x-2 text-green-800 font-extrabold text-lg">
                        <i class="fa-solid fa-wheat-awn text-green-600"></i>
                        <span>AgriConnect</span>
                    </div>
                    <p class="text-[10px] text-slate-500">Kenyan Farm-to-Buyer Marketplace</p>
                </div>
                <div class="text-right">
                    <span class="font-extrabold text-slate-900 text-sm block">${order.id}</span>
                    <span class="text-[10px] text-slate-500">${new Date(order.created_at || Date.now()).toLocaleDateString('en-KE')}</span>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-xl">
                <div>
                    <span class="font-bold text-slate-700 block">Buyer Details</span>
                    <p>${order.recipient_name || (activeUser ? activeUser.name : 'Valued Buyer')}</p>
                    <p class="text-slate-500">${order.delivery_address}</p>
                </div>
                <div>
                    <span class="font-bold text-slate-700 block">Order Status & Payment</span>
                    <p>Status: <strong class="uppercase text-green-700">${order.status}</strong></p>
                    <p>Method: <strong class="uppercase">${order.payment_method || 'M-Pesa'}</strong></p>
                </div>
            </div>

            <div class="space-y-1">
                <span class="font-bold text-slate-700 text-xs block uppercase tracking-wider">Itemized Ordered Harvests</span>
                <div class="max-h-44 overflow-y-auto divide-y divide-slate-100 pr-1">
                    ${itemsHTML}
                </div>
            </div>

            <div class="border-t border-slate-200 pt-3 text-xs space-y-1.5">
                <div class="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>KES ${Number(order.subtotal || (order.total - 250)).toLocaleString()}</span>
                </div>
                <div class="flex justify-between text-slate-600">
                    <span>Logistics & Handling Fee</span>
                    <span>KES ${Number(order.shipping_fee || 250).toLocaleString()}</span>
                </div>
                <div class="flex justify-between font-extrabold text-slate-900 text-sm border-t border-slate-100 pt-2">
                    <span>Total Amount Paid</span>
                    <span class="text-green-700">KES ${Number(order.total).toLocaleString()}</span>
                </div>
            </div>

            <div class="text-[10px] text-slate-400 text-center italic pt-2 border-t border-slate-100">
                Thank you for supporting smallholder farmers across Kenya with AgriConnect!
            </div>
        </div>
    `;

    document.getElementById('printable-receipt').classList.remove('hidden');
}

// Save/Download Receipt as Text File
function downloadReceiptTxt() {
    const downloadBtn = document.getElementById('btn-download-receipt');
    const orderId = downloadBtn ? downloadBtn.getAttribute('data-order-id') : null;
    const order = ordersData.find(o => o.id === orderId);

    if (!order) {
        showToast("No active receipt to download.", "error");
        return;
    }

    let itemsTxt = "ITEMIZED HARVESTS:\n";
    if (order.items && Array.isArray(order.items) && order.items.length > 0) {
        order.items.forEach(i => {
            itemsTxt += `- ${i.title || 'Produce'}: Qty ${i.quantity} ${i.unit || 'units'} @ KES ${i.unit_price} = KES ${i.quantity * i.unit_price}\n`;
        });
    } else {
        itemsTxt += "- Produce items included in order\n";
    }

    const receiptText = `
========================================
             AGRICONNECT RECEIPT
     Kenyan Farm-to-Buyer Marketplace
========================================
Order ID:        ${order.id}
Date:            ${new Date(order.created_at || Date.now()).toLocaleDateString('en-KE')}
Recipient:       ${order.recipient_name}
Address:         ${order.delivery_address}
Payment Status:  ${order.status.toUpperCase()}
Payment Method:  ${(order.payment_method || 'M-Pesa').toUpperCase()}

----------------------------------------
${itemsTxt}----------------------------------------
Subtotal:        KES ${Number(order.subtotal || (order.total - 250)).toLocaleString()}
Logistics Fee:   KES ${Number(order.shipping_fee || 250).toLocaleString()}
TOTAL PAID:      KES ${Number(order.total).toLocaleString()}
========================================
  Thank you for supporting Kenyan farmers!
========================================
`;

    const blob = new Blob([receiptText.trim()], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `AgriConnect_Receipt_${order.id}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);

    showToast("Receipt saved to your downloads!");
}

function viewReceipt(orderId) {
    const order = ordersData.find(o => o.id === orderId);
    if (!order) {
        showToast("Order details not found.", "error");
        return;
    }

    const receiptContainer = document.getElementById('receipt-content');
    if (!receiptContainer) return;

    let itemsHTML = '';
    if (order.items && Array.isArray(order.items) && order.items.length > 0) {
        itemsHTML = order.items.map(i => `
            <div class="flex justify-between text-xs py-1.5 border-b border-slate-100">
                <div>
                    <span class="font-bold text-slate-800">${i.title || 'Produce Item'}</span>
                    <span class="block text-[10px] text-slate-500">Qty: ${i.quantity} ${i.unit || 'units'} × KES ${Number(i.unit_price).toLocaleString()}</span>
                </div>
                <span class="font-semibold text-slate-900 self-center">KES ${(i.quantity * i.unit_price).toLocaleString()}</span>
            </div>
        `).join('');
    } else {
        itemsHTML = `<p class="text-xs text-slate-400 italic py-2 text-center">No itemized breakdown recorded for this order.</p>`;
    }

    receiptContainer.innerHTML = `
        <div class="space-y-4 text-left">
            <!-- Header -->
            <div class="flex justify-between items-start border-b border-slate-200 pb-4">
                <div>
                    <div class="flex items-center space-x-2 text-green-800 font-extrabold text-lg">
                        <i class="fa-solid fa-wheat-awn text-green-600"></i>
                        <span>AgriConnect</span>
                    </div>
                    <p class="text-[10px] text-slate-500">Kenyan Farm-to-Buyer Marketplace</p>
                </div>
                <div class="text-right">
                    <span class="font-extrabold text-slate-900 text-sm block">${order.id}</span>
                    <span class="text-[10px] text-slate-500">${new Date(order.created_at || Date.now()).toLocaleDateString('en-KE')}</span>
                </div>
            </div>

            <!-- Meta details -->
            <div class="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-xl">
                <div>
                    <span class="font-bold text-slate-700 block">Buyer Details</span>
                    <p>${order.recipient_name || (activeUser ? activeUser.name : 'Valued Buyer')}</p>
                    <p class="text-slate-500">${order.delivery_address}</p>
                </div>
                <div>
                    <span class="font-bold text-slate-700 block">Order Status & Payment</span>
                    <p>Status: <strong class="uppercase text-green-700">${order.status}</strong></p>
                    <p>Method: <strong class="uppercase">${order.payment_method || 'M-Pesa'}</strong></p>
                </div>
            </div>

            <!-- Itemized List Table -->
            <div class="space-y-1">
                <span class="font-bold text-slate-700 text-xs block uppercase tracking-wider">Itemized Ordered Harvests</span>
                <div class="max-h-44 overflow-y-auto divide-y divide-slate-100 pr-1">
                    ${itemsHTML}
                </div>
            </div>

            <!-- Financial Breakdown -->
            <div class="border-t border-slate-200 pt-3 text-xs space-y-1.5">
                <div class="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>KES ${Number(order.subtotal || (order.total - 250)).toLocaleString()}</span>
                </div>
                <div class="flex justify-between text-slate-600">
                    <span>Logistics & Handling Fee</span>
                    <span>KES ${Number(order.shipping_fee || 250).toLocaleString()}</span>
                </div>
                <div class="flex justify-between font-extrabold text-slate-900 text-sm border-t border-slate-100 pt-2">
                    <span>Total Amount Paid</span>
                    <span class="text-green-700">KES ${Number(order.total).toLocaleString()}</span>
                </div>
            </div>

            <div class="text-[10px] text-slate-400 text-center italic pt-2 border-t border-slate-100">
                Thank you for supporting smallholder farmers across Kenya with AgriConnect!
            </div>
        </div>
    `;

    document.getElementById('printable-receipt').classList.remove('hidden');
}

function closeReceipt() {
    const modal = document.getElementById('printable-receipt');
    if (modal) modal.classList.add('hidden');
}

function renderAdminDashboard() {
    const container = document.getElementById('admin-orders-container');
    const produceTbody = document.getElementById('admin-produce-tbody');
    
    if (!produceTbody && !container) return;

    const pendingProduce = produceData.filter(p => !p.is_approved);
    setElementText('admin-pending-produce-count', pendingProduce.length);
    setElementText('admin-total-produce-count', produceData.length);

    // 1. Render Produce Approval Table
    if (produceTbody) {
        if (produceData.length === 0) {
            produceTbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-slate-400">No produce listings found.</td></tr>`;
        } else {
            produceTbody.innerHTML = produceData.map(p => `
                <tr class="hover:bg-slate-50">
                    <td class="p-3 font-bold text-slate-900">${p.title}</td>
                    <td class="p-3">${p.farmer_name || 'Farmer'}</td>
                    <td class="p-3">${p.category || '-'}</td>
                    <td class="p-3 font-bold">KES ${p.price}</td>
                    <td class="p-3">
                        ${p.is_approved ? 
                            '<span class="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold text-[10px]">Approved</span>' : 
                            '<span class="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold text-[10px]">Pending</span>'}
                    </td>
                    <td class="p-3 text-right space-x-2">
                        ${!p.is_approved ? `
                            <button onclick="adminApproveProduce(${p.id}, true)" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded text-xs">Approve</button>
                        ` : `
                            <button onclick="adminApproveProduce(${p.id}, false)" class="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-2.5 py-1 rounded text-xs">Revoke</button>
                        `}
                        <button onclick="deleteProduceItem(${p.id})" class="text-red-500 hover:text-red-700 font-bold text-xs"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `).join('');
        }
    }

    // 2. Render Orders Lifecycle Control
    if (container) {
        if (ordersData.length === 0) {
            container.innerHTML = `<div class="p-4 text-center text-slate-400 text-xs">No platform orders found.</div>`;
        } else {
            container.innerHTML = ordersData.map(o => `
                <div class="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                    <div>
                        <span class="font-bold text-slate-900 text-sm">${o.id}</span> — <span>Buyer ID: ${o.buyer_id}</span>
                        <div class="text-slate-500">Recipient: ${o.recipient_name} | Address: ${o.delivery_address}</div>
                        <div class="text-green-700 font-bold mt-1">Total: KES ${Number(o.total).toLocaleString()}</div>
                    </div>
                    <div class="flex items-center space-x-2">
                        ${getOrderStatusBadge(o.status)}
                        <select onchange="updateOrderStatus('${o.id}', this.value)" class="bg-slate-50 border border-slate-300 rounded-lg p-1.5 font-medium text-xs">
                            <option value="" disabled selected>Change Lifecycle...</option>
                            <option value="placed">Placed</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="dispatched">Dispatched</option>
                            <option value="delivered">Delivered</option>
                        </select>
                    </div>
                </div>
            `).join('');
        }
    }
}

async function adminApproveProduce(id, isApproved) {
    const res = await ApiService.approveProduce(id, isApproved);
    if (res && !res.error) {
        showToast(isApproved ? "Produce approved and made live!" : "Produce approval revoked.");
        await loadGlobalData();
        renderAdminDashboard();
    } else {
        showToast("Failed to update approval status.", "error");
    }
}

async function deleteProduceItem(id) {
    await ApiService.deleteProduce(id);
    await loadGlobalData();
    renderFarmerDashboard();
    renderAdminDashboard();
    showToast("Listing removed successfully.");
}

// --- MODALS & FORMS ---
function openProduceModal() {
    if (!activeUser || (activeUser.role !== 'farmer' && activeUser.role !== 'admin')) {
        showToast("Only verified farmers or admins can list produce.", "error");
        return;
    }
    const modal = document.getElementById('produce-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeProduceModal() {
    const modal = document.getElementById('produce-modal');
    if (modal) modal.classList.add('hidden');
}

async function handleSaveProduce(event) {
    event.preventDefault();
    const title = document.getElementById('modal-name').value;
    const categoryName = document.getElementById('modal-category').value;
    const categoryMap = { "Vegetables": 1, "Fruits": 2, "Grains": 3, "Tubers": 4, "Dairy": 5 };
    const category_id = categoryMap[categoryName] || 1;

    const price = parseFloat(document.getElementById('modal-price').value);
    const stock = parseInt(document.getElementById('modal-stock').value);
    const unit = document.getElementById('modal-unit').value;
    const image_url = document.getElementById('modal-image').value || "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80";
    const description = document.getElementById('modal-desc').value;

    const result = await ApiService.createProduce({
        farmer_id: activeUser.id,
        title,
        category_id,
        price,
        unit,
        stock,
        description,
        image_url
    });

    if (result.error) {
        showToast(result.error, "error");
        return;
    }

    closeProduceModal();
    await loadGlobalData();
    renderFarmerDashboard();
    showToast("Harvest submitted for admin approval!");
}

// --- AUTH HANDLERS ---
function switchAuthMode(mode) {
    const loginForm = document.getElementById('form-login');
    const registerForm = document.getElementById('form-register');
    const tabLogin = document.getElementById('auth-tab-login');
    const tabRegister = document.getElementById('auth-tab-register');

    if (!loginForm || !registerForm) return;

    if (mode === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        if (tabLogin) tabLogin.className = 'flex-1 py-2 rounded-lg bg-white text-slate-900 shadow-sm transition';
        if (tabRegister) tabRegister.className = 'flex-1 py-2 rounded-lg text-slate-500 transition';
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        if (tabRegister) tabRegister.className = 'flex-1 py-2 rounded-lg bg-white text-slate-900 shadow-sm transition';
        if (tabLogin) tabLogin.className = 'flex-1 py-2 rounded-lg text-slate-500 transition';
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const location = document.getElementById('reg-location').value;
    const password = document.getElementById('reg-password').value;
    const roleEl = document.querySelector('input[name="auth-role"]:checked');
    const role = roleEl ? roleEl.value : 'buyer';

    const result = await ApiService.register({ name, email, password, role, location });
    if (result.error) {
        showToast(result.error, "error");
        return;
    }

    activeUser = result.user;
    localStorage.setItem('agri_current_user', JSON.stringify(activeUser));
    showToast("Account created successfully!");

    setTimeout(() => {
        if (role === 'farmer') window.location.href = 'farmer-dash.html';
        else window.location.href = 'catalogue.html';
    }, 1000);
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    const result = await ApiService.login({ email, password });
    if (result.error) {
        showToast(result.error, "error");
        return;
    }

    activeUser = result.user;
    localStorage.setItem('agri_current_user', JSON.stringify(activeUser));
    showToast(`Welcome back, ${activeUser.name}!`);

    setTimeout(() => {
        if (activeUser.role === 'admin') window.location.href = 'admin-dash.html';
        else if (activeUser.role === 'farmer') window.location.href = 'farmer-dash.html';
        else window.location.href = 'catalogue.html';
    }, 1000);
}

async function handleContactSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        // Change '/api/contact' to include 'http://localhost:3000'
        const response = await fetch('http://localhost:3000/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();

        if (result.status === 'success') {
            showToast("Support message sent successfully!");
            setTimeout(() => window.location.href = 'index.html', 1500);
        } else {
            showToast("Error: " + result.message);
        }
    } catch (error) {
        showToast("Network error! Please try again.");
        console.error(error);
    }
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `p-3 rounded-xl text-xs font-bold text-white shadow-lg pointer-events-auto transition ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function openForgotPasswordModal() {
    const modal = document.getElementById('forgot-password-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeForgotPasswordModal() {
    const modal = document.getElementById('forgot-password-modal');
    if (modal) modal.classList.add('hidden');
}

async function handleForgotPasswordSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('forgot-email').value.trim();
    const newPassword = document.getElementById('forgot-new-password').value;

    const result = await ApiService._request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email, new_password: newPassword })
    });

    if (result && result.status === 'success') {
        showToast("Password updated successfully! You can now log in.");
        closeForgotPasswordModal();
    } else {
        showToast(result.error || result.message || "Failed to reset password.", "error");
    }
}