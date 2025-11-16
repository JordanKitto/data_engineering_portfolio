import { initNavigation } from './components/navigation.js';
import { initHero } from './components/hero.js';
import { initSkills } from './components/skills.js';
import { initProjects } from './components/projects.js';
import { initExperience } from './components/experience.js';
import { initContact } from './components/contact.js';

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initHero();
    initSkills();
    initProjects();
    initExperience();
    initContact();
    initCursorEffects();
});

function initCursorEffects() {
    document.addEventListener('mousemove', e => {
        const cursor = getOrCreateCursor();
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        cursor.style.opacity = '0.7';
    });

    document.addEventListener('mouseleave', () => {
        const cursor = document.querySelector('.cursor');
        if (cursor) {
            cursor.style.opacity = '0';
        }
    });
}

function getOrCreateCursor() {
    let cursor = document.querySelector('.cursor');
    if (!cursor) {
        cursor = document.createElement('div');
        cursor.className = 'cursor fixed w-2 h-2 bg-blue-600 rounded-full pointer-events-none z-50 opacity-0';
        document.body.appendChild(cursor);
    }
    return cursor;
}

