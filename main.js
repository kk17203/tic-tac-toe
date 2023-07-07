const formController = (() => { // handles functions related to form
    function openForm() {
        document.querySelector(".form-popup").style.display = "flex";
    };
    function closeForm() {
        document.querySelector(".form-popup").style.display = "none";
    };
    return {
        openForm,
        closeForm,
    }
})();

const displayController = (() => { // handles messages sent to 'div.message' in HTML
    const renderMessage = (message) => {
        document.querySelector(".message").textContent = message;
        document.querySelector(".message").style.display = 'block';
    }
    return {
        renderMessage,
    }
})();

const Gameboard = (() => {
    let gameboard = ["", "", "", "", "", "", "", "", ""] // stores gameboard content

    const render = () => { // renders the gameboard to UI
        let boardHTML = "";
        gameboard.forEach((square, index) => { //Each section of array creates a div with class 'square', assigns uniqe id based on index. The context of each array element is used for textcontext of each div (X or O or "").
            boardHTML += `<div class="square" id="square-${index}">${square}</div>`
        })
        document.querySelector(".gameboard").innerHTML = boardHTML; //put each one of the created div's in the gamebaord (assigning the HTML not just text context)

        const squares = document.querySelectorAll(".square");
        squares.forEach((square) => { // attach eventListener to each square
            square.addEventListener("click", Game.handleClick);
            })
    }

    const update = (index, value) => { // updates the 'gameboard' array & UI after each move. 'handleClick() gives us the arguements
        gameboard[index] = value; // updates the 'gameboard' array. handleClick gives it the value to assign to certain index
        render(); // re-render to show updated array in UI
    }

    const removeBoard = () => {
        document.querySelector(".gameboard").innerHTML = "";
    }

    const getGameboard = () => gameboard; //used to access gameboard indeirectly so we don't modify it

    return {
        render,
        update,
        getGameboard,
        removeBoard,
    }
})();

const createPlayer = (name, mark) => { //FactoryFunction to create players
    return {
        name, 
        mark,
    }
}

const Game = (() => { //handles the logic for the game
    // next 3 variables just declare them. Set the contents under 'start'
    let players = []; //array to keep track of created players
    let currentPlayerIndex; //allows us to know which players turn it is

    const start = () => { //handles game start process
        players = [ //calls on 'createPlayer' to make player array
            createPlayer(document.querySelector("#player1").value, "X"),
            createPlayer(document.querySelector("#player2").value, "O"),
        ]
        currentPlayerIndex = 0;
        Gameboard.render();
    }
    
    const handleClick = (event) => {
        console.log(event); // You can console.log the event to see different useful information about it (see: target. This is where our unique id in boardHTML becomes useful)
        let index = parseInt(event.target.id.split("-")[1]); //.split splits the id (square-#) at the '-' into an array. Don't need the pre-dash. Just index. Then we select[1] (focus on square number index. id is a string so use parseInt to turn into interval.

        if(Gameboard.getGameboard()[index] !== "") { //checks if gameboard slot at given index has content. If true handleClick ends. Skipping subsequent code
            return;
        };
        
        console.log(`Square Index: ${index}`);
        console.log(`Current Player Index: ${currentPlayerIndex}`);

        Gameboard.update(index, players[currentPlayerIndex].mark)
        
        if (checkForWin(Gameboard.getGameboard())) {
            displayController.renderMessage(`${players[currentPlayerIndex].name} Won!`)
        } else if (checkForTie(Gameboard.getGameboard())) {
            displayController.renderMessage('Tie Game!')
        };

        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0; // changes currentPlayerIndex after each turn. If cPI === 0 then it assigns new value 1. if not 0 then it assigns 0
    }

    const restart = () => {
        for (let i = 0; i < 9; i++) {
            Gameboard.update(i, "");
        }
    const player1 = document.querySelector("#player1");
    const player2 = document.querySelector("#player2");
    player1.value = "";
    player2.value = "";
    Gameboard.removeBoard();
    currentPlayerIndex = 0;
    displayController.renderMessage("");
    document.querySelector(".message").style.display = 'none';
    }

    const rematch = () => {
        for (let i = 0; i < 9; i++) {
            Gameboard.update(i, "");
        }
    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    displayController.renderMessage("");
    document.querySelector(".message").style.display = 'none';
    }
    
    return {
        start,
        handleClick, 
        restart,
        rematch,
    }

})( );

function checkForTie(board) {
    return board.every(cell => cell !=="") //Checks to see if EVERY cell is empty. If so returns true
}

function checkForWin(board) {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7 ,8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]
    for(let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i]; //short hand. Links current winning combinations array w/ a, b, c. (winningCombinations[2] a=6,b=7,c=8)
        if (board[a] && board[a] === board[b] && board[a] === board[c]) { //board[a] makes sure it has a value. Rest checks if the board matches a winningCombination
            return true;
        }
    }
}

const submitButton = document.querySelector("#submit-button");
submitButton.addEventListener('click', ()=> {
    event.preventDefault();
    Game.start();
    formController.closeForm();
});
const resetButton = document.querySelector("#reset-button");
resetButton.addEventListener('click', ()=> {
    Game.restart();
    formController.openForm();
});
const startButton = document.querySelector("#start-button");
startButton.addEventListener('click', ()=> {
    formController.openForm();
});
const rematchButton = document.querySelector('#rematch');
rematchButton.addEventListener('click', ()=> {
    Game.rematch();
});