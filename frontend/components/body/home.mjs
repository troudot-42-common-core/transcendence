import { Game } from "../../static/js/game.js"

export const home =  async (render, div) => {
    const language = localStorage.getItem('language') || 'en';
    const url = `languages/${language}/home.json`;
    const response = await fetch(url);
    const data = await response.json();

    render (div, `
        <div class="container d-flex  
            align-items-center  
            justify-content-center  
            min-vh-100"> 
            <canvas id="pong"></canvas>
            <button type="button" class="btn btn-dark" id="startButton">Start</button>
        </div>
    `);

    let game = new Game('pong');
    const theme = document.querySelector("input[name=dark-mode]");
    const buttonStart = document.getElementById('startButton');
    game.render();
    theme.addEventListener('change', () => {
        if (game.ended) { game.render(); }
    });
    buttonStart.addEventListener('click', () => {
        if (game.ended) { game.loop(true); }
    });
};