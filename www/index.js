import { memory } from "wasm-game-of-life/wasm_game_of_life_bg";
import { Universe, Cell } from "wasm-game-of-life";

const CELL_SIZE = 8; // Units in px
const CELL_BORDER_SIZE = 2; // Units in px
const GRID_COLOR = '#CCCCCC';
const DEAD_COLOR = '#FFFFFF';
const ALIVE_COLOR = '#000000';

const universe = Universe.new();
const width = universe.width();
const height = universe.height();

const canvas = document.querySelector('#game-of-life-canvas');
canvas.width = (CELL_SIZE + CELL_BORDER_SIZE) * height + CELL_BORDER_SIZE;
canvas.height = (CELL_SIZE + CELL_BORDER_SIZE) * width + CELL_BORDER_SIZE;

const context = canvas.getContext('2d');

canvas.addEventListener('click', event => {
    const boundingRect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / boundingRect.width;
    const scaleY = canvas.height / boundingRect.height;
    const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
    const canvasTop = (event.clientY - boundingRect.top) * scaleY;

    const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + CELL_BORDER_SIZE)), height - 1);
    const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + CELL_BORDER_SIZE)), width - 1);

    universe.toggle_cell(row, col);

    drawGrid();
    drawCells();
});

let animationId = null;

const isPaused = () => {
    return animationId === null;
}

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

const drawGrid = () => {
    context.beginPath();
    context.strokeStyle = GRID_COLOR;

    // Vertical Lines
    for (let i = 0; i <= width; i++) {
        context.moveTo(i * (CELL_SIZE + CELL_BORDER_SIZE) + CELL_BORDER_SIZE, 0);
        context.lineTo(i * (CELL_SIZE + CELL_BORDER_SIZE) + CELL_BORDER_SIZE, (CELL_SIZE + CELL_BORDER_SIZE) * height + CELL_BORDER_SIZE);
    }

    // Horizontal Lines
    for (let j = 0; j <= height; j++) {
        context.moveTo(0,                                                         j * (CELL_SIZE + CELL_BORDER_SIZE) + CELL_BORDER_SIZE);
        context.lineTo((CELL_SIZE + CELL_BORDER_SIZE) * width + CELL_BORDER_SIZE, j * (CELL_SIZE + CELL_BORDER_SIZE) + CELL_BORDER_SIZE);
    }

    context.stroke();
};

const getIndex = (row, col) => {
    return row * width + col;
}

const drawCells = () => {
    const cellsPtr = universe.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

    context.beginPath();

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const index = getIndex(row, col);

            context.fillStyle = cells[index] === Cell.Dead ? DEAD_COLOR : ALIVE_COLOR;

            context.fillRect(
                col * (CELL_SIZE + CELL_BORDER_SIZE) + CELL_BORDER_SIZE,
                row * (CELL_SIZE + CELL_BORDER_SIZE) + CELL_BORDER_SIZE,
                CELL_SIZE,
                CELL_SIZE
            );
        }
    }

    context.stroke();
}

const fps = new class {
    constructor() {
        this.fpsElement = document.querySelector('#fps');
        this.frames = [];
        this.lastTimestamp = performance.now();
    }

    calcFPS() {
        const now = performance.now();
        const delta = now - this.lastTimestamp;
        this.lastTimestamp = now;
        return 1 / delta * 1000
    }

    render() {
        const fps = this.calcFPS();
        this.frames.push(fps);
        if (this.frames.length > 100) {
            this.frames.shift;
        }

        // Calculate stats: min, max, mean
        let min = Infinity;
        let max = -Infinity;
        let sum = 0;
        for (let i = 0; i < this.frames.length; i++) {
            sum += this.frames[i];
            min = Math.min(this.frames[i], min);
            max = Math.max(this.frames[i], max);
        }
        let mean = sum / this.frames.length;

        // Display stats
        this.fpsElement.textContent = `
        Frames per second:
                latest = ${Math.round(fps)}
        avg (last 100) = ${Math.round(mean)} 
        max (last 100) = ${Math.round(max)}
        min (last 100) = ${Math.round(min)}
        `;
    }
}

const renderLoop = () => {
    fps.render();

    universe.tick();

    drawGrid();
    drawCells();
    animationId = requestAnimationFrame(renderLoop);
}

play();
