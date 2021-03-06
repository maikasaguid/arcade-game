var imageHeightRaw = 171,
    imagePaddingTop = 88,
    imageHeight = imageHeightRaw - imagePaddingTop;

var winLevel = 10,
    level = 0,
    lastBlockY = 2;

var maxEnemies,
    minSpeed,
    paused,
    countdown,
    mode;

var canvas2 = document.createElement('canvas'),
    ctx2 = canvas2.getContext('2d');

canvas2.width = numCols * imageWidth;
canvas2.height = numRows * imageHeightCanvas;
canvas2.setAttribute("class", "top");
document.getElementById('game').appendChild(canvas2);


// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = imageWidth * -1;
    this.y = 1;
    this.speed = 100;
    this.paddingLeft = 2;
    this.paddingRight = 3;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    var distance = 0;

    if(!paused) {
        if(this.x > 601) {
            this.reset();
        }
        else {
            distance = this.speed * dt;
            this.x += distance;
        }

        this.y = this.blockY * imageHeight;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    var offset = 25;

    ctx.drawImage(Resources.get(this.sprite), this.x, (this.y - offset));
};

// Reset Enemy position
Enemy.prototype.reset = function() {
    this.x = Math.floor(Math.random() * -1010) - imageWidth;
    this.blockY = Math.floor((Math.random() * 3) + 1);
    this.speed = Math.floor((Math.random() * 100) + minSpeed);

    if(this.blockY == lastBlockY) {
        this.blockY = (this.blockY % 3) + 1;
    }

    lastBlockY = this.blockY;
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.blockX = 2;
    this.blockY = 5;
    this.lives = 4;
    this.paddingLeft = 18;
    this.paddingRight = 17;
    this.sprite = 'images/char-boy.png';
};

// Checks for collosion or if level was completed
Player.prototype.update = function() {
    if(!paused) {
        this.x = this.blockX * imageWidth;
        this.y = this.blockY * imageHeight;

        this.collisionDetection();

        if(this.blockY === 0) gameLevel(); //beat the level
    }
};

Player.prototype.render = function() {
    var offsetY = 10;

    var heartImg = 'images/Heart.png',
        heartWidth = 50;

    var message = "LEVEL " + level;

    if(mode == 2) {
        for(var i=0; i<this.lives; i++) {
            ctx.drawImage(Resources.get(heartImg), i * heartWidth, 540, heartWidth, heartWidth);
        }

        ctx2.clearRect(5, (imageHeight * 7) - 60, 100, 25);
        ctx2.font = "20px Arial";
        ctx2.textAlign = "start";
        ctx2.lineWidth = 2;
        ctx2.strokeStyle = "green";
        ctx2.fillStyle = "white";
        ctx2.strokeText(message, 5, (imageHeight * 7) - 40);
        ctx2.fillText(message, 5, (imageHeight * 7) - 40);

        ctx.drawImage(Resources.get(this.sprite), this.x, (this.y - offsetY));
    }
};

Player.prototype.reset = function() {
    this.blockX = 2;
    this.blockY = 5;
};

// Figure out if the Player and Enemy are occupying the same space
Player.prototype.collisionDetection = function() {
    var playerHitLeft = this.x + this.paddingLeft;
    var playerHitRight = this.x + imageWidth - this.paddingRight;
    var enemyHitLeft = 0;
    var enemyHitRight = 0;

    for(var i = 0; i < maxEnemies; i++) {
        if(allEnemies[i].blockY == this.blockY) {
            enemyHitLeft = allEnemies[i].x + allEnemies[i].paddingLeft;
            enemyHitRight = allEnemies[i].x + imageWidth - allEnemies[i].paddingRight;

            if(((playerHitLeft <= enemyHitRight) && (playerHitLeft >= enemyHitLeft)) || ((playerHitRight >= enemyHitLeft) && (playerHitRight <= enemyHitRight))) {
                this.lives--;

                if(this.lives > 0) this.reset();
                else gameEnd();
            }
        }
    }
};

