// Glitch/flicker effect for section titles and glitch header
const flicker = (el, color) => {
    el.style.textShadow = `0 0 8px ${color}, 0 0 18px #fff`;
    setTimeout(() => {
        el.style.textShadow = '';
    }, Math.random() * 500 + 80);
};

document.addEventListener('DOMContentLoaded', () => {
    // Flicker effects
    document.querySelectorAll('.section-title').forEach(title => {
        setInterval(() => flicker(title, '#00fff7'), 1750 + Math.random()*1000);
    });
    const glitch = document.querySelector('.glitch');
    if (glitch) setInterval(() => flicker(glitch, '#ff00cc'), 1200 + Math.random()*800);

    // Game-like navigation
    const screens = document.querySelectorAll('.screen');
    const showScreen = id => {
        screens.forEach(s => s.classList.remove('active'));
        const el = document.getElementById(id);
        if (el) el.classList.add('active');
    };

    // Start: Show only start screen
    showScreen('start-screen');

    // Play button
    document.getElementById('play-btn').onclick = () => {
        showScreen('main-menu');
    };

    // Menu buttons
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.onclick = () => {
            const section = btn.getAttribute('data-section');
            showScreen(`section-${section}`);
        };
    });

    // Back buttons
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.onclick = () => showScreen('main-menu');
    });

    // Optional: Allow ESC to go back to menu from a section
    document.addEventListener('keydown', (e) => {
        const isSection = Array.from(screens).some(s => s.classList.contains('active') && s.classList.contains('section-screen'));
        if (isSection && e.key === "Escape") showScreen('main-menu');
    });
});
