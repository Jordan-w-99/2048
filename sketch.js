const S = 600;
const P = 5;

const colours = {
  2: "#ECE4DB", // 2
  4: "#EBE3CF", // 4
  8: "#EAB484", // 8
  16: "#E99B73", // 16
  32: "#E7846F", // 32
  64: "#FF0000", // 64
  128: "#EAD699", // 128
  256: "#E8D58F", // 256
  512: "#DBBF6F", // 512
  1024: "#E7CF7A", // 1024
  2048: "#E5C643", // 2048
  4096: "#3B3A31", // 4096
  8192: "#3B3933", // 8192+
};

let score;
let board;
let prevBoard;

const resetGame = () => {
  board = [
    [0, 2, 2, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  prevBoard = board;
  score = 0;
}

resetGame();

const boardHasChanged = (b, ub) => {
  let boardChanged = false;
  b.forEach((row, y) => {
    row.forEach((val, x) => {
      if (val != ub[y][x]) boardChanged = true;
    })
  })
  return boardChanged;
}

const gameIsOver = () => {
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      const c = board[y][x];
      const u = (y - 1) > 0 ? board[y - 1][x] : null;
      const d = (y + 1) < board.length ? board[y + 1][x] : null;;
      const l = (x - 1) > 0 ? board[y][x - 1] : null;
      const r = (x + 1) < board[y].length ? board[y][x + 1] : null;

      if (c == 0 || c == u || c == d || c == l || c == r) return false
    }
  }

  return true;
}

const transposeArr = (arr) => {
  const res = [];
  arr.forEach(row => {
    row.forEach((tile, idx) => {
      if (!res[idx]) {
        res.push([]);
      }
      res[idx].push(tile);
    })
  })
  return res;
}

const newTile = (key) => {
  const freeSpaces = [];
  let y;
  switch (key) {
    case 'ArrowUp':
      y = board.length - 1;
      board[y].forEach((val, x) => {
        if (val == 0) freeSpaces.push({ x, y });
      })
      break;
    case 'ArrowRight':
      x = 0;
      board.forEach((row, y) => {
        row.forEach((val, rowX) => {
          if (rowX == x && val == 0) freeSpaces.push({ x, y });
        })
      })

      break;
    case 'ArrowDown':
      y = 0;
      board[y].forEach((val, x) => {
        if (val == 0) freeSpaces.push({ x, y });
      })

      break;
    case 'ArrowLeft':
      x = board.length - 1;
      board.forEach((row, y) => {
        row.forEach((val, rowX) => {
          if (rowX == x && val == 0) freeSpaces.push({ x, y });
        })
      })

      break;
  }

  const newTilePos = random(freeSpaces);

  board[newTilePos.y][newTilePos.x] = random([2, 2, 4])
}

const updateScore = (s) => {
  score += s;
  document.getElementById("score-display").innerText = score;
}

const drawTile = (x, y, val) => {
  const tileS = S / 4 - P;
  const tileX = (x * (tileS + P)) + P / 2;
  const tileY = (y * (tileS + P)) + P / 2;

  fill(colours[val]);
  noStroke();
  rect(tileX, tileY, tileS, tileS, 20);

  fill(0);
  textAlign(CENTER, CENTER);
  textSize(48);
  text(val, tileX, tileY, tileS, tileS);

};

const drawBoard = () => {
  board.forEach((row, y) => {
    row.forEach((tile, x) => {
      if (tile) {
        drawTile(x, y, tile);
      }
    })
  })
};

const moveDown = () => {
  const cols = transposeArr(board);

  // move and update tiles
  const updatedCols = [];

  cols.forEach(row => {
    const vals = row.filter(r => r != 0);
    const updatedVals = [];

    for (let i = vals.length - 1; i >= 0; i--) {
      if (vals[i] != 0 && vals[i] == vals[i - 1]) {
        updateScore(vals[i]);
        updatedVals.unshift(vals[i] * 2);
        i--;
      }
      else {
        updatedVals.unshift(vals[i]);
      }
    }

    while (updatedVals.length != row.length) {
      updatedVals.unshift(0);
    }

    updatedCols.push(updatedVals);
  })

  prevBoard = board;
  board = transposeArr(updatedCols);
}

const moveRight = () => {
  const updatedBoard = []
  board.forEach(row => {
    const vals = row.filter(r => r != 0);
    const updatedVals = [];

    for (let i = 0; i < vals.length; i++) {
      if (vals[i] != 0 && vals[i] == vals[i + 1]) {
        updateScore(vals[i]);
        updatedVals.push(vals[i] * 2);
        i++;
      }
      else {
        updatedVals.push(vals[i]);
      }
    }

    while (updatedVals.length != row.length) {
      updatedVals.unshift(0);
    }

    updatedBoard.push(updatedVals);
  })

  prevBoard = board;
  board = updatedBoard;
}

const moveUp = () => {
  const cols = transposeArr(board);

  // move and update tiles
  const updatedCols = [];

  cols.forEach(row => {
    const vals = row.filter(r => r != 0);
    const updatedVals = [];

    for (let i = 0; i < vals.length; i++) {
      if (vals[i] != 0 && vals[i] == vals[i + 1]) {
        updateScore(vals[i]);
        updatedVals.push(vals[i] * 2);
        i++;
      }
      else {
        updatedVals.push(vals[i]);
      }
    }

    while (updatedVals.length != row.length) {
      updatedVals.push(0);
    }

    updatedCols.push(updatedVals);
  })

  prevBoard = board;
  board = transposeArr(updatedCols);
}

const moveLeft = () => {
  const updatedBoard = []
  board.forEach(row => {
    const vals = row.filter(r => r != 0);
    const updatedVals = [];

    for (let i = 0; i < vals.length; i++) {
      if (vals[i] != 0 && vals[i] == vals[i + 1]) {
        updateScore(vals[i]);
        updatedVals.push(vals[i] * 2);
        i++;
      }
      else {
        updatedVals.push(vals[i]);
      }
    }

    while (updatedVals.length != row.length) {
      updatedVals.push(0);
    }

    updatedBoard.push(updatedVals);
  })

  prevBoard = board;
  board = updatedBoard;
}

function setup() {
  const canv = createCanvas(S, S);
  canv.id("game-canvas");
  canv.parent("game-container");
}

function draw() {
  background(200);

  drawBoard();

  if (gameIsOver()) {
    fill(0);
    text("Game Over!\nPress 'R' to reset.", 0, 0, S, S);
  }
}

function keyPressed(e) {
  const k = e.key;

  switch (k) {
    case 'ArrowUp':
      moveUp();
      break;
    case 'ArrowRight':
      moveRight();
      break;
    case 'ArrowDown':
      moveDown();
      break;
    case 'ArrowLeft':
      moveLeft();
      break;
    case 'R':
    case 'r':
      resetGame();
      break;
  }

  if (boardHasChanged(board, prevBoard) && random() <= 0.6) {
    try {
      newTile(k);
    } catch(e) {
      // Will error when invalid key pressed.
    }
  }
}