Player.prototype.handleInput = function(key) {
    switch(mode) {
        case 1: //gameChoose
            switch(key) {
                case '1':
                    player = new Boy();
                    break;
                case '2':
                    player = new BoyBig();
                    break;
                case '3':
                    player = new GirlCat();
                    break;
                case '4':
                    player = new GirlHorn();
                    break;
                case '5':
                    player = new GirlPrincess();
                    break;
                case '6':
                    player = new GirlPink();
                    break;
            }

            if(key >= 1 && key <= 6) gameStart();

            break;
        case 2: //Regular game play
            if(!paused && !countdown) {
                switch(key) {
                    case 'left':
                        if (this.blockX === 0) this.blockX = 0;
                        else this.blockX -= 1;
                        break;
                    case 'up':
                        if(this.blockY === 0) this.blockY = 0;
                        else this.blockY -= 1;
                        break;
                    case 'right':
                        if(this.blockX === 4) this.blockX = 4;
                        else this.blockX += 1;
                        break;
                    case 'down':
                        if(this.blockY === 5) this.blockY = 5;
                        else this.blockY += 1;
                        break;
                    case 'pause':
                        gamePaused();
                        break;
                }
            }
            else {
                if(!countdown) {
                    switch(key) {
                        case 'restart':
                            gameRestart();
                            break;
                        case 'pause':
                            paused = 0;
                            ctx2.clearRect (0, 0, canvas2.width, canvas2.height); //clear top canvas
                            break;
                    }
                }
            }
            break;
        case 3: //Completed Level
            if(key === 'enter') {
                gameReset();
                gameCountdown();
            }
            break;
        case 4: //End of Game
            if(key === 'enter') gameRestart();
            break;
    }
};

var Boy = function() {
    Player.call(this);
    this.sprite = 'images/char-boy.png';
};
Boy.prototype = Object.create(Player.prototype);

var BoyBig = function() {
    Player.call(this);
    this.lives = 6;
    this.paddingLeft = 2;
    this.paddingRight = 1;
    this.sprite = 'images/char-big-boy.png';
};
BoyBig.prototype = Object.create(Player.prototype);

var GirlCat = function() {
    Player.call(this);
    this.sprite = 'images/char-cat-girl.png';
};
GirlCat.prototype = Object.create(Player.prototype);

var GirlHorn = function() {
    Player.call(this);
    this.lives = 5;
    this.paddingLeft = 7;
    this.sprite = 'images/char-horn-girl.png';
};
GirlHorn.prototype = Object.create(Player.prototype);

var GirlPrincess = function() {
    Player.call(this);
    this.paddingLeft = 14;
    this.paddingRight = 14;
    this.sprite = 'images/char-princess-girl.png';
};
GirlPrincess.prototype = Object.create(Player.prototype);

var GirlPink = function() {
    Player.call(this);
    this.paddingLeft = 14;
    this.paddingRight = 13;
    this.sprite = 'images/char-pink-girl.png';
};
GirlPink.prototype = Object.create(Player.prototype);

/* Initialize variables for a fresh new game and calls gameChoose */
function gameRestart() {
    maxEnemies = 8;
    minSpeed = 20;
    paused = 0;
    countdown = 0;
    mode = 1;

    gameReset();

    if(level > 0) gameChoose();

    if(level === -1) level = winLevel; //For testing the last level
    else level = 1;
}

/* Clears out enemies array then resets each one as well as the
 * player
 */
function gameReset() {
    allEnemies = [];
    if(level > 1) paused = 0;
    player.reset();

    for(var i = 0; i < maxEnemies; i++) {
        allEnemies[i] = new Enemy();
        allEnemies[i].reset();
    }

    ctx2.clearRect(0, 0, canvas2.width, canvas2.height); //clear top canvas
}

/* Draws all characters to the top canvas along with a number so the
 * user can choose what character they would like to play as.
 */
function gameChoose() {
    var allCharacters = [
        [
            new Boy(),
            new GirlHorn()
        ],
        [
            new BoyBig(),
            new GirlPrincess()
        ],
        [
            new GirlCat(),
            new GirlPink()
        ]
    ];
    var xOffset = imageWidth,
        yOffset = imageHeight - 20;
    var charNum = 1,
        charX = 0,
        charY = 0;

    paused = 1;

    ctx2.font = "50px Arial";
    ctx2.lineWidth = 1;
    ctx2.strokeStyle = "gray";
    ctx2.fillStyle = "white";

    for(var y=0; y<2; y++) { //Display all characters with numbers to choose from
        for(var x=0; x<3; x++) {
            charX = xOffset + (x * imageWidth);
            charY = yOffset + (y * imageHeightRaw);

            ctx2.drawImage(Resources.get(allCharacters[x][y].sprite), charX, charY);

            ctx2.fillText(charNum, charX, charY + 150);
            ctx2.strokeText(charNum, charX, charY + 150);

            charNum++;
        }
    }

    ctx2.font = "bold 36px Arial";
    ctx2.textAlign = "center";
    ctx2.fillStyle = "black";
    ctx2.fillText("Select your character (1-6)", canvas2.width / 2, charY + 35);
}

