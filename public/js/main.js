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
  }

  function updateBoard(container) {
    const rowCount = resolution.length;
    const colCount = resolution[0].length;

    container.innerHTML = "";

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
        placePiece(resolution[i][j], container, i, j);
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

  function placePiece(connections, container, i, j) {
    let path = getPiecePath(connections);

    const puzzlePiece = document.createElement("div");
    puzzlePiece.classList.add("puzzle-piece");

    puzzlePiece.style.setProperty("--row", i + 1);
    puzzlePiece.style.setProperty("--col", j + 1);

    puzzlePiece.style.zIndex = i * 10 + j;

    let red = Math.floor(Math.random() * 256);
    let green = Math.floor(Math.random() * 256);
    let blue = Math.floor(Math.random() * 256);
    let rgb = `rgb(${red}, ${green}, ${blue})`;

    puzzlePiece.innerHTML = `
      <svg class="puzzle-svg" viewBox="0 0 230 230" xmlns="http://www.w3.org">
        <path d="${path}" fill="${rgb}" stroke="rgba(0,0,0,0.1)" stroke-width="2" />
      </svg>
    `;

    container.appendChild(puzzlePiece);
  }

  function setup() {
    const container = document.getElementById("puzzle-container");

    if (!container) {
      setTimeout(setup, 100);
      return;
    }

    const colCount = Number(container.dataset.columns ?? 0);
    const rowCount = Number(container.dataset.rows ?? 0);

    startBoard(rowCount, colCount);

    container.style.setProperty("--column-count", colCount);
    container.style.setProperty("--row-count", rowCount);

    updateBoard(container);
  }

  setup();

  window.resetPuzzle = setup;
})();
