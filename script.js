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

  return {
    getBoard,
    putMarkToBoard,
    printBoard,
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
      return;
    }

    console.log(
      `Put ${getActivePlayer().name}'s mark into cell ${row}x${col}.`
    );

    if (checkForTie()) {
      gameBoard.printBoard();
      console.log("Game over. Its a draw.");
      return true;
    }

    if (checkForWin()) {
      gameBoard.printBoard();
      console.log(`${getActivePlayer().name} wins!`);
      return true;
    }

    switchPlayersTurn();
    printNewRound();
  };

  return {
    playRound,
    getActivePlayer,
  };
};

const game = GameController();

const gameLoop = () => {
  while (true) {
    const [row, col] = prompt(
      `${game.getActivePlayer().name} turn. Enter row and column between 0-2`
    ).split(" ");

    if (game.playRound(row, col)) {
      break;
    }
  }
};

gameLoop();
