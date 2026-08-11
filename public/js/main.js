(function () {
  function setup() {
    const container = document.getElementById("puzzle-container");

    if (!container) {
      setTimeout(setup, 100);
      return;
    }

    const colCount = Number(container.dataset.columns ?? 0);
    const rowCount = Number(container.dataset.rows ?? 0);

    container.style.setProperty("--column-count", colCount);
    container.style.setProperty("--row-count", rowCount);

    for (let i = 0; i < rowCount; i++) {
      for (let j = 0; j < colCount; j++) {
        const puzzlePiece = document.createElement("div");
        puzzlePiece.classList.add("puzzle-piece");
        puzzlePiece.classList.add("placed");

        const red = Math.floor(Math.random() * 256);
        const green = Math.floor(Math.random() * 256);
        const blue = Math.floor(Math.random() * 256);

        puzzlePiece.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;

        container.appendChild(puzzlePiece);
      }
    }
  }

  setup();
})();
