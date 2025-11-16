export function animateSkillItem(element) {
    if (typeof anime === 'undefined') return;

    anime({
        targets: element,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        easing: 'easeOutQuart',
        delay: anime.stagger(200)
    });
}

export function animateProjectCard(element) {
    if (typeof anime === 'undefined') return;

    anime({
        targets: element,
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 600,
        easing: 'easeOutQuart',
        delay: Math.random() * 300
    });
}

export function animateSkillBar(element) {
    if (typeof anime === 'undefined') return;

    const width = element.dataset.width;
    anime({
        targets: element,
        width: width + '%',
        duration: 1000,
        easing: 'easeOutQuart',
        delay: 200
    });
}

export function animateModalIn(modal, content) {
    if (typeof anime === 'undefined') return;

    anime({
        targets: modal,
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuart'
    });

    anime({
        targets: content,
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuart',
        delay: 100
    });
}

export function animateModalOut(modal, callback) {
    if (typeof anime === 'undefined') {
        if (callback) callback();
        return;
    }

    anime({
        targets: modal,
        opacity: [1, 0],
        duration: 300,
        easing: 'easeInQuart',
        complete: callback
    });
}

