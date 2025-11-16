import { loadJSON } from '../utils/helpers.js';

export async function initExperience() {
    const payload = await loadJSON('assets/data/experience.json');
    if (!payload || !payload.experiences) return;

    renderExperience(payload.experiences);
}

function renderExperience(experiences) {
    const timeline = document.querySelector('[data-experience-list]');
    if (!timeline) return;

    timeline.innerHTML = '';

    experiences.forEach(exp => {
        const element = createExperienceElement(exp);
        timeline.appendChild(element);
    });
}

function createExperienceElement(exp) {
    const wrapper = document.createElement('div');
    wrapper.className = 'relative flex items-start';

    const color = getColor(exp.color);

    const techTags = (exp.technologies || [])
        .map(tech => {
            const techColor = getTechColor(tech);
            return `<span class="px-3 py-1 bg-${techColor}-100 text-${techColor}-600 text-sm rounded">${tech}</span>`;
        })
        .join('');

    wrapper.innerHTML = `
        <div class="flex-shrink-0 w-16 h-16 bg-${color}-600 rounded-full flex items-center justify-center text-white font-bold">
            ${exp.initials}
        </div>
        <div class="ml-8 bg-gray-50 rounded-xl p-6 flex-1">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-xl font-bold">${exp.title}</h3>
                    <p class="text-${color}-600 font-semibold">${exp.company}</p>
                </div>
                <span class="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">${exp.period}</span>
            </div>
            <p class="text-gray-600 mb-4">
                ${exp.description}
            </p>
            <div class="flex flex-wrap gap-2">
                ${techTags}
            </div>
        </div>
    `;

    return wrapper;
}

function getColor(color) {
    const colorMap = {
        blue: 'blue',
        emerald: 'emerald',
        purple: 'purple',
        amber: 'amber'
    };
    return colorMap[color] || 'blue';
}

function getTechColor(tech) {
    const techColors = {
        Python: 'blue',
        'Oracle SQL': 'green',
        SAP: 'yellow',
        'Data Pipeline': 'purple',
        'Data Structures': 'red',
        Algorithms: 'blue',
        'Software Engineering': 'green'
    };
    return techColors[tech] || 'blue';
}

