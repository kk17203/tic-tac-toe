const Gameboard = (() => {
    // Array to store gameboard
    let gameboard = ["", "", "", "", "", "", "", "", ""]

        // render is the way to display the gameboard
    const render = () => {
        let boardHTML = "";
        gameboard.forEach((square, index) => {
            // Each section of array creates a div with class 'square'. Each one gets uniqe id based on index. The contect of each array element is used for textcontect of each array (X or O).
            boardHTML += `<div class="square" id="square-${index}">${square}</div>`
        })
        //put each one of the created div's in the gamebaord (assigning the HTML not just text content). Next line needs to be included in curly brackets of 'render' for boardHTML to be accessible(because of scope)
        document.querySelector(".gameboard").innerHTML = boardHTML;
        const squares = document.querySelectorAll(".square");
        // attach an eventListener to each square
        squares.forEach((square) => {
            square.addEventListener("click", Game.handleClick);
            })
    }

    //update the gamebaord. handleClick is giving use the arg for this 'update' function. First arg (index), handleClick gives us the index of the square we clicked. Second arg (value), handleClick gives us the value of the current players mark. 
    const update = (index, value) => {
        // next line assigns the value given from handleClick(mark) to the gameboard index value given from handleClick. This updates the gamboard array.
        gameboard[index] = value;
        // re run render() to show updated array values in UI
        render();
    }

    //used to access gameboard indirectly so we don't modify it 
    const getGameboard = () => gameboard;

    //You need to return items you want accessible outside Gameboard.
    return {
        render,
        update,
        getGameboard,
    }
})();

// make a Factory to create players
const createPlayer = (name, mark) => {
    return {
        name, 
        mark,
    }
}

const Game = (() => {
    // next 3 variables just declare them. Set the contents under 'start'
    // Keep track of players
    let players = [];
    // Allows us to know which player is currently playing
    let currentPlayerIndex;
    // want to know when game is over
    let gameOver;

    //Call on createPlayer Factory 
    const start = () => {
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
        
        // changes currentPlayerIndex after each turn. If cPI === 0 then it assigns new value 1. if not 0 then it assigns 0.
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    }
    
    return {
        start,
        handleClick, 
    }

})( );


const startButton = document.querySelector("#start-button");
startButton.addEventListener('click', ()=> {
    Game.start();
});
const resetButton = document.querySelector("#reset-button");
resetButton.addEventListener('click', ()=> {
    alert('reset')
});