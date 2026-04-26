const ROWS = 7;
const COLUMNS = 8;

const board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(" "));
let currentPlayer = "A";
let gameOver = false;

const boardEl = document.querySelector("#board");
const columnButtonsEl = document.querySelector("#columnButtons");
const statusEl = document.querySelector("#status");
const resetBtn = document.querySelector("#resetBtn");
const playerANameEl = document.querySelector("#playerAName");
const playerONameEl = document.querySelector("#playerOName");
const playerATallyEl = document.querySelector("#playerATally");
const playerOTallyEl = document.querySelector("#playerOTally");
const winnerPopupEl = document.querySelector("#winnerPopup");
const confettiLayerEl = document.querySelector("#confettiLayer");
const roundCounterEl = document.querySelector("#roundCounter");
const isCompactColumnsMedia = window.matchMedia("(max-width: 520px)");

let popupTimeoutId = null;
let autoResetTimeoutId = null;
let roundsPlayed = 0;
let namesLocked = false;
const playerWins = { A: 0, O: 0 };

function getPlayerName(player) {
  if (player === "A") {
    return playerANameEl.value.trim() || "Player A";
  }
  return playerONameEl.value.trim() || "Player O";
}

function updateStatus(message) {
  statusEl.textContent = message;
}

function updateRoundCounter() {
  roundCounterEl.textContent = `Rounds played: ${roundsPlayed}`;
}

function formatTallyMarks(count) {
  if (count === 0) {
    return "0";
  }
  const fiveMarkGroups = Math.floor(count / 5);
  const remainder = count % 5;
  const marks = [];

  for (let i = 0; i < fiveMarkGroups; i += 1) {
    marks.push("||||/");
  }
  if (remainder > 0) {
    marks.push("|".repeat(remainder));
  }

  const lines = [];
  for (let i = 0; i < marks.length; i += 3) {
    lines.push(marks.slice(i, i + 3).join(" "));
  }
  return lines.join("\n");
}

function updateWinCounters() {
  playerATallyEl.textContent = formatTallyMarks(playerWins.A);
  playerOTallyEl.textContent = formatTallyMarks(playerWins.O);
}

function setNameInputsLocked(locked) {
  namesLocked = locked;
  playerANameEl.disabled = locked;
  playerONameEl.disabled = locked;
}

function hideWinnerPopup() {
  winnerPopupEl.classList.remove("show");
  winnerPopupEl.classList.add("hide");
}

function showPopup(message, durationMs = 4000) {
  winnerPopupEl.textContent = message;
  winnerPopupEl.classList.remove("hide");
  winnerPopupEl.classList.add("show");

  if (popupTimeoutId) {
    window.clearTimeout(popupTimeoutId);
  }

  popupTimeoutId = window.setTimeout(() => {
    hideWinnerPopup();
  }, durationMs);
}

function launchConfetti() {
  confettiLayerEl.innerHTML = "";
  const count = 70;

  for (let i = 0; i < count; i += 1) {
    const piece = document.createElement("span");
    piece.className = `confetti-piece ${Math.random() > 0.5 ? "leaf" : "flower"}`;
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.animationDuration = `${1.8 + Math.random() * 1}s`;
    piece.style.animationDelay = `${Math.random() * 0.35}s`;
    confettiLayerEl.appendChild(piece);
  }

  window.setTimeout(() => {
    confettiLayerEl.innerHTML = "";
  }, 3400);
}

function clearBoardState() {
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLUMNS; c += 1) {
      board[r][c] = " ";
    }
  }
}

function startNextRound() {
  clearBoardState();
  currentPlayer = "A";
  gameOver = false;
  renderBoard();
  updateStatus(`Current player: ${getPlayerName("A")}`);
  toggleColumnButtons(false);
}

function resetGame() {
  clearBoardState();
  currentPlayer = "A";
  gameOver = false;
  roundsPlayed = 0;
  playerWins.A = 0;
  playerWins.O = 0;
  updateWinCounters();
  updateRoundCounter();
  updateStatus(`Current player: ${getPlayerName("A")}`);
  confettiLayerEl.innerHTML = "";
  hideWinnerPopup();
  setNameInputsLocked(false);
  if (popupTimeoutId) {
    window.clearTimeout(popupTimeoutId);
    popupTimeoutId = null;
  }
  if (autoResetTimeoutId) {
    window.clearTimeout(autoResetTimeoutId);
    autoResetTimeoutId = null;
  }
  renderBoard();
  toggleColumnButtons(false);
}

