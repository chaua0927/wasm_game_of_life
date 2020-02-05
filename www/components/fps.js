export class Fps {
    constructor(fpsElement) {
        this.fpsElement = fpsElement;
        this.frames = [];
        this.lastTimestamp = performance.now();
        this.fps = 0;
        this.mean = 0;
        this.min = Infinity;
        this.max = -Infinity;
    }

    //@return Time since previous frame/timestamp (in seconds)
    calcFPS() {
        const now = performance.now();
        const delta = now - this.lastTimestamp;
        this.lastTimestamp = now;
        return 1 / delta * 1000
    }

    updateStats() {
        // Update fps
        this.fps = this.calcFPS();
        this.frames.push(this.fps);
        if (this.frames.length > 100) {
            this.frames.shift;
        }

        // Calculate and update stats: min, max, mean
        let sum = 0;
        for (let i = 0; i < this.frames.length; i++) {
            sum += this.frames[i];
            this.min = Math.min(this.frames[i], this.min);
            this.max = Math.max(this.frames[i], this.max);
        }
        this.mean = sum / this.frames.length;
    }
    
    render() {
        // Display stats
        this.fpsElement.textContent = `
        Frames per second:
                latest = ${Math.round(this.fps)}
        avg (last 100) = ${Math.round(this.mean)} 
        max (last 100) = ${Math.round(this.max)}
        min (last 100) = ${Math.round(this.min)}
        `;
    }
}