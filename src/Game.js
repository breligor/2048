import Tile from './Tile.js';
import {drawRoundedRect, updateScore} from './utils.js';

export default class Game {
    constructor(canvas, winScore = 2048) {
        this.ctx = canvas.getContext('2d');
        this.gridSize = 4;
        this.tileSize = 75;
        this.gap = 7;
        this.padding = 14;
        this.borderSize = 3;
        this.borderColor = '#9e9e9e';
        this.score = 0;
        this.scoreForWin = winScore;
        this.tiles = [];
        this.isMoving = false;
        this.tileSize -= this.gap;
        this.boardSize =
            this.gridSize * this.tileSize + (this.gridSize - 1) * this.gap;
        this.offset = this.padding + this.borderSize;

        canvas.width = this.boardSize + this.padding * 2 + this.borderSize * 2;
        canvas.height = this.boardSize + this.padding * 2 + this.borderSize * 2;

        this.addRandomTile();
        this.addRandomTile();

        window.addEventListener('keydown', (event) => this.handleKeyPress(event));
        canvas.addEventListener('touchstart', (event) =>
            this.handleTouchStart(event)
        );
        canvas.addEventListener('touchmove', (event) =>
            this.handleTouchMove(event)
        );
        canvas.addEventListener('touchend', (event) => this.handleTouchEnd(event));

        this.draw();
    }

    restartGame() {
        this.score = 0;
        this.tiles = [];
        this.isMoving = false;
        this.addRandomTile();
        this.addRandomTile();
        updateScore(0);
        this.draw();
    }

    canMakeMove() {
        if (this.tiles.length < this.gridSize * this.gridSize) {
            return true;
        }

        for (let tile of this.tiles) {
            const neighbors = [
                {x: tile.x + 1, y: tile.y},
                {x: tile.x - 1, y: tile.y},
                {x: tile.x, y: tile.y + 1},
                {x: tile.x, y: tile.y - 1},
            ];

            for (let neighbor of neighbors) {
                if (
                    this.tiles.some(
                        (t) =>
                            t.x === neighbor.x && t.y === neighbor.y && t.value === tile.value
                    )
                ) {
                    return true;
                }
            }
        }

        return false;
    }

    handleKeyPress(event) {
        switch (event.key) {
            case 'ArrowUp':
            case 'w':
                this.moveTiles('up');
                break;
            case 'ArrowDown':
            case 's':
                this.moveTiles('down');
                break;
            case 'ArrowLeft':
            case 'a':
                this.moveTiles('left');
                break;
            case 'ArrowRight':
            case 'd':
                this.moveTiles('right');
                break;
        }
    }


    handleTouchStart(event) {
        event.preventDefault();
        this.startX = event.touches[0].clientX;
        this.startY = event.touches[0].clientY;
        this.isMoving = false;
    }

    handleTouchMove(event) {
        if (this.isMoving) return;
        event.preventDefault();
        const moveX = event.touches[0].clientX - this.startX;
        const moveY = event.touches[0].clientY - this.startY;

        if (Math.abs(moveX) > Math.abs(moveY)) {
            if (moveX > 100) {
                this.moveTiles('right');
                this.isMoving = true;
            } else if (moveX < -100) {
                this.moveTiles('left');
                this.isMoving = true;
            }
        } else {
            if (moveY > 100) {
                this.moveTiles('down');
                this.isMoving = true;
            } else if (moveY < -100) {
                this.moveTiles('up');
                this.isMoving = true;
            }
        }
    }

    handleTouchEnd() {
        this.isMoving = false;
    }

