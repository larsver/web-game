var myGamePiece;
var myObstacles = [];
var myHoneyJars = [];
var myLevel;
var myScore;

var startdiv;
var nextlevelButton;
var gameLevel;
var score;
var intervalLevel
var maxAantObstacles;

var lv ;
var ma ;
var intval ;
var sc ;

// init function onload body
function init(){
    startdiv = document.getElementById('startdiv');

    lv = document.getElementById('level');
    ma = document.getElementById('maxaant');
    intval = document.getElementById('interval');
    sc = document.getElementById('score');

    nextlevelButton = document.getElementById('nextlevelbutton');
    nextlevelButton.style.display = 'none';
    gameLevel = 1;
    score = 0;
    intervalLevel = 300;
    maxAantObstacles = 10;
}

// start game onclick startbutton
function startGame() {
    startdiv.style.display = 'none';
    // myGamePiece = new component(30, 30, "red", 10, 120);
    myGameArea.start();
    myGamePiece = new component(myGameArea.canvas.width/16, myGameArea.canvas.height/8, "bear.png", 10, 120, "image");
    myLevel = new component("30px", "Consolas", "black", 40, 40, "text");
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");

    lv.innerText = gameLevel;
    ma.innerText = maxAantObstacles;
    intval.innerText = intervalLevel;
    sc.innerText = score;

    document.addEventListener('keydown', event => {
        if (event.key == 'ArrowLeft') {
            moveleft();
        } 
        else if (event.key == 'ArrowUp') {
            moveup();
        } 
        else if (event.key == 'ArrowRight') {
            moveright();
        } 
        else if (event.key == 'ArrowDown') {
            movedown();
        }
        else if (event.key == ' '){
            movestop();
        }
    });  
}

function startNextLevel() {
    nextlevelButton.style.display = 'none';
    myGameArea.restart();
}

function nextLevel() {
    intervalLevel -= 2*gameLevel;
    if (intervalLevel < 60) {
        intervalLevel = 60 ;
    }
    maxAantObstacles += 2;
    gameLevel += 1;
    myObstacles.length = 0 ;
    score += 10 ;

    lv.innerText = gameLevel;
    ma.innerText = maxAantObstacles;
    intval.innerText = intervalLevel;
    sc.innerText = score;

    clearInterval(myGameArea.interval);
    myGameArea.stop();
    nextlevelButton.style.display = 'block';
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth
            this.canvas.height = window.innerHeight
          })
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    },
    restart : function() {
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    }

}
function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
  }

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } 
        else if (this.type == 'image') {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
        else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0){
            this.speedX = 0;
        }    
        if (this.y < 0){
            this.speedY = 0;
        }
        if (this.x > myGameArea.canvas.width-this.width) {
            this.speedX = 0;
        }
        if (this.y > myGameArea.canvas.height-this.height) {
            this.speedY = 0 ;
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
          crash = false;
        }
        return crash;
      }
}

function updateGameArea() {
    var x, y;
    for (i = 0; i < myObstacles.length; i += 1) { //check if crashe with obstacles
      if (myGamePiece.crashWith(myObstacles[i])) {
        myGameArea.stop();
        return;
      }
    }
    for (i = 0; i < myHoneyJars.length; i += 1) { //check if crash with honeyjar
        if (myGamePiece.crashWith(myHoneyJars[i])) {
          score += 1
          myHoneyJars.splice(i,1);
          return;
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if ((myGameArea.frameNo == 1 || everyinterval(intervalLevel)) && myObstacles.length<maxAantObstacles) {
        x = myGameArea.canvas.width;
        minHeight = 50;
        maxHeight = 400;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 200;
        maxGap = 400;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(10, height, "green", x, 0));
        myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
        myHoneyJars.push(new component(myGameArea.canvas.width/30, myGameArea.canvas.height/15, "honeyjar.png", x, height + gap/3, "image"));
      }
    for (i = 0; i < myObstacles.length; i += 1) {
      myObstacles[i].x += -2;
      myObstacles[i].update();
    }
    for (i = 0; i < myHoneyJars.length; i += 1) {
        myHoneyJars[i].x += -2;
        myHoneyJars[i].update();
      }
    myGamePiece.newPos();
    myGamePiece.update();
    myLevel.text = "LEVEL: " + gameLevel;
    myLevel.update();
    myScore.text = "Score: " + score;
    myScore.update();
    if (typeof myObstacles[maxAantObstacles-1] !== "undefined" && myObstacles[maxAantObstacles-1].x < 0 ) {
        console.log("nextlevel");
        nextLevel();
    }
  }

function moveup() {
    myGamePiece.speedY = -2;
}

function movedown() {
    myGamePiece.speedY = 2; 
}

function moveleft() {
    myGamePiece.speedX = -2; 
}

function moveright() {
    myGamePiece.speedX = 2; 
}

function movestop() {
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
}