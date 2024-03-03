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

const Player = (name, mark, score = 0) => {
  // let score = 0;
  let playerName = name;
  const changeName = (newName) => {
    playerName = newName;
  };
  const increaseScore = () => {
    ++score;
  };

  const getName = () => playerName;
  const getMark = () => mark;
  const getScore = () => score;

  return {
    name,
    mark,
    score,
    changeName,
    increaseScore,
    getName,
    getMark,
    getScore,
  };
};

const GameController = () => {
  console.log("Creating new game controller.");
  const gameBoard = GameBoard();
  const player1 = Player("Player 1", "X");
  const player2 = Player("Player 2", "O");

  let activePlayer = player1;

  const switchPlayersTurn = () =>
    activePlayer.getName() === player1.getName()
      ? (activePlayer = Player(
          player2.getName(),
          player2.getMark(),
          player2.getScore()
        ))
      : (activePlayer = Player(
          player1.getName(),
          player1.getMark(),
          player1.getScore()
        ));

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
      activePlayer.getName() === player1.getName()
        ? player1.increaseScore()
        : player2.increaseScore();
      return "WIN";
    }

    switchPlayersTurn();
    printNewRound();
  };

  const newGame = () => {
    console.log("Starting new game.");
    gameBoard.emptyBoard();
    switchPlayersTurn();
  };

  return {
    player1,
    player2,
    playRound,
    getActivePlayer,
    newGame,
    getBoard: gameBoard.getBoard,
    emptyBoard: gameBoard.emptyBoard,
  };
};

const ScreenController = () => {
  console.log("Starting new game.");
  const game = GameController();
  const gameBoard = game.getBoard();
  const boardContainer = document.getElementById("game-board");
  const player1Name = document.getElementById("player1-name");
  const player2name = document.getElementById("player2-name");
  const player1Score = document.getElementById("player1-score");
  const player2Score = document.getElementById("player2-score");
  const gameOverModal = document.getElementById("game-over-modal");
  const changeNameModal = document.getElementById("change-name-modal");
  const newNameInput = document.getElementById("new-name");
  const changeNameButton = document.getElementById("change-name-button");
  const newGameButton = document.getElementById("new-game-button");

  const handleMouseOverHover = (e) => {
    console.log("Mouse over cell");
    const row = e.target.dataset.row;
    const col = e.target.dataset.col;
    if (gameBoard[row][col].getValue() === 0) {
      e.target.textContent = game.getActivePlayer().getMark();
    }
  };

  const handleMouseOutHover = (e) => {
    console.log("Mouse out cell");
    const row = e.target.dataset.row;
    const col = e.target.dataset.col;
    if (gameBoard[row][col].getValue() === 0) {
      e.target.textContent = "";
    }
  };

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
    boardContainer.innerHTML = "";

    for (let i = 0; i < gameBoard.length; i++) {
      for (let j = 0; j < gameBoard[i].length; j++) {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = i;
        cellButton.dataset.col = j;
        cellButton.textContent =
          gameBoard[i][j].getValue() === 0 ? "" : gameBoard[i][j].getValue();
        cellButton.addEventListener("mouseover", handleMouseOverHover);
        cellButton.addEventListener("mouseout", handleMouseOutHover);
        cellButton.addEventListener("click", handleClickCell);
        boardContainer.appendChild(cellButton);
      }
    }

    displayGameMessage(`${game.getActivePlayer().name}'s turn.`);
    displayPlayerInfos(game.player1, game.player2);
    console.log(game.player1.getName(), game.player2.getName());
  };

  const displayGameMessage = (message) => {
    const gameMessage = document.getElementById("game-message");
    gameMessage.textContent = message;
  };

  const displayPlayerInfos = (player1, player2) => {
    player1Name.textContent = `${player1.getName()}`;
    player2name.textContent = `${player2.getName()}`;
    player1Score.textContent = `${player1.getScore()}`;
    player2Score.textContent = `${player2.getScore()}`;
  };

  const displayGameOverModal = (message) => {
    const gameModalMessage = document.getElementById("modal-message");
    gameModalMessage.textContent = message;
    gameOverModal.showModal();
  };

  const startNewGame = () => {
    game.newGame();
    updateScreen();
    displayGameMessage(`${game.getActivePlayer().name}'s turn.`);
  };

  const updateName = (player) => {
    console.log("Updating name for:", player.getName());
    const newName = document.getElementById("new-name").value;
    player.changeName(newName);
    changeNameModal.close();
    updateScreen();
  };

  const updateNameListenerPlayer1 = () => {
    updateName(game.player1);
    changeNameButton.removeEventListener("click", updateNameListenerPlayer1);
  };

  const updateNameListenerPlayer2 = () => {
    updateName(game.player2);
    changeNameButton.removeEventListener("click", updateNameListenerPlayer2);
  };

  player1Name.addEventListener("click", () => {
    changeNameModal.showModal();
    newNameInput.value = game.player1.getName();
    changeNameButton.addEventListener("click", updateNameListenerPlayer1);
  });

  player2name.addEventListener("click", () => {
    changeNameModal.showModal();
    newNameInput.value = game.player2.getName();
    changeNameButton.addEventListener("click", updateNameListenerPlayer2);
  });

  gameOverModal.addEventListener("cancel", (event) => event.preventDefault());

  newGameButton.addEventListener("click", () => {
    startNewGame();
    gameOverModal.close();
  });

  updateScreen();
};

ScreenController();
