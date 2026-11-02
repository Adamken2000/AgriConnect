document.addEventListener("DOMContentLoaded", async () => {
    // 1. Inject Header
    const headerContainer = document.getElementById("site-header");
    if (headerContainer) {
        headerContainer.innerHTML = `
        <header class="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40 no-print">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <!-- Brand Logo -->
                    <a href="index.html" class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-xl bg-green-700 flex items-center justify-center text-white shadow-md">
                            <i class="fa-solid fa-wheat-awn text-xl"></i>
                        </div>
                        <div>
                            <span class="text-xl font-extrabold text-green-900 tracking-tight">Agri<span class="text-green-600">Connect</span></span>
                            <span class="block text-[10px] text-slate-500 font-medium leading-none">Kenyan Agribusiness Portal</span>
                        </div>
                    </a>

                    <!-- Navigation Links -->
                    <nav class="hidden md:flex space-x-6 text-sm font-medium text-slate-700 h-full items-center">
                        <a href="index.html" class="nav-item hover:text-green-600 transition flex items-center space-x-1 py-5 px-1 border-b-2 border-transparent" data-page="index.html">
                            <i class="fa-solid fa-house text-xs"></i><span>Home</span>
                        </a>
                        <a href="catalogue.html" class="nav-item hover:text-green-600 transition flex items-center space-x-1 py-5 px-1 border-b-2 border-transparent" data-page="catalogue.html">
                            <i class="fa-solid fa-basket-shopping text-xs"></i><span>Catalogue</span>
                        </a>
                        <a href="about.html" class="nav-item hover:text-green-600 transition flex items-center space-x-1 py-5 px-1 border-b-2 border-transparent" data-page="about.html">
                            <i class="fa-solid fa-circle-info text-xs"></i><span>About Us</span>
                        </a>
                        <a href="contact.html" class="nav-item hover:text-green-600 transition flex items-center space-x-1 py-5 px-1 border-b-2 border-transparent" data-page="contact.html">
                            <i class="fa-solid fa-envelope text-xs"></i><span>Contact</span>
                        </a>
                        
                        <!-- Role Dashboard link -->
                        <button onclick="navigateToRoleDashboard(event)" class="text-green-700 font-bold hover:text-green-900 transition flex items-center space-x-1.5 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                            <i class="fa-solid fa-gauge text-xs"></i>
                            <span>Dashboard</span>
                        </button>
                    </nav>

                    <!-- Actions / Cart / User Session Details -->
                    <div class="flex items-center space-x-3">
                        <a href="cart.html" class="nav-item relative p-2 text-slate-700 hover:text-green-700 transition" data-page="cart.html">
                            <i class="fa-solid fa-cart-shopping text-xl"></i>
                            <span id="cart-badge-count" class="absolute -top-1 -right-1 bg-amber-500 text-slate-900 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">0</span>
                        </a>

                        <div id="nav-user-area" class="hidden sm:flex items-center space-x-3 pl-2 border-l border-slate-200">
                            <div class="text-right text-xs">
                                <div id="header-user-name" class="font-bold text-slate-900">Guest User</div>
                                <div id="header-user-role-badge" class="text-[10px] text-slate-500 uppercase font-semibold">Not Logged In</div>
                            </div>
                            <button onclick="handleLogout()" id="btn-logout" class="hidden text-xs text-red-600 hover:text-red-800 font-bold px-2 py-1 rounded bg-red-50 border border-red-200">
                                Logout
                            </button>
                            <a href="auth.html" id="btn-login-register" class="nav-item bg-green-700 hover:bg-green-800 text-white font-semibold text-xs px-3 py-2 rounded-lg transition shadow-sm flex items-center space-x-1" data-page="auth.html">
                                <i class="fa-solid fa-right-to-bracket"></i>
                                <span>Login / Register</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </header>`;
    }

    // 2. Inject Common Footer
    const footerContainer = document.getElementById("site-footer");
    if (footerContainer) {
        footerContainer.innerHTML = `
        <footer class="bg-slate-900 text-slate-400 text-xs pt-12 pb-8 border-t border-slate-800 no-print mt-12">
            <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
                <div class="space-y-3">
                    <div class="flex items-center space-x-2 text-white font-extrabold text-base">
                        <i class="fa-solid fa-wheat-awn text-green-500"></i>
                        <span>AgriConnect</span>
                    </div>
                    <p class="text-slate-400 text-xs leading-relaxed">
                        Connecting Kenyan farmers directly to buyers, ensuring transparent pricing, fast logistics, and zero middleman markups.
                    </p>
                </div>
                <div>
                    <h4 class="text-white font-bold text-sm mb-3">Quick Navigation</h4>
                    <ul class="space-y-2">
                        <li><a href="index.html" class="hover:text-white transition">Home Page</a></li>
                        <li><a href="catalogue.html" class="hover:text-white transition">Fresh Produce Catalogue</a></li>
                        <li><a href="about.html" class="hover:text-white transition">About Our Mission</a></li>
                        <li><a href="contact.html" class="hover:text-white transition">Contact & Support</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-white font-bold text-sm mb-3">User Options</h4>
                    <ul class="space-y-2">
                        <li><a href="auth.html" class="hover:text-white transition">Account Access / Sign In</a></li>
                        <li><a href="#" onclick="navigateToRoleDashboard(event)" class="hover:text-white transition">User Dashboard</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-white font-bold text-sm mb-3">Live Platform Metrics</h4>
                    <div class="space-y-2 text-slate-300">
                        <div class="flex justify-between">
                            <span>Approved Produce:</span>
                            <span class="font-bold text-green-500" id="footer-stat-listings">0</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Orders Tracked:</span>
                            <span class="font-bold text-amber-400" id="footer-stat-orders">0</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Trading Volume:</span>
                            <span class="font-bold text-emerald-400" id="footer-stat-volume">KES 0</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="max-w-7xl mx-auto px-4 pt-6 flex flex-col sm:flex-row justify-between items-center text-slate-500 text-[11px]">
                <p>&copy; 2026 AgriConnect Platform. All rights reserved.</p>
                <p class="mt-2 sm:mt-0">Farm-to-Buyer Digital Agriculture Solution</p>
            </div>
        </footer>`;
    }

    // 3. Highlight the Active Page link automatically
    highlightActivePage();
    loadFooterStats();
});

