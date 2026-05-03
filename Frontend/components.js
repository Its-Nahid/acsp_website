/**
 * ACSP Shared Components
 * This script injects the common Navbar and Footer into pages.
 */

const components = {
    navbar: `
    <header class="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b px-6 lg:px-20 py-4 border-primary/10">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
            <div class="flex items-center gap-4 cursor-pointer" onclick="window.location.href='index.html'">
                <div class="bg-primary p-2 rounded-xl text-white shadow-lg shadow-primary/20">
                    <span class="material-symbols-outlined text-2xl">pets</span>
                </div>
                <span class="text-2xl font-black tracking-tight text-[#1a1c23] dark:text-white">ACSP</span>
            </div>
            <nav class="hidden lg:flex items-center bg-white dark:bg-zinc-800 px-8 py-3 rounded-full shadow-sm border border-gray-100 dark:border-zinc-700 gap-8">
                <a class="text-sm font-bold text-gray-500 hover:text-primary transition-colors" href="login.html">User</a>
                <a class="text-sm font-bold text-gray-500 hover:text-primary transition-colors" href="ngo_directory.html">NGO</a>
                <a class="text-sm font-bold text-gray-500 hover:text-primary transition-colors" href="directory.html">NGO</a>
                <a class="text-sm font-bold text-gray-500 hover:text-primary transition-colors" href="#">Treatment</a>
                <a class="text-sm font-bold text-gray-500 hover:text-primary transition-colors" id="nav-animal" href="animal_listing.html">Animal</a>
                <a class="text-sm font-bold text-gray-500 hover:text-primary transition-colors" href="donation.html">Donation</a>
                <a class="text-sm font-bold text-gray-500 hover:text-primary transition-colors" id="nav-adoption" href="adoptionpage.html">Adoption</a>
                <a class="text-sm font-bold text-gray-500 hover:text-primary transition-colors" id="nav-rescue" href="report.html">Rescue</a>
            </nav>
            <div class="flex items-center gap-3" id="auth-container">
                <!-- Auth buttons injected by JS -->
            </div>
        </div>
    </header>
    `,
    footer: `
    <footer class="bg-white dark:bg-background-dark py-12 px-4 md:px-10 border-t border-slate-100 dark:border-slate-800">
        <div class="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div class="flex flex-col gap-4">
                <div class="flex items-center gap-2">
                    <div class="p-1.5 bg-primary rounded-full text-white">
                        <span class="material-symbols-outlined text-xl">pets</span>
                    </div>
                    <h2 class="text-lg font-black dark:text-white">ACSP</h2>
                </div>
                <p class="text-slate-500 text-sm leading-relaxed">
                    Bangladesh's new platform for animal welfare, rescue coordination, and sustainable adoption solutions.
                </p>
                <div class="flex gap-4 mt-2">
                    <a class="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:text-primary transition-colors" href="#"><span class="material-symbols-outlined text-slate-600 dark:text-slate-300">public</span></a>
                    <a class="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:text-primary transition-colors" href="#"><span class="material-symbols-outlined text-slate-600 dark:text-slate-300">share</span></a>
                    <a class="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:text-primary transition-colors" href="#"><span class="material-symbols-outlined text-slate-600 dark:text-slate-300">mail</span></a>
                </div>
            </div>
            <div>
                <h4 class="font-bold mb-6 dark:text-white">Quick Links</h4>
                <ul class="flex flex-col gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <li><a class="hover:text-primary transition-colors" href="animal_listing.html">Rescued Animals</a></li>
                    <li><a class="hover:text-primary transition-colors" href="ngo_directory.html">NGO Directory</a></li>
                    <li><a class="hover:text-primary transition-colors" href="article.html">Animal Care Guide</a></li>
                    <li><a class="hover:text-primary transition-colors" href="donation-tracking.html">Transparency Dashboard</a></li>
                    <li><a class="hover:text-primary transition-colors" href="donation.html">Donate Supplies</a></li>
                </ul>
            </div>
            <div>
                <h4 class="font-bold mb-6 dark:text-white">Categories</h4>
                <ul class="flex flex-col gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <li><a class="hover:text-primary transition-colors" href="#">Medical Treatment</a></li>
                    <li><a class="hover:text-primary transition-colors" href="#">Emergency Rescue</a></li>
                    <li><a class="hover:text-primary transition-colors" href="#">Lost & Found</a></li>
                    <li><a class="hover:text-primary transition-colors" href="#">Volunteer Program</a></li>
                </ul>
            </div>
            <div>
                <h4 class="font-bold mb-6 dark:text-white">Contact Us</h4>
                <ul class="flex flex-col gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <li class="flex items-center gap-2"><span class="material-symbols-outlined text-primary text-sm">location_on</span> Natore, Bangladesh</li>
                    <li class="flex items-center gap-2"><span class="material-symbols-outlined text-primary text-sm">call</span> +880 1828654109</li>
                    <li class="flex items-center gap-2"><span class="material-symbols-outlined text-primary text-sm">email</span> support@acsp-bd.org</li>
                </ul>
            </div>
        </div>
        <div class="max-w-[1440px] mx-auto mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400">
            © 2026 Animal Care Service Platform (ACSP). All rights reserved. Built for compassion.
        </div>
    </footer>
    `
};

document.addEventListener('DOMContentLoaded', () => {
    // Inject Navbar
    const navPlaceholder = document.getElementById('navbar-placeholder');
    if (navPlaceholder) {
        navPlaceholder.innerHTML = components.navbar;

        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage === 'report.html' || currentPage === 'rescue.html') {
            const rescueLink = document.getElementById('nav-rescue');
            if (rescueLink) {
                rescueLink.classList.remove('text-gray-500');
                rescueLink.classList.add('text-primary');
            }
        }
        if (currentPage === 'adoptionpage.html' || currentPage === 'adoption_form.html') {
            const adoptionLink = document.getElementById('nav-adoption');
            if (adoptionLink) {
                adoptionLink.classList.remove('text-gray-500');
                adoptionLink.classList.add('text-primary');
            }
        }
        if (currentPage === 'animal_listing.html') {
            const animalLink = document.getElementById('nav-animal');
            if (animalLink) {
                animalLink.classList.remove('text-gray-500');
                animalLink.classList.add('text-primary');

        // Update Auth Buttons based on login status
        const authContainer = document.getElementById('auth-container');
        if (authContainer) {
            const token = localStorage.getItem('token');
            if (token) {
                const role = localStorage.getItem('role');
                const adminBtn = role === 'admin' ? `<a href="admin_dashboard.html" class="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all"><span>Admin Panel</span><span class="material-symbols-outlined text-lg">admin_panel_settings</span></a>` : '';

                authContainer.innerHTML = `
                    ${adminBtn}
                    <button id="logoutBtn" class="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full text-sm font-bold shadow-lg shadow-red-500/25 hover:scale-105 transition-all flex items-center gap-2">
                        <span>Logout</span>
                        <span class="material-symbols-outlined text-lg">logout</span>
                    </button>
                `;
                
                document.getElementById('logoutBtn').addEventListener('click', () => {
                    localStorage.removeItem('token');
                    window.location.href = 'login.html';
                });
            } else {
                authContainer.innerHTML = `
                    <a href="login.html" class="text-sm font-bold text-gray-700 dark:text-gray-300 px-4">Login</a>
                    <a href="signup.html" class="bg-primary text-white px-8 py-3 rounded-full text-sm font-bold shadow-lg shadow-primary/25 hover:scale-105 transition-all">Register</a>
                `;
            }
        }
    }

    // Inject Footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = components.footer;
    }
});