    moveTiles(direction) {
        let isTilesWereMoved = false;

        if (this.isMoving) return;
        this.isMoving = true;

        switch (direction) {
            case 'left':
                for (let y = 0; y < this.gridSize; y++) {
                    let rowTiles = this.tiles.filter((tile) => tile.y === y);
                    rowTiles.sort((a, b) => a.x - b.x);

                    for (let i = 0; i < rowTiles.length; i++) {
                        const tile = rowTiles[i];

                        while (
                            tile.x > 0 &&
                            !rowTiles.some((t) => t.x === tile.x - 1 && t.y === tile.y)
                            ) {
                            tile.x--;
                            isTilesWereMoved = true;
                        }
                    }

                    for (let i = 0; i < rowTiles.length - 1; i++) {
                        const tile = rowTiles[i];
                        const nextTile = rowTiles[i + 1];

                        if (tile.value === nextTile.value) {
                            tile.value *= 2;

                            this.score += tile.value;
                            updateScore(this.score);
                            this.tiles = this.tiles.filter((t) => t !== nextTile);
                            this.draw();

                            if (tile.value === this.scoreForWin) {
                                setTimeout(() => {
                                    alert('you won');
                                    this.restartGame();
                                }, 500);

                                return;
                            }
                            isTilesWereMoved = true;
                            i++;
                        }
                    }

                    rowTiles = this.tiles.filter((tile) => tile.y === y);
                    for (let i = 0; i < rowTiles.length; i++) {
                        const tile = rowTiles[i];

                        while (
                            tile.x > 0 &&
                            !rowTiles.some((t) => t.x === tile.x - 1 && t.y === tile.y)
                            ) {
                            tile.x--;
                            isTilesWereMoved = true;
                        }
                    }
                }
                break;

            case 'right':
                for (let y = 0; y < this.gridSize; y++) {
                    let rowTiles = this.tiles.filter((tile) => tile.y === y);
                    rowTiles.sort((a, b) => b.x - a.x);

                    for (let i = 0; i < rowTiles.length; i++) {
                        const tile = rowTiles[i];

                        while (
                            tile.x < this.gridSize - 1 &&
                            !rowTiles.some((t) => t.x === tile.x + 1 && t.y === tile.y)
                            ) {
                            tile.x++;
                            isTilesWereMoved = true;
                        }
                    }

                    for (let i = 0; i < rowTiles.length - 1; i++) {
                        const tile = rowTiles[i];
                        const nextTile = rowTiles[i + 1];

                        if (tile.value === nextTile.value) {
                            tile.value *= 2;
                            this.score = this.score + tile.value;
                            updateScore(this.score);
                            this.tiles = this.tiles.filter((t) => t !== nextTile);
                            this.draw();

                            if (tile.value === this.scoreForWin) {
                                setTimeout(() => {
                                    alert('you won');
                                    this.restartGame();
                                }, 500);

                                return;
                            }
                            isTilesWereMoved = true;
                            i++;
                        }
                    }

                    rowTiles = this.tiles.filter((tile) => tile.y === y);
                    for (let i = 0; i < rowTiles.length; i++) {
                        const tile = rowTiles[i];

                        while (
                            tile.x < this.gridSize - 1 &&
                            !rowTiles.some((t) => t.x === tile.x + 1 && t.y === tile.y)
                            ) {
                            tile.x++;
                            isTilesWereMoved = true;
                        }
                    }
                }
                break;

            case 'down':
                for (let x = 0; x < this.gridSize; x++) {
                    let columnTiles = this.tiles.filter((tile) => tile.x === x);
                    columnTiles.sort((a, b) => b.y - a.y);

                    for (let i = 0; i < columnTiles.length; i++) {
                        const tile = columnTiles[i];

                        while (
                            tile.y < this.gridSize - 1 &&
                            !columnTiles.some((t) => t.y === tile.y + 1 && t.x === tile.x)
                            ) {
                            tile.y++;
                            isTilesWereMoved = true;
                        }
                    }

                    for (let i = 0; i < columnTiles.length - 1; i++) {
                        const tile = columnTiles[i];
                        const nextTile = columnTiles[i + 1];

                        if (tile.value === nextTile.value) {
                            tile.value *= 2;
                            this.score = this.score + tile.value;
                            updateScore(this.score);
                            this.tiles = this.tiles.filter((t) => t !== nextTile);
                            this.draw();

                            if (tile.value === this.scoreForWin) {
                                setTimeout(() => {
                                    alert('you won');
                                    this.restartGame();
                                }, 500);

                                return;
                            }
                            isTilesWereMoved = true;
                            i++;
                        }
                    }

                    columnTiles = this.tiles.filter((tile) => tile.x === x);
                    for (let i = 0; i < columnTiles.length; i++) {
                        const tile = columnTiles[i];

                        while (
                            tile.y < this.gridSize - 1 &&
                            !columnTiles.some((t) => t.y === tile.y + 1 && t.x === tile.x)
                            ) {
                            tile.y++;
                            isTilesWereMoved = true;
                        }
                    }
                }
                break;

            case 'up':
                for (let x = 0; x < this.gridSize; x++) {
                    let columnTiles = this.tiles.filter((tile) => tile.x === x);
                    columnTiles.sort((a, b) => a.y - b.y);

                    for (let i = 0; i < columnTiles.length; i++) {
                        const tile = columnTiles[i];

                        while (
                            tile.y > 0 &&
                            !columnTiles.some((t) => t.y === tile.y - 1 && t.x === tile.x)
                            ) {
                            tile.y--;
                            isTilesWereMoved = true;
                        }
                    }

                    for (let i = 0; i < columnTiles.length - 1; i++) {
                        const tile = columnTiles[i];
                        const nextTile = columnTiles[i + 1];

                        if (tile.value === nextTile.value) {
                            tile.value *= 2;
                            this.score = this.score + tile.value;
                            updateScore(this.score);
                            this.tiles = this.tiles.filter((t) => t !== nextTile);
                            this.draw();

                            if (tile.value === this.scoreForWin) {
                                setTimeout(() => {
                                    alert('you won');
                                    this.restartGame();
                                }, 500);

                                return;
                            }
                            isTilesWereMoved = true;
                            i++;
                        }
                    }

                    columnTiles = this.tiles.filter((tile) => tile.x === x);
                    for (let i = 0; i < columnTiles.length; i++) {
                        const tile = columnTiles[i];

                        while (
                            tile.y > 0 &&
                            !columnTiles.some((t) => t.y === tile.y - 1 && t.x === tile.x)
                            ) {
                            tile.y--;
                            isTilesWereMoved = true;
                        }
                    }
                }
                break;
        }

        if (isTilesWereMoved) {
            this.addRandomTile();

            if (!this.canMakeMove()) {
                alert('Нельзя сделать ход, игра окончена');
                this.restartGame();
                this.isMoving = false;

                return;
            }
            this.draw();
        }
        this.isMoving = false;
    }

