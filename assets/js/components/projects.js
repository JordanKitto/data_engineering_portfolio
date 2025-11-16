import { loadJSON } from '../utils/helpers.js';
import { animateProjectCard, animateModalIn, animateModalOut } from '../utils/animations.js';

let projectsPayload = null;

let projectsSplide = null;

export async function initProjects() {
    projectsPayload = await loadJSON('assets/data/projects.json');
    renderProjects();
    initProjectFilters();
    initProjectExpansion();
    initScrollAnimations();
    initProjectsCarousel();
}

function renderProjects() {
    if (!projectsPayload || !projectsPayload.projects) return;

    const projectsGrid = document.querySelector('[data-projects-grid]');
    const projectsCarouselList = document.querySelector('[data-projects-carousel] .splide__list');
    
    // Clear both containers
    if (projectsGrid) projectsGrid.innerHTML = '';
    if (projectsCarouselList) projectsCarouselList.innerHTML = '';

    projectsPayload.projects.forEach(project => {
        const card = createProjectCard(project);
        
        // Add to grid (desktop)
        if (projectsGrid) {
            projectsGrid.appendChild(card.cloneNode(true));
        }
        
        // Add to carousel (mobile)
        if (projectsCarouselList) {
            const li = document.createElement('li');
            li.className = 'splide__slide';
            li.appendChild(card);
            projectsCarouselList.appendChild(li);
        }
    });
}

function createProjectCard(project) {
    const div = document.createElement('div');
    div.className = 'project-card card-hover bg-white rounded-xl p-6 shadow-lg border border-gray-200';
    div.dataset.category = project.category.join(' ');
    div.dataset.projectId = project.id;

    const iconColor = getColor(project.iconColor);
    const iconSvg = getIconSvg(project.icon, iconColor);
    const techTags = (project.techStack || [])
        .map(
            tech =>
                `<span class="px-2 py-1 bg-${iconColor}-100 text-${iconColor}-600 text-xs rounded">${tech}</span>`
        )
        .join('');
    const metrics = (project.metrics || [])
        .map(
            metric => `
            <div class="flex justify-between text-sm">
                <span>${metric.label}</span>
                <span class="font-semibold text-${getColor(metric.color)}-600">${metric.value}</span>
            </div>
        `
        )
        .join('');

    div.innerHTML = `
        <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-${iconColor}-100 rounded-lg flex items-center justify-center">
                ${iconSvg}
            </div>
            <div class="flex space-x-1">
                ${techTags}
            </div>
        </div>
        <h3 class="text-xl font-bold mb-2">${project.title}</h3>
        <p class="text-gray-600 mb-4">${project.description}</p>
        <div class="space-y-2 mb-4">
            ${metrics}
        </div>
        <div class="flex space-x-2">
            <a href="${project.githubUrl}" target="_blank" class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-center hover:bg-gray-200 transition-colors">
                View Code
            </a>
            <button class="expand-btn flex-1 bg-${iconColor}-600 text-white px-4 py-2 rounded-lg hover:bg-${iconColor}-700 transition-colors" data-project="${project.id}">
                Details
            </button>
        </div>
    `;

    return div;
}

function getColor(color) {
    const colorMap = {
        blue: 'blue',
        emerald: 'emerald',
        amber: 'amber',
        purple: 'purple',
        green: 'green',
        orange: 'orange',
        yellow: 'yellow',
        red: 'red'
    };
    return colorMap[color] || 'blue';
}

function getIconSvg(iconType, color) {
    const icons = {
        lightning: `
            <svg class="w-6 h-6 text-${color}-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
        `,
        chart: `
            <svg class="w-6 h-6 text-${color}-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
        `,
        book: `
            <svg class="w-6 h-6 text-${color}-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
        `
    };
    return icons[iconType] || icons.lightning;
}

