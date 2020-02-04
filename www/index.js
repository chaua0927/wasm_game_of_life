import { memory } from 'wasm-game-of-life/wasm_game_of_life_bg';
import { Universe, Cell } from 'wasm-game-of-life';
import { Fps } from './components/fps';
import { GameCanvas } from './components/game-canvas';
import { PlayPauseButton } from './components/play-pause-button';
import { Button } from './components/button';
import { RelativeRateInfo } from './components/relative-rate-info';

const DEFAULT_UPDATE_INTERVAL = 1000; // in milliseconds
const UPDATE_INTERVAL_MODIFIER_INCREMENT = 200; // in milliseconds

const universe = Universe.new();

const handleToggleCell = (row, col) => {
    universe.toggle_cell(row, col);
}

const isCellDead = (index) => {
    //FIXME?: Update pointer - seems to change with every other tick, due to Rust+wasm binding impl?
    const cellsPtr = universe.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, universe.width() * universe.height());
    return cells[index] === Cell.Dead;
}

let animationId = null;
let updateId = null;
let updateInterval = DEFAULT_UPDATE_INTERVAL;
let isChangedUpdateInterval = false;
let isMaxSpeed = false;
let isToggledMaxSpeed = false;
let isToggledPlayPause = true;

const calcRelativeUpdateRate = () => {
    return DEFAULT_UPDATE_INTERVAL / updateInterval;
}

const isPaused = () => {
    return animationId === null;
}

const updateUniverse = () => {
    if (!isPaused()) {
        universe.tick();
        fps.updateStats();
        updateId = setTimeout(updateUniverse, updateInterval);
    }
}

const play = () => {
    renderLoop();
    if (!isMaxSpeed) {
        updateId = setTimeout(updateUniverse, updateInterval);
    }
    isToggledPlayPause = true;
}

const pause = () => {
    cancelAnimationFrame(animationId);
    animationId = null;
    clearTimeout(updateId);
    relativeRateInfo.render(isPaused(), isMaxSpeed, calcRelativeUpdateRate());
}

const handlePlayPause = () => {
    if (isPaused()) {
        play();
    } else {
        pause();
    }
    isToggledPlayPause = true;
}

const incUpdateButton = document.querySelector('#inc-update-button');
const decUpdateButton = document.querySelector('#dec-update-button');

const handleIncreaseUpdateInterval = () => {
    if (!isMaxSpeed && !isPaused()) {
        if (updateInterval === UPDATE_INTERVAL_MODIFIER_INCREMENT) {
            if (decUpdateButton.disabled) {
                decUpdateButton.disabled = false;
            }
        }
        updateInterval += UPDATE_INTERVAL_MODIFIER_INCREMENT;
        isChangedUpdateInterval = true;
    }
}

const handleDecreaseUpdateInterval = () => {
    if (!isMaxSpeed && !isPaused()) {
        if (updateInterval > UPDATE_INTERVAL_MODIFIER_INCREMENT) {
            updateInterval -= UPDATE_INTERVAL_MODIFIER_INCREMENT;
            isChangedUpdateInterval = true;

            if (updateInterval === UPDATE_INTERVAL_MODIFIER_INCREMENT) {
                decUpdateButton.disabled = true;
            } 
        }
    }
}

const maxSpdButton = document.querySelector('#max-speed-button');

const handleMaxSpeedClick = () => {
    if (!isPaused()) {
        isToggledMaxSpeed = true;
        isMaxSpeed = !isMaxSpeed;
        if (!isMaxSpeed) {
            pause();
            play();
        }
    }
}

const fps = new Fps(document.querySelector('#fps'));
const canvas = new GameCanvas(document.querySelector('#game-of-life-canvas'), universe.width(), universe.height(), 
                                handleToggleCell, isCellDead);
const playPauseButton = new PlayPauseButton(document.querySelector('#play-pause-button'), handlePlayPause, isPaused);
const incUpdateIntervalButton = new Button(incUpdateButton, handleIncreaseUpdateInterval);
const decUpdateIntervalButton = new Button(decUpdateButton, handleDecreaseUpdateInterval);
const relativeRateInfo = new RelativeRateInfo(document.querySelector('#relative-rate-info'));
const maxSpeedButton = new Button(maxSpdButton, handleMaxSpeedClick);

const renderLoop = () => {
    fps.render();
    if (isChangedUpdateInterval || isToggledPlayPause || isToggledMaxSpeed) {
        relativeRateInfo.render(isPaused(), isMaxSpeed, calcRelativeUpdateRate());
        isChangedUpdateInterval = false;
        isToggledPlayPause = false;
        isToggledMaxSpeed = false;
    }

    if (isMaxSpeed) {
        clearTimeout(updateId);
        universe.tick();
        fps.updateStats();
    }

    canvas.drawGrid();
    canvas.drawCells();

    animationId = requestAnimationFrame(renderLoop);
}

play();
