export class Fps {
    constructor(fpsElement) {
        this.fpsElement = fpsElement;
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