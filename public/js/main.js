(async function () {
  let resolution = [];

  function startBoard(rowCount, colCount) {
    resolution = [];

    for (let i = 0; i < rowCount; i++) {
      let newLine = [];

      for (let j = 0; j < colCount; j++) {
        const left = j === 0 ? null : undefined;
        const top = i === 0 ? null : undefined;
        const right = j === colCount - 1 ? null : undefined;
        const bottom = i === rowCount - 1 ? null : undefined;

        // connections order: left, top, right, bottom.
        newLine.push([left, top, right, bottom]);
      }

      resolution.push(newLine);
    }

    const puzzleContainer = document.getElementById("puzzle-container");

    if (!puzzleContainer) {
      setTimeout(startBoard, 200);
      return;
    }

    for (let i = 0; i < rowCount; i++) {
      for (let j = 0; j < colCount; j++) {
        const newEmptyPiece = document.createElement("div");
        newEmptyPiece.classList.add("empty-place");
        newEmptyPiece.style.gridRow = i + 1;
        newEmptyPiece.style.gridColumn = j + 1;
        newEmptyPiece.dataset.i = i;
        newEmptyPiece.dataset.j = j;
        puzzleContainer.appendChild(newEmptyPiece);
      }
    }
  }

  function getPiecePath(connections) {
    const [left, top, right, bottom] = connections;

    let path = "M 40,40 ";

    if (top === null) path += "L 190,40 ";
    else if (top === true) {
      path +=
        "L 95,40 A 6,6 0 0,0 101,36 A 16,16 0 1,1 129,36 A 6,6 0 0,0 135,40 L 190,40 ";
    } else {
      path +=
        "L 95,40 A 6,6 0 0,1 101,44 A 16,16 0 1,0 129,44 A 6,6 0 0,1 135,40 L 190,40 ";
    }

    if (right === null) path += "L 190,190 ";
    else if (right === true) {
      path +=
        "L 190,95 A 6,6 0 0,0 194,101 A 16,16 0 1,1 194,129 A 6,6 0 0,0 190,135 L 190,190 ";
    } else {
      path +=
        "L 190,95 A 6,6 0 0,1 186,101 A 16,16 0 1,0 186,129 A 6,6 0 0,1 190,135 L 190,190 ";
    }

    if (bottom === null) path += "L 40,190 ";
    else if (bottom === true) {
      path +=
        "L 135,190 A 6,6 0 0,0 129,194 A 16,16 0 1,1 101,194 A 6,6 0 0,0 95,190 L 40,190 ";
    } else {
      path +=
        "L 135,190 A 6,6 0 0,1 129,186 A 16,16 0 1,0 101,186 A 6,6 0 0,1 95,190 L 40,190 ";
    }

    if (left === null) path += "L 40,40 ";
    else if (left === true) {
      path +=
        "L 40,135 A 6,6 0 0,0 36,129 A 16,16 0 1,1 36,101 A 6,6 0 0,0 40,95 L 40,40 ";
    } else {
      path +=
        "L 40,135 A 6,6 0 0,1 44,129 A 16,16 0 1,0 44,101 A 6,6 0 0,1 40,95 L 40,40 ";
    }

    return path + "Z";
  }

  function randomizePiecePosition(connections, i, j) {
    let path = getPiecePath(connections);

    const mainContainer = document.querySelector(".main-container");

    if (!mainContainer) {
      setTimeout(setup, 200);
      return;
    }

    const puzzlePiece = document.createElement("div");
    puzzlePiece.classList.add("puzzle-piece");
    puzzlePiece.dataset.i = i;
    puzzlePiece.dataset.j = j;

    let red = Math.floor(Math.random() * 256);
    let green = Math.floor(Math.random() * 256);
    let blue = Math.floor(Math.random() * 256);
    let rgb = `rgb(${red}, ${green}, ${blue})`;

    puzzlePiece.innerHTML = `
      <svg class="puzzle-svg" viewBox="0 0 230 230" xmlns="http://www.w3.org/2000/svg" style="pointer-events: none" >
        <path d="${path}" fill="${rgb}" stroke="rgba(0,0,0,0.1)" stroke-width="2" style="pointer-events: none" />
      </svg>
    `;

    puzzlePiece.style.position = "absolute";
    mainContainer.appendChild(puzzlePiece);

    const containerRect = mainContainer.getBoundingClientRect();
    const pieceRect = puzzlePiece.getBoundingClientRect();

    const centerX = pieceRect.width / 2;
    const centerY = pieceRect.height / 2;

    const normalize = (x, oldMin, newMin, oldMax, newMax) =>
      newMin + ((x - oldMin) * (newMax - newMin)) / (oldMax - oldMin);

    const randomX = Math.floor(Math.random() * containerRect.width);
    const randomY = Math.floor(Math.random() * containerRect.height);

    const left = normalize(
      randomX,
      0,
      centerX,
      containerRect.width,
      containerRect.width - centerX,
    );
    const top = normalize(
      randomY,
      0,
      centerY,
      containerRect.height,
      containerRect.height - centerY,
    );

    puzzlePiece.style.left = `${left}px`;
    puzzlePiece.style.top = `${top}px`;
  }

  function updateBoard() {
    const rowCount = resolution.length;
    const colCount = resolution[0].length;

    let newResolution = [];

    for (let i = 0; i < rowCount; i++) {
      let newLine = [];
      for (let j = 0; j < colCount; j++) {
        let oldRight = j > 0 ? newLine[j - 1][2] : null;
        let oldBottom = i > 0 ? newResolution[i - 1][j][3] : null;

        const left = oldRight === null ? null : !oldRight;
        const top = oldBottom === null ? null : !oldBottom;

        const right = j < colCount - 1 ? Math.random() > 0.5 : null;
        const bottom = i < rowCount - 1 ? Math.random() > 0.5 : null;

        newLine.push([left, top, right, bottom]);
      }
      newResolution.push(newLine);
    }

    resolution = newResolution;

    for (let i = 0; i < rowCount; i++) {
      for (let j = 0; j < colCount; j++) {
        randomizePiecePosition(resolution[i][j], i, j);
      }
    }
  }

  function setup() {
    const mainContainer = document.querySelector(".main-container");
    const container = document.getElementById("puzzle-container");

    if (!mainContainer || !container) {
      setTimeout(setup, 100);
      return;
    }

    mainContainer.querySelectorAll(".puzzle-piece").forEach((piece) => {
      piece.remove();
    });

    const colCount = Number(container.dataset.columns ?? 0);
    const rowCount = Number(container.dataset.rows ?? 0);

    startBoard(rowCount, colCount);

    container.style.setProperty("--column-count", colCount);
    container.style.setProperty("--row-count", rowCount);

    updateBoard();
  }

  setup();

  window.resetPuzzle = setup;
})();

