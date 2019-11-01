export class PlayPauseButton {
    constructor(playPauseButtonElement, isPaused, handlePlay, handlePause) {
        this.playPauseButtonElement = playPauseButtonElement;
        this.isPaused = isPaused.bind(this);
        this.handlePlay = handlePlay.bind(this);
        this.handlePause = handlePause.bind(this);

        this.playPauseButtonElement.addEventListener('click', event => {
            if (this.isPaused()) {
                this.play();
            } else {
                this.pause();
            }
        })
    }

    play() {
        this.playPauseButtonElement.textContent = '⏸ Pause';
        this.handlePlay();
    }
    
    pause() {
        this.playPauseButtonElement.textContent = '▶ Play';
        this.handlePause();
    }
}