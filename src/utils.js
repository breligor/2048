export function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

export function getTileColor(value) {
    const tileColors = {
        2: '#eee4d9',
        4: '#ede0c7',
        8: '#f9b376',
        16: '#ff9b60',
        32: '#ca6a49',
        64: '#ec6233',
        128: '#e8c562',
        256: '#dfba55',
        512: '#f3c54b',
        1024: '#f2c138',
        2048: '#f2bd28',
        4096: '#aff228',
        8192: '#709c15',
        16384: '#4d6a18',
        32768: '#8a2ea4',
    };

    return tileColors[value] || '#cfc0af';
}

export function updateScore(score) {
    const scoreField = document.querySelector('#score');

    scoreField.innerHTML = `Счет: ${score}`;
}

export function getScoreText(score) {
    if (score === 32 || score === 64) {
        return `очка`;
    }

    return `очков`;
}