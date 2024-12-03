// переменые лоя хронение локатции корабля
var location1 = 3;
var location2 = 4;
var location3 = 5;

// текущей координаты выстрела
var guess;
// количества попаданий
var hits = 0;
// количества попыток
var guesses = 0;
// потоплен корабль или нет
var isSunk = false

while (isSunk == false){
    // ПОЛУЧИТЬ координаты выстрела
    guess = prompt("Ready, aim, fire! (enter a number 0-6):");

    // проверить корректность ввода
    if (guess < 0 || guess > 6){
        alert("Please enter a valid cell number!");    
    }else{
        guesses += 1;

        if (guess == location1 || guess == location2 || guess == location3){
            hits += 1;
            alert("HIT!")
            if (hits == 3){
                isSunk = true;
                alert("You sank my battleship!");
            }
        }else{
            alert("MISS :)")
        }
    }
}

var stats = "You took " + guesses + " guesses to sink the battleship, " +
 "which means your shooting accuracy was " + (3/guesses);
alert(stats);