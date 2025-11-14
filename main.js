// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initTypewriter();
    initScrollAnimations();
    initSkillsChart();
    initProjectFilters();
    initCounters();
    initContactForm();
    initMobileMenu();
    initSmoothScroll();
});

// Typewriter effect for hero section
function initTypewriter() {
    const typed = new Typed('#typed-text', {
        strings: [
            'Data Engineer',
            'Automation Expert',
            'Python Developer',
            'Systems Analyst'
        ],
        typeSpeed: 80,
        backSpeed: 60,
        backDelay: 2000,
        startDelay: 500,
        loop: true,
        showCursor: true,
        cursorChar: '|'
    });
}

// Scroll-triggered animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                if (element.classList.contains('skill-item')) {
                    animateSkillItem(element);
                } else if (element.classList.contains('project-card')) {
                    animateProjectCard(element);
                } else if (element.classList.contains('skill-bar')) {
                    animateSkillBar(element);
                }
                
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.skill-item, .project-card, .skill-bar').forEach(el => {
        observer.observe(el);
    });
}

// Animate skill items
function animateSkillItem(element) {
    anime({
        targets: element,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        easing: 'easeOutQuart',
        delay: anime.stagger(200)
    });
}

// Animate project cards
function animateProjectCard(element) {
    anime({
        targets: element,
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 600,
        easing: 'easeOutQuart',
        delay: Math.random() * 300
    });
}

// Animate skill bars
function animateSkillBar(element) {
    const width = element.dataset.width;
    anime({
        targets: element,
        width: width + '%',
        duration: 1000,
        easing: 'easeOutQuart',
        delay: 200
    });
}

// Skills radar chart
function initSkillsChart() {
    const chartDom = document.getElementById('skills-chart');
    if (!chartDom) return;
    
    const myChart = echarts.init(chartDom);
    
    const option = {
        title: {
            text: 'Technical Skills',
            left: 'center',
            textStyle: {
                fontSize: 18,
                fontWeight: 'bold',
                color: '#1A1A1A'
            }
        },
        tooltip: {
            trigger: 'item'
        },
        radar: {
            indicator: [
                { name: 'Python', max: 100 },
                { name: 'SQL', max: 100 },
                { name: 'Data Pipeline', max: 100 },
                { name: 'Automation', max: 100 },
                { name: 'Oracle', max: 100 },
                { name: 'ETL', max: 100 }
            ],
            shape: 'polygon',
            splitNumber: 4,
            axisName: {
                color: '#4A4A4A',
                fontSize: 12
            },
            splitLine: {
                lineStyle: {
                    color: '#E5E7EB'
                }
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['rgba(37, 99, 235, 0.05)', 'rgba(37, 99, 235, 0.1)']
                }
            }
        },
        series: [{
            name: 'Skills',
            type: 'radar',
            data: [{
                value: [95, 90, 88, 92, 85, 90],
                name: 'Current Level',
                areaStyle: {
                    color: 'rgba(37, 99, 235, 0.3)'
                },
                lineStyle: {
                    color: '#2563EB',
                    width: 2
                },
                itemStyle: {
                    color: '#2563EB'
                }
            }],
            animationDuration: 2000,
            animationEasing: 'cubicOut'
        }]
    };
    
    myChart.setOption(option);
    
    // Responsive chart
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

// Project filters
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.add('border-gray-300', 'text-gray-600');
                btn.classList.remove('border-blue-600', 'text-blue-600');
            });
            
            this.classList.add('active');
            this.classList.remove('border-gray-300', 'text-gray-600');
            this.classList.add('border-blue-600', 'text-blue-600');
            
            // Filter projects
            projectCards.forEach(card => {
                const categories = card.dataset.category.split(' ');
                const shouldShow = filter === 'all' || categories.includes(filter);
                
                if (shouldShow) {
                    anime({
                        targets: card,
                        opacity: [0, 1],
                        scale: [0.8, 1],
                        duration: 400,
                        easing: 'easeOutQuart'
                    });
                    card.style.display = 'block';
                } else {
                    anime({
                        targets: card,
                        opacity: [1, 0],
                        scale: [1, 0.8],
                        duration: 300,
                        easing: 'easeInQuart',
                        complete: function() {
                            card.style.display = 'none';
                        }
                    });
                }
            });
        });
    });
}

// Animated counters
function initCounters() {
    const counters = document.querySelectorAll('.stats-counter');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target);
                const isDecimal = counter.dataset.target.includes('.');
                
                anime({
                    targets: { count: 0 },
                    count: target,
                    duration: 2000,
                    easing: 'easeOutQuart',
                    update: function(anim) {
                        const value = isDecimal ? anim.animatables[0].target.count.toFixed(2) : Math.floor(anim.animatables[0].target.count);
                        counter.textContent = value.toLocaleString();
                    }
                });
                
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Contact form handling
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!validateForm(data)) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        // Simulate form submission
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            showNotification('Thank you! Your message has been sent successfully.', 'success');
            form.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 2000);
    });
}

