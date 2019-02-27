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
  x: 250,
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
let myScoreCanvas = document.getElementById('scoreScreen');
let cx = myScoreCanvas.getContext('2d');
let background = new Background();
let helicopter = new Image();
let missile = new Image();
let laser = new Image();
let fireball = new Image();
let explosion = new Image();

var boom = [];
for(let i = 0; i <= 8; i++){
  boom[i] = new Image();
} 

// var boom1 = new Image();
// var boom2 = new Image();
// var boom3 = new Image();
// var boom4 = new Image();
// var boom5 = new Image();
// var boom6 = new Image();
// var boom7 = new Image();
// var boom8 = new Image();
// var boom9 = new Image();

var sonicBoom = [];
for(let i = 0; i <= 8; i++){
  sonicBoom[i] = new Image();
} 
// var sonicBoom1 = new Image();
// var sonicBoom2 = new Image();
// var sonicBoom3 = new Image();
// var sonicBoom4 = new Image();
// var sonicBoom5 = new Image();
// var sonicBoom6 = new Image();
// var sonicBoom7 = new Image();
// var sonicBoom8 = new Image();
// var sonicBoom9 = new Image();

let themeMusic = new Audio("assets/themeMusic.mp3");
let laserSound = new Audio("assets/Laser_Machine_Gun.mp3");
let missileSound = new Audio("assets/MissileFireWar.mp3");
let explosionCrashSound = new Audio("assets/Explosion_Crash.mp3");
let explosionMissileSound = new Audio("assets/BigBomb.mp3");
let gravity = 1.5;
var gForce = .5;
let score = 0;
let missileCount = 10;
let fireballs = [];
let missiles = [];
let lasers = [];
let isPause = true;
let start,stop;

//Set image sources
missile.src = "assets/missile.png";
laser.src = "assets/laser.png";
// helicopter.src = "assets/helicopter.png";
helicopter.src = "assets/apache.png";

fireball.src = "assets/fireball.png";
explosion.src = "assets/regularExplosion01.png";

for(let i =0; i<=8;i++){
boom[i].src=`assets/regularExplosion0${i}.png`;
}

// boom1.src="/assets/regularExplosion00.png";
// boom2.src="/assets/regularExplosion01.png";
// boom3.src="/assets/regularExplosion02.png";
// boom4.src="/assets/regularExplosion03.png";
// boom5.src="/assets/regularExplosion04.png";
// boom6.src="/assets/regularExplosion05.png";
// boom7.src="/assets/regularExplosion06.png";
// boom8.src="/assets/regularExplosion07.png";
// boom9.src="/assets/regularExplosion08.png";

for(let i =0; i<=8;i++){
  sonicBoom[i].src=`assets/sonicExplosion0${i}.png`;
  }

