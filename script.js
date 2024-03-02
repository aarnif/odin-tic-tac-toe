const GameBoard = () => {
  const board = [
    [BoardCell(), BoardCell(), BoardCell()],
    [BoardCell(), BoardCell(), BoardCell()],
    [BoardCell(), BoardCell(), BoardCell()],
  ];

  const getBoard = () => board;

  const putMarkToBoard = (row, col, mark) => {
    if (row > 2 || row < 0 || col > 2 || col < 0) {
      console.log("Invalid input. Please enter row and column between 0-2");
      return false;
    }

    if (board[row][col].getValue() !== 0) {
      console.log("Cell is already taken. Try again.");
      return false;
    }

    board[row][col].putMark(mark);
    return true;
  };

  const printBoard = () => {
    console.log(
      `[ ${board[0][0].getValue()} | ${board[0][1].getValue()} | ${board[0][2].getValue()} ]`
    );
    console.log(
      `[ ${board[1][0].getValue()} | ${board[1][1].getValue()} | ${board[1][2].getValue()} ]`
    );
    console.log(
      `[ ${board[2][0].getValue()} | ${board[2][1].getValue()} | ${board[2][2].getValue()} ]`
    );
  };

  const emptyBoard = () => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        board[i][j] = BoardCell(0);
      }
    }
  };

  return {
    getBoard,
    putMarkToBoard,
    printBoard,
    emptyBoard,
  };
};

const BoardCell = () => {
  let value = 0;

  const putMark = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    putMark,
    getValue,
  };
};

const Player = (name, mark) => {
  return { name, mark };
};

const GameController = () => {
  const gameBoard = GameBoard();
  const player1 = Player("Player 1", "X");
  const player2 = Player("Player 2", "O");

  let activePlayer = player1;

  const switchPlayersTurn = () =>
    activePlayer === player1
      ? (activePlayer = player2)
      : (activePlayer = player1);

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    gameBoard.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const checkForTie = () => {
    const board = gameBoard.getBoard();

    for (let i = 0; i < 3; i++) {
      const boardRow = board[i];
      if (boardRow.some((cell) => cell.getValue() === 0)) {
        return false;
      }
    }

    return true;
  };

  const checkForWin = () => {
    const board = gameBoard.getBoard();
    const leftDiagonal = [board[0][0], board[1][1], board[2][2]];
    const rightDiagonal = [board[0][2], board[1][1], board[2][0]];

    const checkForWinInBoardPart = (boardPart) => {
      return boardPart.every((cell) => cell.getValue() === activePlayer.mark);
    };

    for (let i = 0; i < 3; i++) {
      const boardRow = board[i];
      const boardColumn = [board[0][i], board[1][i], board[2][i]];
      if (
        checkForWinInBoardPart(boardRow) ||
        checkForWinInBoardPart(boardColumn) ||
        checkForWinInBoardPart(leftDiagonal) ||
        checkForWinInBoardPart(rightDiagonal)
      ) {
        return true;
      }
    }

    return false;
  };

  const playRound = (row, col) => {
    const putMark = gameBoard.putMarkToBoard(row, col, activePlayer.mark);

    if (!putMark) {
      return "INVALID";
    }

    console.log(
      `Put ${getActivePlayer().name}'s mark into cell ${row}x${col}.`
    );

    if (checkForTie()) {
      gameBoard.printBoard();
      console.log("Game over. Its a draw.");
      return "DRAW";
    }

    if (checkForWin()) {
      gameBoard.printBoard();
      console.log(`${getActivePlayer().name} wins!`);
      return "WIN";
    }

    switchPlayersTurn();
    printNewRound();
  };

  return {
    playRound,
    getActivePlayer,
    switchPlayersTurn,
    getBoard: gameBoard.getBoard,
    emptyBoard: gameBoard.emptyBoard,
  };
};

const ScreenController = () => {
  console.log("Starting new game.");
  const game = GameController();
  const boardContainer = document.getElementById("game-board");
  const gameModal = document.getElementById("modal");
  const newGameButton = document.getElementById("new-game-button");

  const handleClickCell = (e) => {
    const row = e.target.dataset.row;
    const col = e.target.dataset.col;

    const gameResult = game.playRound(row, col);

    switch (gameResult) {
      case "INVALID":
        displayGameMessage("Cell is already taken. Try again.");
        break;
      case "DRAW":
        displayGameMessage("Game over. Its a draw.");
        displayGameOverModal("Game over. Its a draw.");
        break;
      case "WIN":
        displayGameMessage(`${game.getActivePlayer().name} wins!`);
        displayGameOverModal(`${game.getActivePlayer().name} wins!`);
        break;
      default:
        break;
    }

    updateScreen();
  };

  const updateScreen = () => {
    console.log("Updating screen");
    const gameBoard = game.getBoard();
    boardContainer.innerHTML = "";

    for (let i = 0; i < gameBoard.length; i++) {
      for (let j = 0; j < gameBoard[i].length; j++) {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = i;
        cellButton.dataset.col = j;
        cellButton.textContent =
          gameBoard[i][j].getValue() === 0 ? "" : gameBoard[i][j].getValue();
        cellButton.addEventListener("click", handleClickCell);
        boardContainer.appendChild(cellButton);
      }
    }

    displayGameMessage(`${game.getActivePlayer().name}'s turn.`);
  };

  const displayGameMessage = (message) => {
    const gameMessage = document.getElementById("game-message");
    gameMessage.textContent = message;
  };

  const displayGameOverModal = (message) => {
    const gameModalMessage = document.getElementById("modal-message");
    gameModalMessage.textContent = message;
    gameModal.showModal();
  };

  const startNewGame = () => {
    console.log("Starting new game.");
    game.emptyBoard();
    game.switchPlayersTurn();
    updateScreen();
    displayGameMessage(`${game.getActivePlayer().name}'s turn.`);
  };

  gameModal.addEventListener("cancel", (event) => {
    event.preventDefault();
  });

  newGameButton.addEventListener("click", () => {
    startNewGame();
    gameModal.close();
  });

  updateScreen();
};

ScreenController();