/* Set the game up to be played and call the countdown */
function gameStart() {
    mode = 2;
    paused = 0;
    ctx2.clearRect (0, 0, canvas2.width, canvas2.height); //clear top canvas

    gameCountdown();
}

/* Countdown from 3 before each level to ensure enemies are showing up
 * on screen before the player can make a move.
 */
function gameCountdown() {
    var countdownNum = 3;
    countdown = 1; //set flag
    mode = 2;

    var timer = setInterval(function() {
        ctx2.clearRect((canvas2.width / 2) - 20, 390, 40, 60); //clear countdown numbers
        ctx2.font = "60px Arial";
        ctx2.textAlign = "center";
        ctx2.fillStyle = "white";
        ctx2.lineWidth = 1;
        ctx2.strokeStyle = "green";

        if(countdownNum <= 0) {
            clearInterval(timer);
            countdown = 0;
        }
        else {
            ctx2.fillText(countdownNum, canvas2.width / 2, 440);
            ctx2.strokeText(countdownNum, canvas2.width / 2, 440);
            countdownNum--;
        }
    }, 1000);
}

/* After the level has been completed figure out if they have won
 * the game and get input to continue.
 */
function gameLevel() {
    var message;
    mode = 3;
    paused = 1; //set flag

    ctx2.clearRect (0, 0, canvas2.width, canvas2.height); //clear top canvas
    ctx2.font = "bold 36px Arial";
    ctx2.textAlign = "center";
    ctx2.lineWidth = 1;
    ctx2.strokeStyle = "gray";

    if(level === winLevel) {
        message = "You've won the game!";
        ctx2.fillText(message, canvas2.width / 2, 200);
        ctx2.strokeText(message, canvas2.width / 2, 200);

        mode = 4;
    }
    else {
        message = "Level " + level + " complete!";
        ctx2.fillText(message, canvas2.width / 2, 200);
        ctx2.strokeText(message, canvas2.width / 2, 200);

        level++;
        maxEnemies+=2;
        minSpeed+=20;
    }

    message = "Press return/enter to continue...";
    ctx2.font = "bold 16px Arial";
    ctx2.lineWidth = 2;
    ctx2.strokeStyle = "black";
    ctx2.strokeText(message, canvas2.width / 2, 250);
    ctx2.fillText(message, canvas2.width / 2, 250);
}

/* When the user runs out of lives for the Player */
function gameEnd() {
    var message;

    mode = 4;
    paused = 1; //set flag

    ctx2.clearRect (0, 0, canvas2.width, canvas2.height); //clear top canvas
    ctx2.font = "bold 36px Arial";
    ctx2.textAlign = "center";
    ctx2.lineWidth = 1;
    ctx2.strokeStyle = "gray";
    message = "You've lost the game.";
    ctx2.fillText(message, canvas2.width / 2, 200);
    ctx2.strokeText(message, canvas2.width / 2, 200);

    ctx2.font = "bold 16px Arial";
    ctx2.lineWidth = 2;
    ctx2.strokeStyle = "black";
    message = "Press return/enter to continue...";
    ctx2.strokeText(message, canvas2.width / 2, 250);
    ctx2.fillText(message, canvas2.width / 2, 250);
}

/* Message for a paused game */
function gamePaused() {
    var message;
    paused = 1; //set flag

    ctx2.clearRect (0, 0, canvas2.width, canvas2.height); //clear top canvas
    ctx2.font = "bold 36px Arial";
    ctx2.textAlign = "center";
    ctx2.lineWidth = 1;
    ctx2.strokeStyle = "gray";
    message = "PAUSED";
    ctx2.fillText(message, canvas2.width / 2, 200);
    ctx2.strokeText(message, canvas2.width / 2, 200);

    ctx2.font = "bold 16px Arial";
    ctx2.lineWidth = 2;
    ctx2.strokeStyle = "black";
    message = "Press 'P' to unpause or 'R' to restart the game.";
    ctx2.strokeText(message, canvas2.width / 2, 250);
    ctx2.fillText(message, canvas2.width / 2, 250);
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();
var allEnemies = [];

gameRestart(); // set intial variables, clear player and enemies

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
// Also includes left handed navigation, numbers 1-6, R for restart, and P for pause
// Prevents window scroll for smaller screens
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        65: 'left',
        87: 'up',
        68: 'right',
        83: 'down',
        82: 'restart',
        80: 'pause',
        13: 'enter',
        49: '1',
        50: '2',
        51: '3',
        52: '4',
        53: '5',
        54: '6'
    };

    if([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }

    player.handleInput(allowedKeys[e.keyCode]);
});
