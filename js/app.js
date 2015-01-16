var imageWidth = 101;
var rawImageHeight = 171;
var imagePaddingTop = 88;
var imageHeight = rawImageHeight - imagePaddingTop;

var maxEnemies = 5;
var lastBlockY = 2;
var minSpeed = 40;
var level = 1;
var paused = 0;

var moves = 0;
var totalMoves = 0;

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
    ctx.fillText("You've won in " + moves + " moves!", 10, 50);
    this.reset();
};

Player.prototype.render = function() {
    var offsetY = 10;

    ctx.drawImage(Resources.get(this.sprite), this.x, (this.y - offsetY));

    if(this.blockY === 0) {
        this.reset();
    }
};

Player.prototype.reset = function() {
    this.blockX = 2;
    this.blockY = 5;
    totalMoves += moves;
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

            if((playerHitLeft <= enemyHitRight) && (playerHitLeft >= enemyHitLeft)) {
                this.reset();
            }
            if((playerHitRight >= enemyHitLeft) && (playerHitRight <= enemyHitRight)) {
                this.reset();
            }
        }
    }
};

Player.prototype.handleInput = function(key) {
    if(!paused) {
        switch (key) {
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
            case 'restart':
                gameReset();
                break;
            case 'pause':
                paused = (paused + 1) % 2;
                break;
        }
    }
    else {
        switch (key) {
            case 'restart':
                gameReset();
                break;
            case 'pause':
                paused = (paused + 1) % 2;
                break;
        }
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
var player = new BoyBig();

var allEnemies = [];

gameReset();

function gameReset() {
    paused = 0;
    player.reset();

    for(var i = 0; i < maxEnemies; i++) {
        allEnemies[i] = new Enemy();
        allEnemies[i].reset();
    }
}

function gameStats() {

}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
// Added left handed navigation and R for restart, P for pause
document.addEventListener('keyup', function(e) {
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
        80: 'pause'
    };

    moves++;
    player.handleInput(allowedKeys[e.keyCode]);
});
