@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Share+Tech+Mono&display=swap');

:root {
    --neon-pink: #ff00cc;
    --neon-blue: #00fff7;
    --neon-purple: #8f00ff;
    --neon-green: #00ff90;
    --bg-dark: #18191a;
    --card-bg: rgba(30, 32, 43, 0.92);
    --menu-bg: rgba(22, 14, 34, 0.96);
    --text-main: #d0d0e1;
    --shadow: 0 0 8px var(--neon-pink), 0 0 16px var(--neon-blue);
}

body {
    background: linear-gradient(135deg, #18191a 60%, #2e0066 100%);
    color: var(--text-main);
    font-family: 'Share Tech Mono', 'Consolas', 'monospace';
    margin: 0;
    padding: 0;
    min-height: 100vh;
    overflow-x: hidden;
}

.neon-border {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    z-index: 0;
    pointer-events: none;
    border: 4px solid var(--neon-pink);
    box-shadow: 0 0 30px var(--neon-blue), 0 0 60px var(--neon-pink);
    border-radius: 14px;
    margin: 8px;
}

.screen {
    display: none;
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    width: 100vw; height: 100vh;
    background: none;
    z-index: 10;
    align-items: center;
    justify-content: center;
    transition: opacity 0.5s;
}
.screen.active {
    display: flex;
    opacity: 1;
    animation: fadein 1s;
}
@keyframes fadein { from { opacity: 0; } to { opacity: 1; } }

.centered {
    width: 100%;
    max-width: 480px;
    margin: auto;
    text-align: center;
    padding: 40px 20px;
    background: var(--menu-bg);
    box-shadow: 0 0 30px var(--neon-purple);
    border-radius: 18px;
    border: 2px solid var(--neon-blue);
}

.menu-panel {
    padding: 48px 24px;
}

.menu-title {
    font-family: 'Orbitron', 'Share Tech Mono', monospace;
    color: var(--neon-pink);
    font-size: 2.3rem;
    text-shadow: 0 0 12px var(--neon-blue);
    margin-bottom: 34px;
    animation: flicker 2.5s infinite alternate;
}

.game-btn {
    display: block;
    width: 90%;
    margin: 16px auto;
    padding: 16px;
    background: linear-gradient(90deg, var(--neon-pink), var(--neon-purple), var(--neon-blue));
    color: #fff;
    font-family: 'Orbitron', 'Share Tech Mono', monospace;
    font-size: 1.3rem;
    font-weight: bold;
    border: none;
    border-radius: 12px;
    box-shadow: 0 0 12px var(--neon-blue), 0 0 26px var(--neon-pink);
    cursor: pointer;
    letter-spacing: 1.2px;
    transition: transform 0.15s, box-shadow 0.2s;
    text-shadow: 0 0 6px var(--neon-blue);
}
.game-btn:hover,
.game-btn:focus {
    transform: scale(1.05);
    box-shadow: 0 0 24px var(--neon-pink), 0 0 8px var(--neon-blue);
    outline: none;
}

.play-btn {
    animation: flicker 2s infinite alternate;
}

@keyframes flicker {
    0% { box-shadow: 0 0 8px var(--neon-blue), 0 0 16px var(--neon-pink);}
    50% { box-shadow: 0 0 22px var(--neon-blue), 0 0 36px var(--neon-pink);}
    100% { box-shadow: 0 0 8px var(--neon-blue), 0 0 16px var(--neon-pink);}
}

.section-screen {
    background: rgba(30, 10, 60, 0.98);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow-y: auto;
    padding-top: 60px;
    padding-bottom: 60px;
    z-index: 20;
}

.section-card {
    background: var(--card-bg);
    border-radius: 16px;
    border: 2px solid var(--neon-purple);
    box-shadow: 0 0 30px var(--neon-blue);
    max-width: 700px;
    margin: 0 auto;
    padding: 32px 20px 18px 20px;
    position: relative;
    text-align: left;
    min-width: 320px;
}

.back-btn {
    position: absolute;
    left: 18px;
    top: 18px;
    width: 90px;
    font-size: 1rem;
    background: linear-gradient(90deg, var(--neon-purple), var(--neon-blue));
    box-shadow: 0 0 16px var(--neon-blue);
    padding: 7px 0;
    z-index: 10;
}

h1, .glitch {
    font-family: 'Orbitron', 'Share Tech Mono', monospace;
    font-size: 2.8rem;
    color: var(--neon-pink);
    text-shadow: 0 0 6px var(--neon-blue), 0 0 18px var(--neon-pink);
    position: relative;
    letter-spacing: 2px;
}

.glitch {
    animation: glitch 1.2s infinite;
}
@keyframes glitch {
    0% { text-shadow: 2px 0 var(--neon-blue), -2px 0 var(--neon-pink);}
    20% { text-shadow: -2px 0 var(--neon-pink), 2px 0 var(--neon-blue);}
    40% { text-shadow: 2px 2px var(--neon-blue), -2px -2px var(--neon-pink);}
    60% { text-shadow: -2px 2px var(--neon-pink), 2px -2px var(--neon-blue);}
    80% { text-shadow: 2px 0 var(--neon-blue), -2px 0 var(--neon-pink);}
    100% { text-shadow: 0 0 6px var(--neon-blue), 0 0 18px var(--neon-pink);}
}

.section-title {
    color: var(--neon-blue);
    text-shadow: 0 0 12px var(--neon-blue);
    border-left: 4px solid var(--neon-pink);
    padding-left: 12px;
    margin-top: 8px;
}

.card {
    background: var(--card-bg);
    border: 1.5px solid var(--neon-purple);
    border-radius: 10px;
    box-shadow: 0 0 16px var(--neon-blue);
    margin: 18px 0;
    padding: 18px 28px 14px 28px;
    font-size: 1.06rem;
    transition: box-shadow 0.3s;
}
.card:hover {
    box-shadow: 0 0 32px var(--neon-pink), 0 0 12px var(--neon-blue);
}

.skill-card {
    color: var(--neon-green);
    text-shadow: 0 0 6px var(--neon-green);
}

ul {
    list-style: none;
    padding-left: 0;
    margin: 0;
}
.card ul li {
    margin-bottom: 6px;
    padding-left: 16px;
    position: relative;
}
.card ul li:before {
    content: '▸';
    color: var(--neon-pink);
    position: absolute;
    left: 0;
}

.date {
    color: var(--neon-blue);
    text-shadow: 0 0 6px var(--neon-blue);
    font-size: 0.95rem;
    float: right;
}

.glow {
    color: var(--neon-pink);
    text-shadow: 0 0 5px var(--neon-pink), 0 0 10px var(--neon-blue);
}
.footer-glow {
    color: var(--neon-purple);
    text-align: center;
    font-size: 1.03rem;
    margin-top: 32px;
    text-shadow: 0 0 8px var(--neon-purple);
}
.cyber-heart {
    color: var(--neon-pink);
    text-shadow: 0 0 12px var(--neon-pink);
}

@media (max-width: 700px) {
    .centered, .section-card {
        padding: 10px;
        width: 96vw;
        font-size: 0.97rem;
    }
    .neon-border { margin: 2px; }
}
