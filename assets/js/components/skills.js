import { loadJSON } from '../utils/helpers.js';
import { animateSkillItem, animateSkillBar } from '../utils/animations.js';

let skillsPayload = null;

export async function initSkills() {
    skillsPayload = await loadJSON('assets/data/skills.json');
    if (!skillsPayload) return;

    renderSkills(skillsPayload.skills);
    initSkillsChart(skillsPayload.chartData);
    initScrollAnimations();
}

function renderSkills(skills = []) {
    const skillsContainer = document.querySelector('[data-skills-list]');
    if (!skillsContainer) return;

    skillsContainer.innerHTML = '';

    skills.forEach(skill => {
        const element = createSkillElement(skill);
        skillsContainer.appendChild(element);
    });
}

function createSkillElement(skill) {
    const div = document.createElement('div');
    div.className = 'skill-item';

    const color = getColor(skill.color);

    div.innerHTML = `
        <div class="flex justify-between items-center mb-2">
            <span class="font-semibold text-lg">${skill.name}</span>
            <span class="text-${color}-600 font-mono">${skill.percentage}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3">
            <div class="bg-${color}-600 h-3 rounded-full skill-bar" data-width="${skill.percentage}"></div>
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
        red: 'red'
    };
    return colorMap[color] || 'blue';
}

function initSkillsChart(chartData) {
    const chartDom = document.getElementById('skills-chart');
    if (!chartDom || typeof echarts === 'undefined' || !chartData) return;

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
        tooltip: { trigger: 'item' },
        radar: {
            indicator: chartData.indicators,
            shape: 'polygon',
            splitNumber: 4,
            axisName: {
                color: '#4A4A4A',
                fontSize: 12
            },
            splitLine: {
                lineStyle: { color: '#E5E7EB' }
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['rgba(37, 99, 235, 0.05)', 'rgba(37, 99, 235, 0.1)']
                }
            }
        },
        series: [
            {
                name: 'Skills',
                type: 'radar',
                data: [
                    {
                        value: chartData.values,
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
                    }
                ],
                animationDuration: 2000,
                animationEasing: 'cubicOut'
            }
        ]
    };

    myChart.setOption(option);
    window.addEventListener('resize', () => myChart.resize());
}

function initScrollAnimations() {
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const element = entry.target;
                if (element.classList.contains('skill-item')) {
                    animateSkillItem(element);
                } else if (element.classList.contains('skill-bar')) {
                    animateSkillBar(element);
                }

                observer.unobserve(element);
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }
    );

    document.querySelectorAll('.skill-item, .skill-bar').forEach(el => observer.observe(el));
}

