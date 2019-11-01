import { memory } from 'wasm-game-of-life/wasm_game_of_life_bg';
import { Universe, Cell } from 'wasm-game-of-life';
import { Fps } from './components/fps';
import { GameCanvas } from './components/game-canvas';

const universe = Universe.new();
const cellsPtr = universe.cells();
const cells = new Uint8Array(memory.buffer, cellsPtr, universe.width() * universe.height());

const handleToggleCell = (row, col) => {
    universe.toggle_cell(row, col);
}

const isCellDead = (index) => {
    return cells[index] === Cell.Dead;
}

let animationId = null;

const isPaused = () => {
    return animationId === null;
}

const fps = new Fps(document.querySelector('#fps'));
const canvas = new GameCanvas(document.querySelector('#game-of-life-canvas'), universe.width(), universe.height(), 
                                handleToggleCell, isCellDead);
const playPauseButton = document.querySelector('#play-pause-button');

const play = () => {
    playPauseButton.textContent = '⏸ Pause';
    renderLoop();
}

const pause = () => {
    playPauseButton.textContent = '▶ Play';
    cancelAnimationFrame(animationId);
    animationId = null;
}

playPauseButton.addEventListener('click', event => {
    if (isPaused()) {
        play();
    } else {
        pause();
    }
})

const renderLoop = () => {
    fps.render();

    universe.tick();

    canvas.drawGrid();
    canvas.drawCells();
    animationId = requestAnimationFrame(renderLoop);
}

play();
