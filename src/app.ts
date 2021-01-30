//DOM Elements declarations
const gameBtns = document.querySelectorAll("[data-game-btn]");
const gameEndPopup = document.querySelector(".game-end-popup");
const gameEndModal = document.querySelector(".game-end-modal");
const gameResetBtn = gameEndModal.querySelector("#reset");
const currentTurnTxt = document.querySelector("#turn");
let gameFinished = false;

interface Player {
  name: string;
  addToBoard: Function;
}

//Game module (IIFC)
const game = (() => {
  let turn = "X";
  //gameBoard module (IIFC) it returns a bunch of helpful methods for updating the gameboard
  const gameBoard = (() => {
    let gameboard: string[] = []; // Declaring the gameboard

    const addToGameBoard = (index: number, player: string) => {
      gameboard[index] = player;
    };

    const getGameBoard = () => {
      return gameboard;
    };

    const getGameElement = (index: number) => {
      return gameboard[index];
    };

    const checkWin = () => {
      for (let i = 0; i < 3; i++) {
        if (checkVertical(i)) return gameboard[i]; //Checks for vertical wins
      }
      for (let i = 0; i <= 6; i += 3) {
        if (checkHorizontal(i)) {
          return gameboard[i]; // Checks for horizontal wins
        }
      }
      if (checkDiagonal()) return gameboard[4]; //Checks for diagonal wins, it will return the element in the middle of the gameboard
    };

    const checkHorizontal = (index: number) => {
      if (
        gameboard[index] === gameboard[index + 1] &&
        gameboard[index + 1] === gameboard[index + 2]
      ) {
        return true;
      } else return false;
    };

    const checkVertical = (index: number) => {
      if (
        gameboard[index] === gameboard[index + 3] &&
        gameboard[index + 3] === gameboard[index + 6] &&
        gameboard[index]
      )
        return true;
      else return false;
    };

    const checkDiagonal = () => {
      if (gameboard[0] === gameboard[4] && gameboard[4] === gameboard[8])
        return true;
      else if (gameboard[2] === gameboard[4] && gameboard[4] === gameboard[6])
        return true;
      else return false;
    };
    //Resets the gameboard (Duh)
    const resetBoard = () => {
      gameboard = [];
    };

    //Returns the helpful functions that'll help me avoid making spaghetti code
    return {
      addToGameBoard,
      getGameBoard,
      getGameElement,
      checkWin,
      resetBoard,
    };
  })(); //Executes the module, so now we have access to all of the helper functions

  //Player factory function, returns an object of type Player
  const playerFact = (name: string): Player => {
    const addToBoard = (index: number) => {
      gameBoard.addToGameBoard(index, name);
    };
    return { name, addToBoard };
  };

  //Updates the text on the #turn element DOM element
  const updateTurnTxt = (): void => {
    const playerNum = turn === "X" ? 1 : 2;
    currentTurnTxt.textContent = `Player ${playerNum}'s turn!`;
  };

  //Janky fix to a bug i had, ignore this.
  const firstLoad = ((): void => {
    updateTurnTxt();
  })();

  //Renders the gameboard elements to the DOM
  const render = () => {
    let counter = 0;
    gameBtns.forEach((btn) => {
      btn.textContent = gameBoard.getGameBoard()[counter];
      counter++;
    });
  };

  //Player declarations
  const player1 = playerFact("X");
  const player2 = playerFact("O");

  //Returns the current turn of the game
  const getTurn = () => {
    return turn;
  };

  //Switches the current turn of the game
  const flipTurns = (): void => {
    const newTurn = turn === "X" ? "O" : "X";
    turn = newTurn;
  };

  //Game logic (main game loop)
  const play = (index: number) => {
    let numOfPlays = 0;
    if (gameBoard.getGameElement(index)) return; //Makes sure that the user clicked on a valid empty button.
    //Adds the player to the gameboard
    if (turn === "X") {
      player1.addToBoard(index);
    } else {
      player2.addToBoard(index);
    }

    const winner = gameBoard.checkWin(); //Checks if there is a winner
    gameBoard.getGameBoard().forEach(() => {
      numOfPlays++;
    }); //Counts how many elements are in the board

    render(); //Renders the changes
    if (winner) {
      gameFinished = true;
      const playerNum = winner === "X" ? 1 : 2;
      winPopup(playerNum); // Ends the game loop and prompts the user to restart
    } else if (numOfPlays === 9) {
      tiePopup(); // Same thing here
    }
    flipTurns(); //Pretty self-explanatory
    updateTurnTxt(); // Updates the turn text on the DOM
  };

  //Function i made for debugging
  const printGame = () => {
    console.log(gameBoard.getGameBoard());
  };

  //Reveals the win and tie popups.

  const winPopup = (winner: number) => {
    gameEndModal.children[0].textContent = `Player ${winner} won!`;
    gameEndPopup.classList.toggle("hidden-away");
  };

  const tiePopup = () => {
    gameEndModal.children[0].textContent = "The game is a tie";
    gameEndPopup.classList.toggle("hidden-away");
    console.log("TIE END!!");
  };

  //Resets the game and hides away the win popup
  const resetGame = () => {
    gameBoard.resetBoard();
    turn = "X";
    gameFinished = false;
    gameEndPopup.classList.toggle("hidden-away");
    render();
    updateTurnTxt();
  };

  return { play, resetGame };
})(); // Game module gets executed here (only the fuctions required for the user to play are returned)

window.onclick = (event: Event) => {
  let target = event.target as HTMLButtonElement; //Gets the element that the user clicked
  let index = target.getAttribute("data-game-btn");
  if (!index) return; // If the element isn't a game button nothing happens.
  game.play(parseInt(index));
};

gameResetBtn.addEventListener("click", () => game.resetGame());
