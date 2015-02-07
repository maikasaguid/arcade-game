var imageWidth = 101,
    rawImageHeight = 171,
    imagePaddingTop = 88,
    imageHeight = rawImageHeight - imagePaddingTop;

var maxEnemies = 5,
    lastBlockY = 2,
    minSpeed = 40,
    level = 1,
    paused = 1;
    mode = 1;

var moves = 0;

var canvas2 = document.createElement('canvas'),
    ctx2 = canvas2.getContext('2d');

canvas2.width = 505;
canvas2.height = 606;
canvas2.setAttribute("class", "stats");
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

    if(!paused) ctx.drawImage(Resources.get(this.sprite), this.x, (this.y - offset));
};

//Reset Enemy position
Enemy.prototype.reset = function() {
    this.x = Math.floor(Math.random() * -505) - 101;
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
    this.level = 1;
    this.lives = 4;
    this.paddingLeft = 18;
    this.paddingRight = 17;
    this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function() {
    if(!paused) {
        this.x = this.blockX * imageWidth;
        this.y = this.blockY * imageHeight;

        this.collisionDetection();

        if(this.blockY === 0 && moves >= 5) this.winner();
    }
};

Player.prototype.winner = function() {
    ctx2.font = "40px Arial";
    ctx2.fillStyle = "black";
    ctx2.fillText("Level " + level + " complete!", 100, 50);
    this.reset();
    this.level++;
};

Player.prototype.render = function() {
    var offsetY = 10;

    var heartImg = 'images/Heart.png',
        heartWidth = 50;

    var message = "LEVEL " + this.level;

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
    moves = 0;
};

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
                this.reset();
            }
        }
    }
};

Player.prototype.handleInput = function(key) {
    switch(mode) {
        case 1:
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

            if(key >= 1 && key <= 6) {
                mode = 2;
                paused = 0;
                ctx2.clearRect (0, 0, canvas2.width, canvas2.height);
            }

            break;
        case 2:
            if(!paused) {
                switch(key) {
                    case 'left':
                        if (this.blockX === 0) this.blockX = 0;
                        else this.blockX -= 1;
                        moves++;
                        break;
                    case 'up':
                        if(this.blockY === 0) this.blockY = 0;
                        else this.blockY -= 1;
                        moves++;
                        break;
                    case 'right':
                        if(this.blockX === 4) this.blockX = 4;
                        else this.blockX += 1;
                        moves++;
                        break;
                    case 'down':
                        if(this.blockY === 5) this.blockY = 5;
                        else this.blockY += 1;
                        moves++;
                        break;
                    case 'restart':
                        gameReset();
                        break;
                    case 'pause':
                        paused = (paused + 1) % 2;
                        break;
                }
            }
            else {
                switch(key) {
                    case 'restart':
                        gameReset();
                        break;
                    case 'pause':
                        paused = (paused + 1) % 2;
                        break;
                }
            }
            break;
        case 3:
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

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();
var allEnemies = [];

gameReset();


function gameReset() {
    player.reset();

    for(var i = 0; i < maxEnemies; i++) {
        allEnemies[i] = new Enemy();
        allEnemies[i].reset();
    }
}

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
    var message = "Select your character (1-6)";

    
    ctx2.font = "50px Arial";
    ctx2.lineWidth = 1;
    ctx2.strokeStyle = "gray";
    ctx2.fillStyle = "white";

    for(var y=0; y<2; y++) {
        for(var x=0; x<3; x++) {
            charX = xOffset + (x * imageWidth);
            charY = yOffset + (y * rawImageHeight);

            ctx2.drawImage(Resources.get(allCharacters[x][y].sprite), charX, charY);

            ctx2.fillText(charNum, charX, charY + 150);
            ctx2.strokeText(charNum, charX, charY + 150);

            charNum++;
        }
    }

    ctx2.font = "bold 36px Arial";
    ctx2.textAlign = "center";
    ctx2.fillStyle = "black";
    ctx2.fillText(message, canvas2.width / 2, charY + 35);
}

function gameEnd() {

}

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
