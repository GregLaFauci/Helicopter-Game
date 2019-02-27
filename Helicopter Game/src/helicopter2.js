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
      if(!isPause) this.xPos += this.speed;
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
  height: 92,
  width: 300
};
//missile object
function Missile() {
  this.x = Chopper.x + helicopter.width - 25;
  this.y = Chopper.y + 40;
  this.height = missile.height;
  this.width = missile.width;
}

//laser object
function Laser() {
  this.x = Chopper.x + helicopter.width - 25;
  this.y = Chopper.y + 40;
  this.height = laser.height;
  this.width = laser.width;
}

/*======================
    GLOBAL VARIABLES
======================*/
let myCanvas = document.getElementById('gameScreen');
let ctx = myCanvas.getContext('2d');
let background = new Background();
let helicopter = new Image();
let missile = new Image();
let laser = new Image();
let fireball = new Image();
let explosion = new Image();
let laserSound = new Audio("assets/Laser_Machine_Gun.mp3");
let missileSound = new Audio("assets/MissileFireWar.mp3");
let explosionCrashSound = new Audio("assets/Explosion_Crash.mp3");
let explosionMissileSound = new Audio("assets/BigBomb.mp3");
let gravity = 2;
let score = 0;
let missileCount = 10;
let fireballs = [];
let missiles = [];
let lasers = [];
let isPause = true;

//Set image sources
missile.src = "assets/missile.png";
laser.src = "assets/laser.png";
helicopter.src = "assets/helicopter.png";
fireball.src = "assets/fireball.png";
explosion.src = "assets/regularExplosion01.png";

//starts shooting fireballs
setInterval(()=>{
  if(isPause)return;
  //increase game difficulty
  if(score>5 && score<10 && fireballs.length<3){
    generateFireball(3);
  }else if(score>10 && score<15 && fireballs.length<4){
    generateFireball(4);
  }else if(score>15 && fireballs.length<6){
    generateFireball(5);
  }else{
    generateFireball(1);
  }
} , 2000);

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
      explosionCrashSound.play();
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
        ctx.drawImage(explosion,e.x,e.y);
        explosionMissileSound.play();
        missileCount++;
        deleteObject(e);
        deleteObject(fire);
        addScore();
      }
    });
    lasers.forEach(e => {
      ctx.drawImage(laser, e.x, e.y);
      if (e.x > myCanvas.width) {
        deleteObject(e);
      }
      e.x += 10;
      if (isCollide(e, fire)) {
        ctx.drawImage(explosion,e.x,e.y);
        explosionMissileSound.play();
        deleteObject(e);
        deleteObject(fire);
        addScore();
      }
    });
  } //end fire loop


  if (Chopper.y + 50 >= myCanvas.height) {
    ctx.drawImage(explosion,Chopper.x,Chopper.y);
    ctx.drawImage(explosion,Chopper.x+Chopper.width,Chopper.y);
    ctx.drawImage(explosion,Chopper.x+Chopper.width/2,Chopper.y);
    explosionCrashSound.play();
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
  ctx.fillText("Missles : " + missileCount, 50, myCanvas.height - 20);

  requestAnimationFrame(startGame);

}
/*======================
     EVENT LISTENERS
======================*/
document.addEventListener('keydown',
  function (e) {
    switch (e.keyCode) {
      case 38:
        //keyCode 38 is arrow up
        Chopper.y -= 25;
        break;

      case 40:
        //keyCode 40 is arrow down
         Chopper.y += 25;
        break;

      case 37:
        //keyCode 37 is arrow left
        //FIRE MISSILE
        if(missileCount==0)break;
        missiles.push(new Missile());
        missileSound.play();
        missileCount--;
        break;

      case 39:
        //keyCode 39 is arrow right
        //FIRE LASER
        lasers.push(new Laser());
        laserSound.play();
        break;
      
      case 80:
        //pause game on 'P' key
        isPause=!isPause;
        break;

      default:
        break;
    }
  });
  //on play click start game
  document.querySelector('#gameStartModal>#close').addEventListener('click',()=>{
    isPause=!isPause;
    document.querySelector('#gameStartModal').style.display = "none";
  });
  //pause game when window out of focus
  window.addEventListener('blur',()=>isPause = true);

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
  missileCount =10;
  fireballs=[];
  Chopper.x = 150;
  Chopper.y = 150;
}

//generates Fireballs
function generateFireball(x){
  for(let i=0;i<x;i++){
    let f = new Fireball();
    f.x = (Math.random()*myCanvas.width+200)+myCanvas.width;
    fireballs.push(f);
  }
}

startGame();