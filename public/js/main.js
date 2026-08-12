(async function () {
  // baseConnections order: left, top, right, bottom.
  const pieces = await fetch("/pieces.json")
    .then((res) => res.json())
    .then((data) => {
      return data;
    });

  let resolution = [];

  function startBoard(rowCount, colCount) {
    for (let i = 0; i < rowCount; i++) {
      let newLine = [];

      for (let j = 0; j < colCount; j++) {
        const left = j === 0 ? null : undefined;
        const top = i === 0 ? null : undefined;
        const right = j === colCount - 1 ? null : undefined;
        const bottom = i === rowCount - 1 ? null : undefined;

        newLine.push([left, top, right, bottom]);
      }

      resolution.push(newLine);
    }
  }

  function updateBoard(container) {
    const getRandomConnection = () => Math.random() > 0.5;
    const rowCount = resolution.length;

    let newResolution = [];

    for (let i = 0; i < rowCount; i++) {
      const colCount = resolution[i].length;

      let newLine = [];

      for (let j = 0; j < colCount; j++) {
        let oldRight = j > 0 ? resolution[i][j - 1][2] : null;
        let oldBottom = i > 0 ? resolution[i - 1][j][3] : null;

        const left = oldRight === null ? null : !oldRight;
        const top = oldBottom === null ? null : !oldBottom;

        const right = j < colCount - 1 ? getRandomConnection() : null;
        const bottom = i < rowCount - 1 ? getRandomConnection() : null;

        const connections = [left, top, right, bottom];

        newLine.push(connections);
        placePiece(connections, container);
      }

      newResolution.push(newLine);
    }

    resolution = newResolution;
  }

  function rotatePiece(connections, degrees) {
    const rotationTimes = (degrees / 90) % connections.length;

    let newRotation = [...connections];

    for (let i = 0; i < connections.length; i++) {
      newRotation[i] = connections[(i + rotationTimes) % connections.length];
    }

    return newRotation;
  }

  function placePiece(connections, container) {
    let rotation = 0;

    const piece = pieces.find((p) => {
      let foundDegree = null;

      [0, 90, 180, 270].some((deg) => {
        const conexaoRotacionada = rotatePiece(p.baseConnections, deg);

        const matches = conexaoRotacionada.every(
          (v, i) => v === connections[i],
        );

        if (matches) {
          foundDegree = deg;
          return true;
        }
        return false;
      });

      if (foundDegree !== null) {
        rotation = foundDegree;
        return true;
      }
    });

    if (!piece) {
      console.error(
        "Não foi possível encontrar a peça! Conexões: " + connections,
      );
      return;
    }

    const cell = document.createElement("div");
    cell.classList.add("puzzle-cell");

    const puzzlePiece = document.createElement("div");
    puzzlePiece.classList.add("puzzle-piece");
    puzzlePiece.style.setProperty("--piece-url", `url('${piece.image}')`);
    puzzlePiece.style.setProperty("--piece-rotation", `${rotation}deg`);

    cell.appendChild(puzzlePiece);

    container.appendChild(cell);
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
})();
