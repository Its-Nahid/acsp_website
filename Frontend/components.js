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
                <div class="relative group">
                    <a class="text-sm font-bold text-gray-500 hover:text-primary transition-colors flex items-center gap-1 py-1 cursor-pointer" href="ngo_directory.html">
                        NGO
                        <span class="material-symbols-outlined text-[18px]">expand_more</span>
                    </a>
                    <div class="absolute left-0 top-full w-60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left -translate-y-2 group-hover:translate-y-0 z-50 pt-2">
                        <div class="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-700 overflow-hidden py-2">
                            <a href="ngo-profile.html" class="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-primary/5 hover:text-primary transition-colors">
                                <span class="material-symbols-outlined text-lg">account_circle</span>
                                NGO Profile
                            </a>
                            <a href="ngo%20animal_listing.html" class="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-primary/5 hover:text-primary transition-colors">
                                <span class="material-symbols-outlined text-lg">pets</span>
                                Animal Listing
                            </a>
                            <a href="ngo%20donation-tracking.html" class="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-primary/5 hover:text-primary transition-colors">
                                <span class="material-symbols-outlined text-lg">payments</span>
                                Donation Tracking
                            </a>
                            <a href="ngo%20case-details.html" class="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-primary/5 hover:text-primary transition-colors">
                                <span class="material-symbols-outlined text-lg">description</span>
                                Case Details
                            </a>
                            <a href="volunteer.html" class="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-primary/5 hover:text-primary transition-colors">
                                <span class="material-symbols-outlined text-lg">volunteer_activism</span>
                                Volunteer
                            </a>
                        </div>
                    </div>
                </div>
                <div class="relative group">
                    <a class="text-sm font-bold text-gray-500 hover:text-primary transition-colors flex items-center gap-1 py-1 cursor-pointer" href="contact_doctors.html">
                        Treatment
                        <span class="material-symbols-outlined text-[18px]">expand_more</span>
                    </a>
                    <div class="absolute left-0 top-full w-60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left -translate-y-2 group-hover:translate-y-0 z-50 pt-2">
                        <div class="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-zinc-700 overflow-hidden py-2">
                            <a href="vet_directory.html" class="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-primary/5 hover:text-primary transition-colors">
                                <span class="material-symbols-outlined text-lg">medical_services</span>
                                Vet Directory
                            </a>
                            <a href="contact_doctors.html" class="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-primary/5 hover:text-primary transition-colors">
                                <span class="material-symbols-outlined text-lg">medical_information</span>
                                Contact Doctors
                            </a>
                            <a href="ai_chat.html" class="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-primary/5 hover:text-primary transition-colors">
                                <span class="material-symbols-outlined text-lg">smart_toy</span>
                                AI Assistant
                            </a>
                            <a href="article.html" class="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-primary/5 hover:text-primary transition-colors">
                                <span class="material-symbols-outlined text-lg">menu_book</span>
                                Animal Care Guide
                            </a>
                        </div>
                    </div>
                </div>
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
                    <li><a class="hover:text-primary transition-colors" href="vet_directory.html">Medical Treatment</a></li>
                    <li><a class="hover:text-primary transition-colors" href="#">Emergency Rescue</a></li>
                    <li><a class="hover:text-primary transition-colors" href="#">Lost & Found</a></li>
                    <li><a class="hover:text-primary transition-colors" href="volunteer.html">Volunteer Program</a></li>
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

    }

    // Inject Footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = components.footer;
    }

    // Update Auth UI
    updateAuthUI();
});

function updateAuthUI() {
    const authContainer = document.getElementById('auth-container');
    if (!authContainer) return;

    const token = localStorage.getItem('token');
    if (token) {
        // User is logged in
        authContainer.innerHTML = `
            <div class="flex items-center gap-4">
                <button onclick="handleLogout()" class="px-6 py-2.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-600 transition-all border border-gray-100 dark:border-zinc-700">
                    Logout
                </button>
                <div class="size-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary cursor-pointer hover:bg-primary hover:text-white transition-all shadow-sm">
                    <span class="material-symbols-outlined text-xl">person</span>
                </div>
            </div>
        `;
    } else {
        // User is logged out
        authContainer.innerHTML = `
            <div class="flex items-center gap-3">
                <a href="login.html" class="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-primary transition-colors">Login</a>
                <a href="signup.html" class="px-8 py-2.5 bg-primary text-white text-sm font-bold rounded-full shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">Sign Up</a>
            </div>
        `;
    }
}

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = 'index.html';
}
