// Simple cyberpunk flicker effect for section titles and glitch header
const flicker = (el, color) => {
    el.style.textShadow = `0 0 8px ${color}, 0 0 18px #fff`;
    setTimeout(() => {
        el.style.textShadow = '';
    }, Math.random() * 500 + 80);
};

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.section-title').forEach(title => {
        setInterval(() => flicker(title, '#00fff7'), 1750 + Math.random()*1000);
    });
    const glitch = document.querySelector('.glitch');
    setInterval(() => flicker(glitch, '#ff00cc'), 1200 + Math.random()*800);
});
