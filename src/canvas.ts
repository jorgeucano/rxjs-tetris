import { Scene, Point2D } from './types';

export const COLS = 30;
export const ROWS = 70;
export const GAP_SIZE = 1;
export const CELL_SIZE = 10;
export const CANVAS_WIDTH = COLS * (CELL_SIZE + GAP_SIZE);
export const CANVAS_HEIGHT = ROWS * (CELL_SIZE + GAP_SIZE);

export function createCanvasElement() {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    return canvas;
}

export function renderScene(ctx: CanvasRenderingContext2D, scene: Scene) {
    renderBackground(ctx);
    renderScore(ctx, scene.score);
    renderBlock(ctx, scene.apples);
    renderBlockMove(ctx, scene.snake);
}

export function renderScore(ctx: CanvasRenderingContext2D, score: number) {
    let textX = CANVAS_WIDTH / 2;
    let textY = CANVAS_HEIGHT / 2;

    drawText(ctx, score.toString(), textX, textY, 'rgba(0, 0, 0, 0.1)', 150);
}

export function renderBlock(ctx: CanvasRenderingContext2D, blocks: any[]) {
    blocks.forEach(block => paintCell(ctx, block, 'red'));
}

export function renderBlockMove(ctx: CanvasRenderingContext2D, blocksMove: Array<Point2D>) {
    blocksMove.forEach((segment, index) => paintCell(ctx, wrapBounds(segment), getSegmentColor(index)));
}

export function renderGameOver(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    let textX = CANVAS_WIDTH / 2;
    let textY = CANVAS_HEIGHT / 2;

    drawText(ctx, 'GAME OVER!', textX, textY, 'black', 25);
}

export function getRandomBlock(blockMove: Array<Point2D> = []): Point2D {
    let position = {
        x: getRandomNumber(0, COLS - 1),
        y: getRandomNumber(0, ROWS - 1)
    };

    if (isEmptyCell(position, blockMove)) {
        return position;
    }

    return getRandomBlock(blockMove);
}

export function checkCollision(a, b) {
    return a.x === b.x && a.y === b.y;
}

function isEmptyCell(position: Point2D, snake: Array<Point2D>): boolean {
    return !snake.some(segment => checkCollision(segment, position));
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function renderBackground(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#EEE';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, fillStyle: string,
                  fontSize: number, horizontalAlign: string = 'center', verticalAlign: string = 'middle') {

    ctx.fillStyle = fillStyle;
    ctx.font = `bold ${fontSize}px sans-serif`;

    let textX = x;
    let textY = y;

    ctx.textAlign = horizontalAlign;
    ctx.textBaseline = verticalAlign;

    ctx.fillText(text, textX, textY);
}

function getSegmentColor(index: number) {
    return index === 0 ? 'black' : '#2196f3';
}

function wrapBounds(point: Point2D) {
    point.x = point.x >= COLS ? 0 : point.x < 0 ? COLS - 1 : point.x;
    point.y = point.y >= ROWS ? 0 : point.y < 0 ? ROWS - 1 : point.y;

    return point;
}

function paintCell(ctx: CanvasRenderingContext2D, point: Point2D, color: string) {
    const x = point.x * CELL_SIZE + (point.x * GAP_SIZE);
    const y = point.y * CELL_SIZE + (point.y * GAP_SIZE);

    ctx.fillStyle = color;
    ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
}