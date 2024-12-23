var view = {
    // метод получает строковое сообщение и выводит его
    // в области сообщений
    displayMessage: function(msg) {
        var messageElement = document.getElementById('messageArea');
        if (messageElement){
            messageElement.innerHTML = msg;
        }
    },
    displayHit: function(location) {
        var cell = document.getElementById(location);
        console.log(cell);
        if (cell){
            cell.setAttribute("class", "hit")
        }
    },
    displayMiss: function(location) {
        var cell = document.getElementById(location);
        if (cell){
            cell.setAttribute('class', 'miss')
        }
    }
};

var model = {
    // Number of ships in the game
    numShips: 3,
    // Length of each ship
    shipLength: 3,
    // Board size
    boardSize: 7,
    // Array to hold ship objects
    ships: [
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] }
    ],

    /**
     * Checks if a guess hits a ship.
     * @param {string} guess - The guessed location.
     * @returns {boolean} - True if hit, false if miss.
     */
    fire: function(guess) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);
            if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("HIT!");
                if (this.isSunk(ship)) {
                    view.displayMessage("You sank my battleship!");
                }
                return true;
            }
            
        }
        view.displayMiss(guess);
        view.displayMessage("You missed.");
        return false;
    },

    /**
     * Checks if a ship is sunk.
     * @param {object} ship - The ship object.
     * @returns {boolean} - True if the ship is sunk, false otherwise.
     */
    isSunk: function(ship) {
        for (var i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    },

    /**
     * Generates locations for all ships.
     */
    generateShipLocation: function() {
        for (var i = 0; i < this.numShips; i++) {
            do {
                var newShipLocations = this.generateShip();
            } while (this.collision(newShipLocations));
            this.ships[i].locations = newShipLocations;
        }
    },

    /**
     * Generates a new ship location.
     * @returns {array} - An array of locations for the new ship.
     */
    generateShip: function() {
        var positionShip = Math.floor(Math.random() * 2);
        var row, col;

        if (positionShip === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        } else {
            col = Math.floor(Math.random() * this.boardSize);
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        }

        var newShipLocations = [];
        for (var i = 0; i < this.shipLength; i++) {
            if (positionShip === 1) {
                newShipLocations.push(row + "" + (col + i));
            } else {
                newShipLocations.push((row + i) + "" + col);
            }
        }
        return newShipLocations;
    },

    /**
     * Checks if the generated ship locations collide with existing ships.
     * @param {array} locations - The generated ship locations.
     * @returns {boolean} - True if there is a collision, false otherwise.
     */
    collision: function(locations) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            for (var j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }
};

var controller = {
    // Number of guesses made by the player
    guesses: 0,

    /**
     * Processes the player's guess.
     * @param {string} guessedLocation - The guessed location.
     */
    processGuess: function(guessedLocation) {
        var location = parseGuess(guessedLocation);
        if (location) {
            this.guesses++;
            var hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
            }
        }
    }
};

/**
 * Parses the player's guess.
 * @param {string} guess - The player's guess.
 * @returns {string|null} - The parsed location or null if invalid.
 */
function parseGuess(guess) {
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
    if (guess === null || guess.length !== 2) {
        alert("Oops, please enter a letter and a number on the board.");
    } else {
        firstChar = guess.charAt(0);
        var row = alphabet.indexOf(firstChar);
        var column = guess.charAt(1);
        
        if (isNaN(row) || isNaN(column)) {
            alert("Oops, that isn't on the board.");
        } else if (row < 0 || row >= model.boardSize ||
            column < 0 || column >= model.boardSize) {
            alert("Oops, that's off the board!");
        } else {
            return row + column;
        }
    }
    return null;
};
function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocation();
};
function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
    fireButton.click();
    return false;
    }
};
function handleFireButton() {
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = "";
};
window.onload = init;