'use strict'

const GameBoard = (function () {
    const board = [];

    for (let i = 0; i < 3; i++) {
        board[i] = [];
        for (let j = 0; j < 3; j++) {
            board[i].push(0);
        }
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

    const printBoard = () => {
        console.log(board);
    }

    return { getBoard, placeMark, printBoard };
})()

const createPlayer = (name, mark) => {
    return { name, mark };
}

const GameController = (function () {
    const players = [
        createPlayer('One', 'X'),
        createPlayer('Two', 'O')
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        GameBoard.printBoard();
        console.log(`${activePlayer.name}'s turn.`);
    }

    const playRound = (row, collum) => {
        if (GameBoard.placeMark(row, collum, activePlayer)) {
            const availableCell = GameBoard.getBoard().flat().filter(cell => cell === 0).length;
            if (availableCell !== 0) {
                const board = GameBoard.getBoard();
                let isWin = false;
                // check win
                // by row
                board.forEach(row => {
                    if (!row.includes(0) && row[0] === row[1] && row[1] === row[2]) {
                        isWin = true;
                        console.log('W I N ! ! !');
                    }
                });
                // by collumn
                for (let i = 0; i < 3; i++) {
                    if (board[0][i] !== 0 && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
                        isWin = true;
                        console.log('W I N ! ! !');
                    }
                }
                // diagonally
                if (board[0][0] !== 0 && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
                    isWin = true;
                    console.log('W I N ! ! !');
                }
                if (board[0][2] !== 0 && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
                    isWin = true;
                    console.log('W I N ! ! !');
                }
            } else {
                // draw
            }
            switchPlayerTurn();
        }
        printNewRound();
    }

    printNewRound();
    return { getActivePlayer, playRound }
})()

