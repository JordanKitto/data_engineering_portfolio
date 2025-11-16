export function initHero() {
    initTypewriter();
    initCounters();
}

function initTypewriter() {
    if (typeof Typed === 'undefined') return;

    new Typed('#typed-text', {
        strings: ['Data Engineer', 'Automation Expert', 'Python Developer', 'Systems Analyst'],
        typeSpeed: 80,
        backSpeed: 60,
        backDelay: 2000,
        startDelay: 500,
        loop: true,
        showCursor: true,
        cursorChar: '|'
    });
}

function initCounters() {
    const counters = document.querySelectorAll('.stats-counter');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const counter = entry.target;
                const targetValue = parseFloat(counter.dataset.target);
                const isDecimal = counter.dataset.target.includes('.');

                if (typeof anime !== 'undefined') {
                    anime({
                        targets: { count: 0 },
                        count: targetValue,
                        duration: 2000,
                        easing: 'easeOutQuart',
                        update: anim => {
                            const value = isDecimal
                                ? anim.animatables[0].target.count.toFixed(2)
                                : Math.floor(anim.animatables[0].target.count);
                            counter.textContent = Number(value).toLocaleString();
                        }
                    });
                } else {
                    counter.textContent = targetValue.toLocaleString();
                }

                observer.unobserve(counter);
            });
        },
        { threshold: 0.5 }
    );

    counters.forEach(counter => observer.observe(counter));
}

