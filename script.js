'use strict'

const GameBoard = (function () {
    const board = [];

    for (let i = 0; i < 3; i++) {
        board[i] = [];
        for (let j = 0; j < 3; j++) {
            board[i].push(0);
        }
    }

    const resetBoard = () => {
        board.forEach((_, i) => {
            board[i] = [0, 0, 0];
        })
    }

    const getBoard = () => board;

    const placeMark = (row, collum, player) => {
        if (board[row][collum] === 0) {
            board[row][collum] = player.mark;
            return true;
        } else {
            return false;
        }
    }

    return { getBoard, placeMark, resetBoard };
})()

const createPlayer = (name, mark) => {
    return { name, mark };
}

const GameController = (function () {
    const players = [];
    let playingStatus = true;
    let activePlayer;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer;

    const getPlayingStatus = () => playingStatus;

    const initPlayers = (player1, player2) => {
        players.splice(0, players.length);
        players[0] = createPlayer(player1, 'X');
        players[1] = createPlayer(player2, 'O');
        activePlayer = players[0];
    }

    const playRound = (row, collum) => {
        if (GameBoard.placeMark(row, collum, activePlayer)) {
            const availableCell = GameBoard.getBoard().flat().filter(cell => cell === 0).length;
            if (availableCell !== 0) {
                const board = GameBoard.getBoard();
                // check win by row
                board.forEach(row => {
                    if (!row.includes(0) && row[0] === row[1] && row[1] === row[2]) {
                        playingStatus = false;
                    }
                });
                // by collumn
                for (let i = 0; i < 3; i++) {
                    if (board[0][i] !== 0 && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
                        playingStatus = false;
                    }
                }
                // diagonally
                if (board[0][0] !== 0 && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
                    playingStatus = false;
                }
                if (board[0][2] !== 0 && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
                    playingStatus = false;
                }

                if (!playingStatus) {
                    ScreenController.showWinMessage();
                }

            } else {
                // draw
                playingStatus = false;
                ScreenController.showDrawMessage();
            }
            switchPlayerTurn();
        }
    }

    const newGame = () => {
        GameBoard.resetBoard();
        playingStatus = true;
        activePlayer = players[0];
    }

    // printNewRound();
    return { getActivePlayer, playRound, initPlayers, getPlayingStatus, newGame }
})()

const ScreenController = (function () {
    // element
    const bntStart = document.querySelector(".btn-start");
    const btnRestart = document.querySelector(".btn-restart");
    const inputNameOne = document.querySelector(".names__input--one");
    const inputNameTwo = document.querySelector(".names__input--two");
    const divStartGame = document.querySelector(".new-game");
    const divMain = document.querySelector("main");
    const labelPlayer1 = document.querySelectorAll(".scores__label")[0];
    const labelPlayer2 = document.querySelectorAll(".scores__label")[1];
    const boardCells = document.querySelectorAll(".board__cell");
    const winMessage = document.querySelector(".message");

    // function
    const updateBoard = () => {
        let idx = 0;
        GameBoard.getBoard()?.forEach(row => {
            row.forEach(cell => {
                if (cell != 0) {
                    boardCells[idx].textContent = cell;
                    if (cell === 'X') {
                        // boardCells[idx].classList.add("board__cell--x");
                        boardCells[idx].style.color = "#E0500C";
                    } else {
                        // boardCells[idx].classList.add("board__cell--o");
                        boardCells[idx].style.color = "#3B9C36";
                    }
                } else {
                    boardCells[idx].textContent = '';
                }
                idx++
            })
        })
    }

    const showWinMessage = () => {
        winMessage.textContent = `${GameController.getActivePlayer().name} Win!`;
        winMessage.classList.toggle("hidden");
        btnRestart.classList.toggle("hidden");
    }

    const showDrawMessage = () => {
        winMessage.textContent = "It's a Tie";
        winMessage.classList.toggle("hidden");
        btnRestart.classList.toggle("hidden");
    }

    // event handler
    bntStart.addEventListener("click", function () {
        if (inputNameOne.value !== '' && inputNameTwo.value !== '') {
            GameController.initPlayers(inputNameOne.value, inputNameTwo.value);
            labelPlayer1.textContent = inputNameOne.value
            labelPlayer2.textContent = inputNameTwo.value
            divStartGame.classList.toggle("hidden");
            divMain.classList.toggle("hidden");
        }
    })

    boardCells.forEach(cell => {
        cell.addEventListener('click', function (e) {
            if (GameController.getPlayingStatus()) {
                const currRow = e.target.getAttribute("data-row");
                const currColumn = e.target.getAttribute("data-column");
                GameController.playRound(currRow - 1, currColumn - 1);
                updateBoard();
            }
        })
    })

    btnRestart.addEventListener('click', function () {
        GameController.newGame();
        updateBoard();
        winMessage.classList.toggle("hidden");
        btnRestart.classList.toggle("hidden");
    })

    return { showWinMessage, showDrawMessage };
})()