function openForm() {
    document.querySelector(".form-popup").style.display = "flex";
};
function closeForm() {
    document.querySelector(".form-popup").style.display = "none";
};




//displayController handles the messages sent to 'div' class message in HTML
const displayController = (() => {
    const renderMessage = (message) => {
        document.querySelector(".message").textContent = message;
    }
    return {
        renderMessage,
    }
})();

const Gameboard = (() => {
    // Array to store gameboard
    let gameboard = ["", "", "", "", "", "", "", "", ""]

    // 'render' function renders the gameboard UI
    const render = () => {
        let boardHTML = "";
        gameboard.forEach((square, index) => {
            // Each section of array creates a div with class 'square'. Each square gets uniqe id based on index. The context of each array element is used for textcontext of each div (X or O).
            boardHTML += `<div class="square" id="square-${index}">${square}</div>`
        })
        //put each one of the created div's in the gamebaord (assigning the HTML not just text context). Next line needs to be included in curly brackets of 'render' for boardHTML to be accessible(because of scope)
        document.querySelector(".gameboard").innerHTML = boardHTML;
        const squares = document.querySelectorAll(".square");
        // attach an eventListener to each square
        squares.forEach((square) => {
            square.addEventListener("click", Game.handleClick);
            })
    }

    // 'update' function updates the 'gameboard' array & UI after each move
    //update the gamebaord. handleClick is giving us the arg for this 'update' function. First arg (index), handleClick gives us the index of the square we clicked. Second arg (value), handleClick gives us the value of the current players mark. 
    const update = (index, value) => {
        // next line assigns the value given from handleClick(mark) to the gameboard index value given from handleClick. This updates the gamboard array.
        gameboard[index] = value;
        // re run render() to show updated array values in UI
        render();
    }

    const removeBoard = () => {
        document.querySelector(".gameboard").innerHTML = "";
    }

    //used to access gameboard indirectly so we don't modify it 
    const getGameboard = () => gameboard;

    //You need to return items you want accessible outside Gameboard.
    return {
        render,
        update,
        getGameboard,
        removeBoard,
    }
})();

// FactoryFunction to create players
const createPlayer = (name, mark) => {
    return {
        name, 
        mark,
    }
}

//'Game' module handles the logic for the game
const Game = (() => {
    // next 3 variables just declare them. Set the contents under 'start'
    // Keep track of players
    let players = [];
    // Allows us to know which player is currently playing
    let currentPlayerIndex;
    // want to know when game is over
    let gameOver;

    // Handles game start functions 
    const start = () => {
        // Calls on 'createPlayer' FactoryFunction to make array
        players = [
            createPlayer(document.querySelector("#player1").value, "X"),
            createPlayer(document.querySelector("#player2").value, "O"),
        ]
        currentPlayerIndex = 0;
        gameOver = false;
        // call Gameboard.render module.
        Gameboard.render();
    }
    
    const handleClick = (event) => {
        // You can console.log the event to see different useful information about the event (see: target. This is where our unique id in boardHTML becomes useful)
        console.log(event);
        // use split function to split the id (square-#) at the '-'. We don't care about the square part of the id currently, Just which box index was clicked. split function gives an array, then we select [1] to focus on the square number(index). Since the id is a string, we use parseInt to turn the string into an interval
        let index = parseInt(event.target.id.split("-")[1]);

        //if statement to see if gameboard slot already has something in it at the given index. If it does, the function returns early, skipping the subsequent code.
        if(Gameboard.getGameboard()[index] !== "") {
            return;
        };
        
        console.log(`Square Index: ${index}`);
        console.log(`Current Player Index: ${currentPlayerIndex}`);

        Gameboard.update(index, players[currentPlayerIndex].mark)
        
        if(checkForWin(Gameboard.getGameboard())) {
            gameOver = true;
            displayController.renderMessage(`${players[currentPlayerIndex].name} Won!`);
        }
        if(checkForTie(Gameboard.getGameboard())) {
            gameOver = true;
            displayController.renderMessage('Tie Game!');
        }

        // changes currentPlayerIndex after each turn. If cPI === 0 then it assigns new value 1. if not 0 then it assigns 0.
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    }

    const restart = () => {
        for (let i = 0; i < 9; i++) {
            Gameboard.update(i, "");
        }
    const player1 = document.querySelector("#player1");
    const player2 = document.querySelector("#player2");
    player1.value = "";
    player2.value = "";
    players =['',''];
    Gameboard.removeBoard();
    currentPlayerIndex = 0;
    displayController.renderMessage("");
    }
    
    return {
        start,
        handleClick, 
        restart,
    }

})( );

function checkForTie(board) {
    //Checks to see if EVERY cell is empty. If so returns true
    return board.every(cell => cell !=="")
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
        // Next line is short hand. It links the current winning combinations array with a, b, c.
        // for example winningCombinations[2] a=6, b=7, c=8.
        const [a, b, c] = winningCombinations[i];
        //board[a] checks to make sure it atleast has a value. Then the rest checks to see if the board matches a winningCombination
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
}

const startButton = document.querySelector("#start-button");
startButton.addEventListener('click', ()=> {
    Game.start();
    closeForm();
});
const resetButton = document.querySelector("#reset-button");
resetButton.addEventListener('click', ()=> {
    Game.restart();
    openForm();
});
const openFormButton = document.querySelector("#open-form");
openFormButton.addEventListener('click', ()=> {
    openForm();
});