// piece place handler

let currentPiece = null;
let centerX = 0;
let centerY = 0;

document.addEventListener("mousedown", (ev) => {
  if (ev.button !== 0) return;

  const piece = ev.target.closest(".puzzle-piece");

  if (!piece) return;

  currentPiece = piece;
  currentPiece.style.position = "absolute";

  const rect = currentPiece.getBoundingClientRect();

  centerX = rect.width / 2;
  centerY = rect.height / 2;

  currentPiece.style.left = `${ev.pageX - centerX}px`;
  currentPiece.style.top = `${ev.pageY - centerY}px`;
  currentPiece.style.pointerEvents = "none";
});

document.addEventListener("mousemove", (ev) => {
  if (!currentPiece) return;

  currentPiece.style.left = `${ev.clientX - centerX}px`;
  currentPiece.style.top = `${ev.clientY - centerY}px`;
});

document.addEventListener("mouseup", (ev) => {
  if (!currentPiece) return;

  const targetUnder = document.elementFromPoint(ev.clientX, ev.clientY);
  const container = targetUnder?.closest("#puzzle-container");
  const emptyPiece = targetUnder?.closest(".empty-place");

  const curI = Number(currentPiece.dataset.i) || 0;
  const curJ = Number(currentPiece.dataset.j) || 0;

  if (emptyPiece) {
    const empI = Number(emptyPiece.dataset.i) || 0;
    const empJ = Number(emptyPiece.dataset.j) || 0;

    if (container && curI === empI && curJ === empJ) {
      currentPiece.style.position = "static";
      currentPiece.style.gridArea = `${curI + 1} / ${curJ + 1}`;
      currentPiece.classList.add("placed");
      emptyPiece.replaceWith(currentPiece);
    } else {
      currentPiece.style.pointerEvents = "auto";
    }
  } else {
    currentPiece.style.pointerEvents = "auto";
  }

  currentPiece = null;
});

// general functions

window.changeRowCount = function (value) {
  const container = document.getElementById("puzzle-container");
  const rowText = document.getElementById("row-val");

  if (!container || !rowText) return;

  container.dataset.rows = value;
  rowText.innerHTML = value;

  window.resetPuzzle();
};

window.changeColCount = function (value) {
  const container = document.getElementById("puzzle-container");
  const colText = document.getElementById("col-val");

  if (!container || !colText) return;

  container.dataset.columns = value;
  colText.innerHTML = value;

  window.resetPuzzle();
};