function highlightActivePage() {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const navItems = document.querySelectorAll(".nav-item");
    
    navItems.forEach(item => {
        const pageTarget = item.getAttribute("data-page");
        if (pageTarget === currentPath) {
            item.classList.add("nav-link-active");
        }
    });
}

async function loadFooterStats() {
    if (typeof ApiService !== 'undefined') {
        const produce = await ApiService.getProduce();
        const orders = await ApiService.getOrders();

        if (Array.isArray(produce)) {
            const approved = produce.filter(p => p.is_approved == 1);
            const listingsEl = document.getElementById('footer-stat-listings');
            if (listingsEl) listingsEl.textContent = approved.length;
        }

        if (Array.isArray(orders)) {
            const ordersEl = document.getElementById('footer-stat-orders');
            if (ordersEl) ordersEl.textContent = orders.length;

            const totalVol = orders.reduce((sum, o) => sum + Number(o.total_price || 0), 0);
            const volumeEl = document.getElementById('footer-stat-volume');
            if (volumeEl) volumeEl.textContent = `KES ${totalVol.toLocaleString()}`;
        }
    }
}

function navigateToRoleDashboard(e) {
    if (e) e.preventDefault();
    const user = JSON.parse(localStorage.getItem('agri_current_user') || 'null');
    if (!user) {
        window.location.href = 'auth.html';
        return;
    }
    if (user.role === 'farmer') window.location.href = 'farmer-dash.html';
    else if (user.role === 'buyer') window.location.href = 'buyer-dash.html';
    else if (user.role === 'admin') window.location.href = 'admin-dash.html';
}