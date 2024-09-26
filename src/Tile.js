import { drawRoundedRect, getTileColor } from './utils.js';

export default class Tile {
  constructor(x, y, value = 2) {
    this.x = x;

    this.y = y;

    this.value = value;
  }

  draw(ctx, tileSize, gap, offset) {
    const size = tileSize;

    const x = this.x * (tileSize + gap) + offset;

    const y = this.y * (tileSize + gap) + offset;

    ctx.fillStyle = getTileColor(this.value);

    drawRoundedRect(ctx, x, y, size, size, 10);

    ctx.fill();

    ctx.fillStyle = '#000';

    ctx.font = '32px Arial';

    ctx.textAlign = 'center';

    ctx.textBaseline = 'middle';

    ctx.fillText(this.value, x + size / 2, y + size / 2);
  }
}
