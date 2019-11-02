import { Button } from './button';

export class PlayPauseButton extends Button {
    constructor(playPauseButtonElement, handlePlayPause, isPaused) {
        super(playPauseButtonElement, handlePlayPause);
        this.el.addEventListener('click', event => {
            this.el.textContent = (isPaused()) ?  '▶ Play' : '⏸ Pause';
        });
    }
}