// Form validation
function validateForm(data) {
    return data.name && data.email && data.message && data.subject;
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Mobile menu
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (!mobileMenuBtn) return;
    
    mobileMenuBtn.addEventListener('click', function() {
        // Toggle mobile menu (simplified for this demo)
        alert('Mobile menu functionality would be implemented here');
    });
}

// Smooth scroll for navigation links
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Project expansion functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('expand-btn')) {
        const projectId = e.target.dataset.project;
        showProjectDetails(projectId);
    }
});

// Show project details modal
function showProjectDetails(projectId) {
    const projectData = {
        'service-entry': {
            title: 'Service Entry Pipeline',
            description: 'A comprehensive automated pipeline that connects to Oracle databases, processes daily service entry records, and delivers formatted reports via email.',
            features: [
                'Oracle database connectivity with secure credential management',
                'Parameterized SQL query execution',
                'Automated CSV generation with date stamping',
                'Email distribution with attachment handling',
                'Comprehensive logging and error handling',
                'Modular OOP design for maintainability'
            ],
            techStack: ['Python', 'Oracle SQL', 'Pandas', 'SMTP', 'OOP'],
            impact: 'Reduced manual processing time by 80% and improved data accuracy'
        },
        'invoice-insight': {
            title: 'Invoice Insight Automation Engine',
            description: 'Enterprise-grade automation system for Queensland Health\'s invoice optimization, processing over 1.8 million invoices annually.',
            features: [
                'Nine custom Oracle SQL scripts for data extraction',
                'Batch processing with performance optimization',
                'OCR failure point analysis and reporting',
                'Automated scheduling and execution',
                'Integration with SAP and DSS systems',
                'Real-time performance monitoring'
            ],
            techStack: ['Python', 'Oracle SQL', 'SAP', 'DSS', 'Performance Analytics'],
            impact: 'Saved 2.5 hours daily processing time, processing $10.56B AUD annually'
        },
        'python-foundations': {
            title: 'Python Learning Foundation',
            description: 'Comprehensive learning repository documenting the journey from Python basics to advanced data engineering concepts.',
            features: [
                'Structured learning modules (5 stages)',
                'Practical exercises with real-world scenarios',
                'Data engineering focused examples',
                'Error handling and best practices',
                'Jupyter notebooks with detailed explanations',
                'Modular code organization'
            ],
            techStack: ['Python', 'Jupyter', 'Pandas', 'Data Structures', 'Algorithms'],
            impact: 'Built solid foundation for enterprise-level data engineering projects'
        }
    };
    
    const project = projectData[projectId];
    if (!project) return;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50';
    modal.innerHTML = `
        <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-2xl font-bold">${project.title}</h3>
                    <button class="close-modal text-gray-400 hover:text-gray-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                
                <p class="text-gray-600 mb-6">${project.description}</p>
                
                <div class="mb-6">
                    <h4 class="text-lg font-semibold mb-3">Key Features</h4>
                    <ul class="space-y-2">
                        ${project.features.map(feature => `<li class="flex items-start"><span class="text-blue-600 mr-2">•</span>${feature}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="mb-6">
                    <h4 class="text-lg font-semibold mb-3">Technology Stack</h4>
                    <div class="flex flex-wrap gap-2">
                        ${project.techStack.map(tech => `<span class="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded">${tech}</span>`).join('')}
                    </div>
                </div>
                
                <div class="mb-6">
                    <h4 class="text-lg font-semibold mb-3">Impact</h4>
                    <p class="text-gray-600">${project.impact}</p>
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
    
    // Animate modal in
    anime({
        targets: modal,
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuart'
    });
    
    anime({
        targets: modal.querySelector('.bg-white'),
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuart',
        delay: 100
    });
    
    // Close modal functionality
    const closeButtons = modal.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            anime({
                targets: modal,
                opacity: [1, 0],
                duration: 300,
                easing: 'easeInQuart',
                complete: function() {
                    document.body.removeChild(modal);
                }
            });
        });
    });
    
    // Close on backdrop click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeButtons[0].click();
        }
    });
}

// Add some interactive background effects
document.addEventListener('mousemove', function(e) {
    const cursor = document.querySelector('.cursor');
    if (!cursor) {
        const newCursor = document.createElement('div');
        newCursor.className = 'cursor fixed w-2 h-2 bg-blue-600 rounded-full pointer-events-none z-50 opacity-0';
        document.body.appendChild(newCursor);
    }
    
    const cursorElement = document.querySelector('.cursor');
    cursorElement.style.left = e.clientX + 'px';
    cursorElement.style.top = e.clientY + 'px';
    cursorElement.style.opacity = '0.7';
});

// Hide cursor when mouse leaves
 document.addEventListener('mouseleave', function() {
    const cursor = document.querySelector('.cursor');
    if (cursor) {
        cursor.style.opacity = '0';
    }
});