// sonicBoom1.src="/assets/sonicExplosion00.png";
// sonicBoom2.src="/assets/sonicExplosion01.png";
// sonicBoom3.src="/assets/sonicExplosion02.png";
// sonicBoom4.src="/assets/sonicExplosion03.png";
// sonicBoom5.src="/assets/sonicExplosion04.png";
// sonicBoom6.src="/assets/sonicExplosion05.png";
// sonicBoom7.src="/assets/sonicExplosion06.png";
// sonicBoom8.src="/assets/sonicExplosion07.png";
// sonicBoom9.src="/assets/sonicExplosion08.png";

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
  
  playGameSong();
  
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  cx.clearRect(0,0,myCanvas.width,myCanvas.height);

  background.draw(ctx);
  // ctx.scale(.5,.5);
  ctx.drawImage(helicopter, Chopper.x, Chopper.y);
  // ctx.scale(1,1);
  for (let fire of fireballs) {
    ctx.drawImage(fireball, fire.x, fire.y);
    if(isPause) continue;//if game is pause dont move fireballs
    fire.x -= 10;
    if (isCollide(Chopper, fire)) {
      explosionCrashSound.play();

      for(let i = 0; i <=8;i++) {
        ctx.drawImage(boom[i],Chopper.x + Chopper.width, Chopper.y);
      }

      // ctx.drawImage(boom1,Chopper.x + Chopper.width, Chopper.y);
      // ctx.drawImage(boom2,Chopper.x + Chopper.width, Chopper.y);
      // ctx.drawImage(boom3,Chopper.x + Chopper.width, Chopper.y);
      // ctx.drawImage(boom4,Chopper.x + Chopper.width, Chopper.y);
      // ctx.drawImage(boom5,Chopper.x + Chopper.width, Chopper.y);
      // ctx.drawImage(boom6,Chopper.x + Chopper.width, Chopper.y);
      // ctx.drawImage(boom7,Chopper.x + Chopper.width, Chopper.y);
      // ctx.drawImage(boom8,Chopper.x + Chopper.width, Chopper.y);
      // ctx.drawImage(boom9,Chopper.x + Chopper.width, Chopper.y);


      // alert(`GAME OVER\n\nSCORE: ${score}`);
      // refresh();
      gameOver();
    }

    //delete fireball after passes screen
    if (fire.x + fire.width <= 0) {
      deleteObject(fire);
      addScore(1);
    }

    //draw missiles and detect collision
    missiles.forEach(e => {
      ctx.drawImage(missile, e.x, e.y);
      if (e.x > myCanvas.width) {
        deleteObject(e);
      }
      e.x += 10;
      if (isCollide(e, fire)) {
        // ctx.drawImage(explosion,e.x,e.y);

        for(let i = 0; i <=8;i++) {
          ctx.drawImage(sonicBoom[i],fire.x, fire.y);
        }

        // ctx.drawImage(sonicBoom1,fire.x, fire.y);
        // ctx.drawImage(sonicBoom2,fire.x, fire.y);
        // ctx.drawImage(sonicBoom3,fire.x, fire.y);
        // ctx.drawImage(sonicBoom4,fire.x, fire.y);
        // ctx.drawImage(sonicBoom5,fire.x, fire.y);
        // ctx.drawImage(sonicBoom6,fire.x, fire.y);
        // ctx.drawImage(sonicBoom7,fire.x, fire.y);
        // ctx.drawImage(sonicBoom8,fire.x, fire.y);
        // ctx.drawImage(sonicBoom9,fire.x, fire.y);

        explosionMissileSound.play();
        missileCount++;
        deleteObject(e);
        deleteObject(fire);
        addScore(5);
      }
    });

    //draw lasers and detect collision
    lasers.forEach(e => {
      ctx.drawImage(laser, e.x, e.y);
      if (e.x > myCanvas.width) {
        deleteObject(e);
      }
      e.x += 10;
      if (isCollide(e, fire)) {

        // ctx.drawImage(explosion,e.x,e.y);

        for(let i = 0; i <=8;i++) {
          ctx.drawImage(sonicBoom[i],fire.x, fire.y);
        }

        
        // ctx.drawImage(sonicBoom2,fire.x, fire.y);
        // ctx.drawImage(sonicBoom3,fire.x, fire.y);
        // ctx.drawImage(sonicBoom4,fire.x, fire.y);
        // ctx.drawImage(sonicBoom5,fire.x, fire.y);
        // ctx.drawImage(sonicBoom6,fire.x, fire.y);
        // ctx.drawImage(sonicBoom7,fire.x, fire.y);
        // ctx.drawImage(sonicBoom8,fire.x, fire.y);
        // ctx.drawImage(sonicBoom9,fire.x, fire.y);


        explosionMissileSound.play();
        deleteObject(e);
        deleteObject(fire);
        addScore(5);
      }
    });
  } //end fire loop


  if (Chopper.y + 50 >= myCanvas.height) {

    for(let i = 0; i <=8;i++) {
      ctx.drawImage(sonicBoom[i],Chopper.x, Chopper.y);
    }


    // ctx.drawImage(sonicBoom1,Chopper.x, Chopper.y);
    // ctx.drawImage(sonicBoom2,Chopper.x, Chopper.y);
    // ctx.drawImage(sonicBoom3,Chopper.x, Chopper.y);
    // ctx.drawImage(sonicBoom4,Chopper.x, Chopper.y);
    // ctx.drawImage(sonicBoom5,Chopper.x, Chopper.y);
    // ctx.drawImage(sonicBoom6,Chopper.x, Chopper.y);
    // ctx.drawImage(sonicBoom7,Chopper.x, Chopper.y);
    // ctx.drawImage(sonicBoom8,Chopper.x, Chopper.y);
    // ctx.drawImage(sonicBoom9,Chopper.x, Chopper.y);

    // ctx.drawImage(explosion,Chopper.x,Chopper.y);
    // ctx.drawImage(explosion,Chopper.x+Chopper.width,Chopper.y);
    // ctx.drawImage(explosion,Chopper.x+Chopper.width/2,Chopper.y);

    explosionCrashSound.play();
    // alert(`GAME OVER\n\nSCORE: ${score}`);
    // refresh();
    gameOver();
  }
  if (Chopper.y <= 0) {
    Chopper.y += gravity * 2;
  }

  if(Chopper.x <= 0){

    for(let i = 0; i <=8;i++) {
      ctx.drawImage(sonicBoom[i],Chopper.x, Chopper.y);
    }


    // ctx.drawImage(sonicBoom1,Chopper.x, Chopper.y);
    // ctx.drawImage(sonicBoom2,Chopper.x, Chopper.y);
    // ctx.drawImage(sonicBoom3,Chopper.x, Chopper.y);
    // ctx.drawImage(sonicBoom4,Chopper.x, Chopper.y);
    // ctx.drawImage(sonicBoom5,Chopper.x, Chopper.y);
    // ctx.drawImage(sonicBoom6,Chopper.x, Chopper.y);
    // ctx.drawImage(sonicBoom7,Chopper.x, Chopper.y);
    // ctx.drawImage(sonicBoom8,Chopper.x, Chopper.y);
    // ctx.drawImage(sonicBoom9,Chopper.x, Chopper.y);

    explosionCrashSound.play();
    // alert(`GAME OVER\n\nSCORE: ${score}`);
    // refresh(); 
    gameOver();

}



  if(!isPause) {
    Chopper.y += gravity;
    Chopper.x -= gForce;
  }

  cx.font = "26px Verdana";
  cx.fillStyle = "#FFFFFF";
  cx.fillText("Score : " + score, myCanvas.width - 150, myCanvas.height - 20);
  cx.fillText("Missiles : " + missileCount, 50, myCanvas.height - 20);

  start = requestAnimationFrame(startGame);
}
/*======================
     EVENT LISTENERS
======================*/
document.addEventListener('keydown',
  function (e) {
    if(isPause) return;
    switch (e.keyCode) {
      case 38:
        //keyCode 38 is arrow up
        Chopper.y -=30;
        break;

        case 40:
        //keyCode 40 is arrow down
        Chopper.y +=30;
        break;

        case 37:
        //keyCode 37 is arrow left
        Chopper.x -=5;
        break;

        case 39:
        //keyCode 39 is arrow right
        Chopper.x += 20;  
        break;

        case 76:
        // keyCode 76 is 'l' for laser
        //FIRE LASER
        lasers.push(new Laser());
        laserSound.play();
        break;

        case 77:
        //keyCode 77 is 'm' for missile 
        //FIRE MISSILE
        if(missileCount==0)break;
        missiles.push(new Missile());
        missileSound.play();
        missileCount--;
        break;

        case 38: 
        case 76:
        //keyCode 39 is arrow right
        Chopper.x += 20;  
        // keyCode 76 is 'l' for laser
        //FIRE LASER
        lasers.push(new Laser());
        laserSound.play();
        break;

        case 40:
        case 76:
        //keyCode 40 is arrow down
        Chopper.y +=30;
        // keyCode 76 is 'l' for laser
        //FIRE LASER
        lasers.push(new Laser());
        laserSound.play();
        break;

        case 38:
        case 76:
        //keyCode 38 is arrow up
        Chopper.y -=30;
        // keyCode 76 is 'l' for laser
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
function addScore(x){
  score+=x;
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

//game over
function gameOver(){
  cancelAnimationFrame(start);
  cx.clearRect(0,0,myCanvas.width,myCanvas.height);
  cx.font = "40px Verdana";
  cx.fillStyle = "#FF0000";
  cx.fillText("GAME OVER!!", myCanvas.width/2-200, myCanvas.height/3);
  cx.fillText("Score : " + score, myCanvas.width/2-200, myCanvas.height/2);
  cx.fillStyle = "#00FF00";
  cx.fillRect(myCanvas.width/2+100,myCanvas.height/2+150,100,50);
  isPause = true;
  stop = requestAnimationFrame(gameOver);
}

function playGameSong(){
  !isPause ? themeMusic.play() : themeMusic.pause();
}

startGame();