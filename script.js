const ROWS = 50;
const COLS = 50;
const CELL_SIZE = 10;
const GRID_COLOR = '#ddd';
const CELL_COLOR = '#222';

let grid;
let nextGrid;
let canvas;
let context;
let isRunning = false;
let interval;
let generation = 0;

function initializeGrid() {
  grid = createGrid(ROWS, COLS);
  nextGrid = createGrid(ROWS, COLS);
  setupCanvas();
  randomizeGrid();
  resetGenerationCount();
}

function createGrid(rows, cols) {
  const grid = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push(false);
    }
    grid.push(row);
  }
  return grid;
}

function setupCanvas() {
  canvas = document.getElementById('grid');
  canvas.width = COLS * CELL_SIZE;
  canvas.height = ROWS * CELL_SIZE;
  context = canvas.getContext('2d');
  canvas.addEventListener('click', handleCanvasClick);
}

function randomizeGrid() {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      grid[i][j] = Math.random() < 0.5;
    }
  }
  drawGrid();
}

function clearGrid() {
  if (isRunning) {
    clearInterval(interval);
    isRunning = false;
    document.getElementById('start-pause-button').textContent = 'Start';
  }
  grid = createGrid(ROWS, COLS);
  drawGrid();
  resetGenerationCount();
}

function updateGrid() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = grid[row][col];
      const neighbors = countNeighbors(row, col);
      if (cell && (neighbors < 2 || neighbors > 3)) {
        nextGrid[row][col] = false;
      } else if (!cell && neighbors === 3) {
        nextGrid[row][col] = true;
      } else {
        nextGrid[row][col] = cell;
      }
    }
  }
  [grid, nextGrid] = [nextGrid, grid];
  drawGrid();
  generation++;
  updateGenerationCount();
document.getElementById('generationButton').textContent = `Generations: ${generation}`;
}

function countNeighbors(row, col) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      const nRow = row + i;
      const nCol = col + j;
      if (nRow >= 0 && nRow < ROWS && nCol >= 0 && nCol < COLS) {
        if (grid[nRow][nCol]) count++;
      }
    }
  }
  return count;
}

function drawGrid() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = grid[row][col];
      context.beginPath();
      context.rect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      context.fillStyle = cell ? CELL_COLOR : GRID_COLOR;
      context.fill();
      context.stroke();
    }
  }
}

function handleCanvasClick(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const col = Math.floor(x / CELL_SIZE);
  const row = Math.floor(y / CELL_SIZE);
  grid[row][col] = !grid[row][col];
  drawGrid();
}

function startPauseGame() {
  const startPauseButton = document.getElementById('start-pause-button');
  if (isRunning) {
    clearInterval(interval);
    isRunning = false;
    startPauseButton.textContent = 'Start';
  } else {
    interval = setInterval(updateGrid, 100);
    isRunning = true;
    startPauseButton.textContent = 'Pause';
  }
}

function setup() {
  initializeGrid();
  document.getElementById('randomize-button').addEventListener('click', randomizeGrid);
  document.getElementById('clear-button').addEventListener('click', clearGrid);
  document.getElementById('start-pause-button').addEventListener('click', startPauseGame);
}

function updateGenerationCount() {
  generation++;
  document.getElementById('generationButton').textContent = `Generations: ${generation}`;
}

function resetGenerationCount() {
  generation = 0;
  document.getElementById('generationButton').textContent = `Generations: ${generation}`;
}

setup();
