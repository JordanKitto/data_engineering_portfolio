export function initNavigation() {
    initSmoothScroll();
    initMobileMenu();
}

function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();
            const offsetTop = targetElement.offsetTop - 80;

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        });
    });
}

function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    if (!mobileMenuBtn || !mobileMenu || !mobileMenuOverlay) return;

    let isMenuOpen = false;

    // Open menu
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isMenuOpen = true;
        mobileMenuOverlay.classList.remove('hidden');
        mobileMenu.classList.remove('hidden');
        // Trigger reflow to enable transition
        requestAnimationFrame(() => {
            mobileMenu.classList.remove('opacity-0', '-translate-y-4');
            mobileMenu.classList.add('opacity-100', 'translate-y-0');
        });
    });

    // Close menu
    const closeMenu = () => {
        if (!isMenuOpen) return;
        isMenuOpen = false;
        mobileMenu.classList.remove('opacity-100', 'translate-y-0');
        mobileMenu.classList.add('opacity-0', '-translate-y-4');
        mobileMenuOverlay.classList.add('opacity-0');
        setTimeout(() => {
            mobileMenu.classList.add('hidden');
            mobileMenuOverlay.classList.add('hidden');
            mobileMenuOverlay.classList.remove('opacity-0');
        }, 300);
    };

    // Close menu when clicking on overlay
    mobileMenuOverlay.addEventListener('click', closeMenu);

    // Close menu when clicking anywhere on the document (outside menu)
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            closeMenu();
        }
    });

    // Close menu when clicking on a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });
}