    addRandomTile() {
        let emptyTiles = [];
        for (let x = 0; x < this.gridSize; x++) {
            for (let y = 0; y < this.gridSize; y++) {
                if (!this.tiles.some((tile) => tile.x === x && tile.y === y)) {
                    emptyTiles.push({x, y});
                }
            }
        }

        if (emptyTiles.length > 0) {
            const {x, y} =
                emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

            let tilesValue;
            const isFirstMove = this.tiles.length < 2;

            if (isFirstMove) {
                tilesValue = 2;
            } else {
                tilesValue = Math.random() < 0.9 ? 2 : 4;
            }
            this.tiles.push(new Tile(x, y, tilesValue));
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = this.borderColor;
        drawRoundedRect(
            this.ctx,
            0,
            0,
            this.boardSize + this.padding * 2 + this.borderSize * 2,
            this.boardSize + this.padding * 2 + this.borderSize * 2,
            15
        );
        this.ctx.fill();
        this.ctx.fillStyle = '#bbada0';

        drawRoundedRect(
            this.ctx,
            this.borderSize,
            this.borderSize,
            this.boardSize + this.padding * 2,
            this.boardSize + this.padding * 2,
            15
        );
        this.ctx.fill();

        for (const tile of this.tiles) {
            tile.draw(this.ctx, this.tileSize, this.gap, this.offset);
        }
    }
}
