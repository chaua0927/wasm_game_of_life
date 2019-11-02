export class RelativeRateInfo {
    constructor(relativeRateInfoElement) {
        this.relativeRateInfoElement = relativeRateInfoElement;
    }

    render(isPaused, isMaxSpeed = false, relativeRate = 0) {
        if (isPaused) {
            this.relativeRateInfoElement.textContent = "Game is Paused";
        } else {
            this.relativeRateInfoElement.textContent = `Current render rate: ${isMaxSpeed ? 'MAX' : `${relativeRate.toFixed(1)}x`}`;
        }
    }
}