export const CELL_SIZE = 8; // Units in px
export const CELL_BORDER_SIZE = 2; // Units in px
export const GRID_COLOR = '#CCCCCC';
export const DEAD_COLOR = '#FFFFFF';
export const ALIVE_COLOR = '#000000';

export class GameCanvas { 
    constructor(canvasElement, width, height, handleToggleCell, isCellDead) {
        this.canvas = canvasElement;
        this.width = width;
        this.height = height;
        this.handleToggleCell = handleToggleCell.bind(this);
        this.isCellDead = isCellDead.bind(this);
        this.canvas.width = (CELL_SIZE + CELL_BORDER_SIZE) * width + CELL_BORDER_SIZE;
        this.canvas.height = (CELL_SIZE + CELL_BORDER_SIZE) * height + CELL_BORDER_SIZE;
        this.context = this.canvas.getContext('2d');

        this.canvas.addEventListener('click', event => {
            // Translate page-relative coords -> canvas-relative coords -> row & col
            const boundingRect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / boundingRect.width;
            const scaleY = this.canvas.height / boundingRect.height;
            const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
            const canvasTop = (event.clientY - boundingRect.top) * scaleY;
        
            const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + CELL_BORDER_SIZE)), this.height - 1);
            const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + CELL_BORDER_SIZE)), this.width - 1);
        
            this.handleToggleCell(row, col);
        
            this.drawGrid();
            this.drawCells();
        });
    }
    
    getIndex(row, col) {
        return row * this.width + col;
    }

    drawGrid() {
        this.context.beginPath();
        this.context.strokeStyle = GRID_COLOR;
    
        // Vertical Lines
        for (let i = 0; i <= this.width; i++) {
            this.context.moveTo(i * (CELL_SIZE + CELL_BORDER_SIZE) + CELL_BORDER_SIZE, 0);
            this.context.lineTo(i * (CELL_SIZE + CELL_BORDER_SIZE) + CELL_BORDER_SIZE, (CELL_SIZE + CELL_BORDER_SIZE) * this.height + CELL_BORDER_SIZE);
        }
    
        // Horizontal Lines
        for (let j = 0; j <= this.height; j++) {
            this.context.moveTo(0,                                                         j * (CELL_SIZE + CELL_BORDER_SIZE) + CELL_BORDER_SIZE);
            this.context.lineTo((CELL_SIZE + CELL_BORDER_SIZE) * this.width + CELL_BORDER_SIZE, j * (CELL_SIZE + CELL_BORDER_SIZE) + CELL_BORDER_SIZE);
        }
    
        this.context.stroke();
    };
    
    drawCells() {    
        this.context.beginPath();
    
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                const index = this.getIndex(row, col);
    
                this.context.fillStyle = this.isCellDead(index) ? DEAD_COLOR : ALIVE_COLOR;
    
                this.context.fillRect(
                    col * (CELL_SIZE + CELL_BORDER_SIZE) + CELL_BORDER_SIZE,
                    row * (CELL_SIZE + CELL_BORDER_SIZE) + CELL_BORDER_SIZE,
                    CELL_SIZE,
                    CELL_SIZE
                );
            }
        }
        this.context.stroke();
    }

}