function toggleColumnButtons(disabled) {
  document.querySelectorAll(".col-btn").forEach((btn) => {
    btn.disabled = disabled;
  });
}

function getColumnButtonLabel(col) {
  return isCompactColumnsMedia.matches ? `${col + 1}` : `Drop ${col + 1}`;
}

function updateColumnButtonLabels() {
  document.querySelectorAll(".col-btn").forEach((btn, col) => {
    btn.textContent = getColumnButtonLabel(col);
  });
}

function createColumnButtons() {
  columnButtonsEl.innerHTML = "";
  for (let col = 0; col < COLUMNS; col += 1) {
    const button = document.createElement("button");
    button.className = "col-btn";
    button.type = "button";
    button.textContent = getColumnButtonLabel(col);
    button.addEventListener("click", () => handleDrop(col));
    columnButtonsEl.appendChild(button);
  }
}

function renderBoard() {
  boardEl.innerHTML = "";
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLUMNS; c += 1) {
      const cell = document.createElement("div");
      cell.className = "cell";
      if (board[r][c] === "A") {
        cell.classList.add("a");
      } else if (board[r][c] === "O") {
        cell.classList.add("o");
      }
      boardEl.appendChild(cell);
    }
  }
}

function dropPiece(col) {
  if (col < 0 || col >= COLUMNS) {
    throw new Error("Column out of bounds");
  }

  for (let row = ROWS - 1; row >= 0; row -= 1) {
    if (board[row][col] === " ") {
      board[row][col] = currentPlayer;
      return true;
    }
  }

  throw new Error("Column is full");
}

function checkWinnerDirection(startRow, startCol, dRow, dCol) {
  const piece = board[startRow][startCol];
  if (piece === " ") {
    return false;
  }

  for (let i = 1; i < 4; i += 1) {
    const nextRow = startRow + dRow * i;
    const nextCol = startCol + dCol * i;
    if (
      nextRow < 0 ||
      nextRow >= ROWS ||
      nextCol < 0 ||
      nextCol >= COLUMNS ||
      board[nextRow][nextCol] !== piece
    ) {
      return false;
    }
  }
  return true;
}

function winner() {
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLUMNS; c += 1) {
      if (
        checkWinnerDirection(r, c, 1, 0) ||
        checkWinnerDirection(r, c, 0, 1) ||
        checkWinnerDirection(r, c, 1, 1) ||
        checkWinnerDirection(r, c, -1, 1)
      ) {
        return true;
      }
    }
  }
  return false;
}

function isGameOver() {
  if (winner()) {
    return true;
  }
  return board.every((row) => row.every((cell) => cell !== " "));
}

function handleDrop(col) {
  if (gameOver) {
    return;
  }

  try {
    if (!namesLocked) {
      setNameInputsLocked(true);
    }

    const playerBeforeMove = currentPlayer;
    const winnerName = getPlayerName(playerBeforeMove);
    dropPiece(col);
    renderBoard();

    if (winner()) {
      gameOver = true;
      roundsPlayed += 1;
      playerWins[playerBeforeMove] += 1;
      updateWinCounters();
      updateRoundCounter();
      updateStatus(`${winnerName} wins!`);
      toggleColumnButtons(true);
      showPopup(`${winnerName} wins!`, 4000);
      launchConfetti();
      autoResetTimeoutId = window.setTimeout(startNextRound, 4300);
      return;
    }

    if (isGameOver()) {
      gameOver = true;
      roundsPlayed += 1;
      updateRoundCounter();
      updateStatus("Round ended in a tie.");
      showPopup("Round tied! Next round starting...", 3000);
      toggleColumnButtons(true);
      autoResetTimeoutId = window.setTimeout(startNextRound, 3200);
      return;
    }

    currentPlayer = currentPlayer === "A" ? "O" : "A";
    updateStatus(`Current player: ${getPlayerName(currentPlayer)}`);
  } catch (error) {
    updateStatus(error.message);
  }
}

resetBtn.addEventListener("click", resetGame);
playerANameEl.addEventListener("input", () => {
  if (!gameOver && currentPlayer === "A") {
    updateStatus(`Current player: ${getPlayerName("A")}`);
  }
});
playerONameEl.addEventListener("input", () => {
  if (!gameOver && currentPlayer === "O") {
    updateStatus(`Current player: ${getPlayerName("O")}`);
  }
});
isCompactColumnsMedia.addEventListener("change", updateColumnButtonLabels);

createColumnButtons();
renderBoard();
updateStatus(`Current player: ${getPlayerName("A")}`);
updateRoundCounter();
updateWinCounters();