function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const filter = this.dataset.filter;

            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.add('border-gray-300', 'text-gray-600');
                btn.classList.remove('border-blue-600', 'text-blue-600');
            });

            this.classList.add('active');
            this.classList.remove('border-gray-300', 'text-gray-600');
            this.classList.add('border-blue-600', 'text-blue-600');

            document.querySelectorAll('.project-card').forEach(card => {
                const categories = (card.dataset.category || '').split(' ');
                const shouldShow = filter === 'all' || categories.includes(filter);
                
                // Handle parent slide in carousel
                const parentSlide = card.closest('.splide__slide');

                if (shouldShow) {
                    card.style.display = 'block';
                    if (parentSlide) {
                        parentSlide.style.display = 'block';
                    }
                    if (typeof anime !== 'undefined') {
                        anime({
                            targets: card,
                            opacity: [0, 1],
                            scale: [0.8, 1],
                            duration: 400,
                            easing: 'easeOutQuart'
                        });
                    }
                } else if (typeof anime !== 'undefined') {
                    anime({
                        targets: card,
                        opacity: [1, 0],
                        scale: [1, 0.8],
                        duration: 300,
                        easing: 'easeInQuart',
                        complete: () => {
                            card.style.display = 'none';
                            if (parentSlide) {
                                parentSlide.style.display = 'none';
                            }
                        }
                    });
                } else {
                    card.style.display = 'none';
                    if (parentSlide) {
                        parentSlide.style.display = 'none';
                    }
                }
            });
            
            // Refresh Splide carousel if it exists
            if (projectsSplide) {
                projectsSplide.refresh();
            }
        });
    });
}

function initProjectExpansion() {
    document.addEventListener('click', e => {
        if (e.target.classList.contains('expand-btn')) {
            const projectId = e.target.dataset.project;
            showProjectDetails(projectId);
        }
    });
}

function showProjectDetails(projectId) {
    if (!projectsPayload) return;

    const project = projectsPayload.projects.find(p => p.id === projectId);
    if (!project || !project.details) return;

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50';

    const features = (project.details.features || [])
        .map(feature => `<li class="flex items-start"><span class="text-blue-600 mr-2">•</span>${feature}</li>`)
        .join('');
    const techStack = (project.details.techStack || [])
        .map(tech => `<span class="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded">${tech}</span>`)
        .join('');

    modal.innerHTML = `
        <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-2xl font-bold">${project.details.title || project.title}</h3>
                    <button class="close-modal text-gray-400 hover:text-gray-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <p class="text-gray-600 mb-6">${project.details.description}</p>

                <div class="mb-6">
                    <h4 class="text-lg font-semibold mb-3">Key Features</h4>
                    <ul class="space-y-2">
                        ${features}
                    </ul>
                </div>

                <div class="mb-6">
                    <h4 class="text-lg font-semibold mb-3">Technology Stack</h4>
                    <div class="flex flex-wrap gap-2">
                        ${techStack}
                    </div>
                </div>

                <div class="mb-6">
                    <h4 class="text-lg font-semibold mb-3">Impact</h4>
                    <p class="text-gray-600">${project.details.impact}</p>
                </div>

                <div class="flex justify-end">
                    <button class="close-modal bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const modalContent = modal.querySelector('.bg-white');
    animateModalIn(modal, modalContent);

    const closeButtons = modal.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            animateModalOut(modal, () => modal.remove());
        });
    });

    modal.addEventListener('click', e => {
        if (e.target === modal) {
            animateModalOut(modal, () => modal.remove());
        }
    });
}

function initScrollAnimations() {
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                if (entry.target.classList.contains('project-card')) {
                    animateProjectCard(entry.target);
                }
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }
    );

    document.querySelectorAll('.project-card').forEach(card => observer.observe(card));
}

function initProjectsCarousel() {
    const carouselElement = document.getElementById('projects-carousel');
    if (!carouselElement) return;

    // Function to check screen size and initialize/destroy carousel
    const checkScreenSize = () => {
        if (window.innerWidth >= 1024) {
            // Desktop: destroy carousel if it exists
            if (projectsSplide) {
                projectsSplide.destroy();
                projectsSplide = null;
            }
        } else {
            // Mobile: initialize carousel if not already initialized
            if (!projectsSplide) {
                projectsSplide = new Splide('#projects-carousel', {
                    type: 'slide',
                    perPage: 1,
                    perMove: 1,
                    gap: '2rem',
                    pagination: true,
                    arrows: true,
                    breakpoints: {
                        640: {
                            perPage: 1,
                            gap: '1rem',
                        }
                    }
                }).mount();
            }
        }
    };

    // Check on load
    checkScreenSize();

    // Check on resize (with debounce)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(checkScreenSize, 250);
    });
}

