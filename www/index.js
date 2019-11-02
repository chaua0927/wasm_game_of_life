import { memory } from 'wasm-game-of-life/wasm_game_of_life_bg';
import { Universe, Cell } from 'wasm-game-of-life';
import { Fps } from './components/fps';
import { GameCanvas } from './components/game-canvas';
import { PlayPauseButton } from './components/play-pause-button';
import { Button } from './components/button';

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
let isToggledPlayPause = true;

const isPaused = () => {
    return animationId === null;
}

const play = () => {
    renderLoop();
    isToggledPlayPause = true;
}

const pause = () => {
    cancelAnimationFrame(animationId);
    animationId = null;
}

const handlePlayPause = () => {
    if (isPaused()) {
        play();
    } else {
        pause();
    }
    isToggledPlayPause = true;
}
}

const fps = new Fps(document.querySelector('#fps'));
const canvas = new GameCanvas(document.querySelector('#game-of-life-canvas'), universe.width(), universe.height(), 
                                handleToggleCell, isCellDead);
const playPauseButton = new PlayPauseButton(document.querySelector('#play-pause-button'), handlePlayPause, isPaused);

const renderLoop = () => {
    fps.render();

    universe.tick();

    canvas.drawGrid();
    canvas.drawCells();

    animationId = requestAnimationFrame(renderLoop);
}

play();
