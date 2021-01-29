const gameBtns = document.querySelectorAll("[data-game-btn]");
const gameEndPopup = document.querySelector(".game-end-popup");
const gameEndModal = document.querySelector(".game-end-modal");
const gameResetBtn = gameEndModal.querySelector("#reset");
let gameFinished = false;
const game = (() => {
  let turn = "X";
  const gameBoard = (() => {
    let gameboard = [];
    const addToGameBoard = (index, player) => {
      gameboard[index] = player;
    };
    const getGameBoard = () => {
      return gameboard;
    };
    const getGameElement = (index) => {
      return gameboard[index];
    };
    const checkWin = () => {
      for (let i = 0; i < 3; i++) {
        if (checkVertical(i))
          return gameboard[i];
      }
      for (let i = 0; i <= 6; i += 3) {
        if (checkHorizontal(i)) {
          return gameboard[i];
        }
      }
      if (checkDiagonal())
        return gameboard[4];
    };
    const checkHorizontal = (index) => {
      if (gameboard[index] === gameboard[index + 1] && gameboard[index + 1] === gameboard[index + 2]) {
        return true;
      } else
        return false;
    };
    const checkVertical = (index) => {
      if (gameboard[index] === gameboard[index + 3] && gameboard[index + 3] === gameboard[index + 6] && gameboard[index])
        return true;
      else
        return false;
    };
    const checkDiagonal = () => {
      if (gameboard[0] === gameboard[4] && gameboard[4] === gameboard[8])
        return true;
      else if (gameboard[2] === gameboard[4] && gameboard[4] === gameboard[6])
        return true;
      else
        return false;
    };
    const resetBoard = () => {
      gameboard = [];
    };
    return {
      addToGameBoard,
      getGameBoard,
      getGameElement,
      checkWin,
      resetBoard
    };
  })();
  const playerFact = (name) => {
    const addToBoard = (index) => {
      gameBoard.addToGameBoard(index, name);
    };
    return {name, addToBoard};
  };
  const render = () => {
    let counter = 0;
    gameBtns.forEach((btn) => {
      btn.textContent = gameBoard.getGameBoard()[counter];
      counter++;
    });
  };
  const player1 = playerFact("X");
  const player2 = playerFact("O");
  const getTurn = () => {
    return turn;
  };
  const changeTurns = () => {
    const newTurn = turn === "X" ? "O" : "X";
    turn = newTurn;
  };
  const play = (index) => {
    let numOfPlays = 0;
    if (gameBoard.getGameElement(index))
      return;
    if (turn === "X") {
      player1.addToBoard(index);
    } else {
      player2.addToBoard(index);
    }
    const winner = gameBoard.checkWin();
    gameBoard.getGameBoard().forEach(() => {
      numOfPlays++;
    });
    render();
    if (winner) {
      gameFinished = true;
      const playerNum = winner === "X" ? 1 : 2;
      winPopup(playerNum);
    } else if (numOfPlays === 9) {
      tiePopup();
    }
    changeTurns();
  };
  const printGame = () => {
    console.log(gameBoard.getGameBoard());
  };
  const winPopup = (winner) => {
    gameEndModal.children[0].textContent = `Player ${winner} won!`;
    gameEndPopup.classList.toggle("hidden-away");
  };
  const tiePopup = () => {
    gameEndModal.children[0].textContent = "The game is a tie";
    gameEndPopup.classList.toggle("hidden-away");
    console.log("TIE END!!");
  };
  const resetGame = () => {
    gameBoard.resetBoard();
    turn = "X";
    gameFinished = false;
    gameEndPopup.classList.toggle("hidden-away");
    render();
  };
  return {getTurn, changeTurns, play, printGame, render, resetGame};
})();
window.onclick = (event) => {
  let target = event.target;
  let index = target.getAttribute("data-game-btn");
  if (!index)
    return;
  game.play(parseInt(index));
};
gameResetBtn.addEventListener("click", () => game.resetGame());
