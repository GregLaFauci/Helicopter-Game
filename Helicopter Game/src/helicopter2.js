/*jshint esversion: 6*/
/*======================
        OBJECTS
======================*/
//default object for background util
const DEFAULTS = {
  X_POS: 0,
  Y_POS: 0,
  WIDTH: 1400,
  HEIGHT: 1000,
  SPEED: -1
};

//backgroun object
class Background {
  constructor(options = {}) {
    this.xPos = DEFAULTS.X_POS;
    this.yPos = DEFAULTS.Y_POS;
    this.width = DEFAULTS.WIDTH;
    this.height = DEFAULTS.HEIGHT;
    this.speed = DEFAULTS.SPEED;
  }

  draw(ctx) {
    const imageRepository = new function () {
      this.background = new Image();
      this.background.src = "assets/mountain.png";
    }();
    const imageRepositoryFlip = new function () {
      this.background = new Image();
      this.background.src = "assets/mountainFlip.png";
    }();

    ctx.drawImage(
      imageRepository.background,
      this.xPos,
      this.yPos,
      this.width,
      this.height
    );

    ctx.drawImage(
      imageRepositoryFlip.background,
      this.xPos + this.width,
      this.yPos,
      this.width,
      this.height
    );

    this.move = function () {
      this.xPos += this.speed;
    };
    this.move();
    if (this.xPos < -1400) {
      this.xPos = 0;
    }
  }
}

//fireball object
function Fireball() {
  this.x = myCanvas.width;
  this.y = Math.random() * myCanvas.height;
  this.height = fireball.height;
  this.width = fireball.width;
}

//helicopter object
let Chopper = {
  x: 150,
  y: 150,
  height: 300,
  width: 92
};
//missile object
function Missile() {
  this.x = Chopper.x + helicopter.width - 25;
  this.y = Chopper.y + 40;
  this.height = missile.height;
  this.width = missile.width;
}

/*======================
    GLOBAL VARIABLES
======================*/
let myCanvas = document.getElementById('gameScreen');
let ctx = myCanvas.getContext('2d');
let background = new Background();
let helicopter = new Image();
let missile = new Image();
let fireball = new Image();
let gravity = 2;
let score = 0;
let fireballs = [];
let missiles = [];
let isPause = false;

//Set image sources
missile.src = "assets/missile.png";
helicopter.src = "assets/helicopter.png";
fireball.src = "assets/fireball.png";

setInterval(()=> fireballs.push(new Fireball()), 2000);

/*======================
        THE GAME
======================*/
function startGame() {
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  background.draw(ctx);
  ctx.drawImage(helicopter, Chopper.x, Chopper.y);


  for (let fire of fireballs) {
    ctx.drawImage(fireball, fire.x, fire.y);
    if(isPause) continue;//if game is pause dont move fireballs
    fire.x -= 10;
    if (isCollide(Chopper, fire)) {
      alert(`GAME OVER\n\nSCORE: ${score}`);
      refresh();
    }

    //delete fireball after passes screen
    if (fire.x + fire.width <= 0) {
      deleteObject(fire);
      addScore();
    }
    missiles.forEach(e => {
      ctx.drawImage(missile, e.x, e.y);
      if (e.x > myCanvas.width) {
        deleteObject(e);
      }
      e.x += 10;
      if (isCollide(e, fire)) {
        deleteObject(e);
        deleteObject(fire);
        addScore();
      }
    });
  } //end fire loop


  if (Chopper.y + 50 >= myCanvas.height) {
    alert(`GAME OVER\n\nSCORE: ${score}`);
    refresh();
  }
  if (Chopper.y <= 0) {
    Chopper.y += gravity * 2;
  }
  if(!isPause) Chopper.y += gravity;

  ctx.font = "26px Verdana";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("Score : " + score, myCanvas.width - 150, myCanvas.height - 20);

  requestAnimationFrame(startGame);

}
/*======================
     EVENT LISTENERS
======================*/
document.addEventListener('keydown',
  function (event) {

    switch (event.keyCode) {
      case 38:
        //keyCode 38 is arrow up
        Chopper.y -= 25;
        break;

      case 40:
        //keyCode 40 is arrow down

        break;

      case 37:
        //keyCode 37 is arrow left
        //FIRE MISSILE
        missiles.push(new Missile());
        break;

      case 39:
        //keyCode 39 is arrow right
        //FIRE LASER
        break;
      
      case 80:
        //pause game on 'P' key
        isPause=!isPause;
        break;

      default:
        break;
    }
  });

/* =====================
     UTILITY FUNCTIONS
   ===================== */

// detect collision
function isCollide(a, b) {
  return !(
    ((a.y + a.height) < (b.y)) ||
    (a.y > (b.y + b.height)) ||
    ((a.x + a.width) < b.x) ||
    (a.x > (b.x + b.width))
  );
}

//delete object
function deleteObject(a) {
  if (a instanceof Missile) {
    missiles.splice(missiles.indexOf(a), 1);
    return;
  } else if (a instanceof Fireball) {
    fireballs.splice(fireballs.indexOf(a), 1);
    return;
  }
}
function addScore(){
  score++;
}
//restarts the game
function refresh(){
  score=0;
  missiles=[];
  fireballs=[];
  Chopper.x = 150;
  Chopper.y = 150;
}

startGame();