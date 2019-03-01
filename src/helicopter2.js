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

//background object
class Background {
  constructor(options = {}) {
    this.xPos = DEFAULTS.X_POS;
    this.yPos = DEFAULTS.Y_POS;
    this.width = DEFAULTS.WIDTH;
    this.height = DEFAULTS.HEIGHT;
    this.speed = DEFAULTS.SPEED;
  }

  draw(ctx) {
    const mountain = new function () {
      this.background = new Image();
      this.background.src = "assets/mountain.png";
    }();
    const mountainFlip = new function () {
      this.background = new Image();
      this.background.src = "assets/mountainFlip.png";
    }();

    ctx.drawImage(
      mountain.background,
      this.xPos,
      this.yPos,
      this.width,
      this.height
    );

    ctx.drawImage(
      mountainFlip.background,
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

//satellite object
function Satellite() {
  this.x = myCanvas.width;
  this.y = Math.random() * myCanvas.height;
  this.height = satelliteImg.height;
  this.width = satelliteImg.width;
}

//helicopter object
let Chopper = {
  x: 250,
  y: 150,
  height: 50,
  width: 150
};

//missile object
function Missile() {
  this.x = Chopper.x + helicopter.width - 25;
  this.y = Chopper.y + 40;
  this.height = missile.height;
  this.width = missile.width;
}

//missile pack object
function MissilePack() {
  this.x = myCanvas.width;
  this.y = Math.random() * myCanvas.height;
  this.height = missilePack.height;
  this.width = missilePack.width;
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
//canvas context
let myCanvas = document.getElementById('gameScreen');
let ctx = myCanvas.getContext('2d');
let myScoreCanvas = document.getElementById('scoreScreen');
let cx = myScoreCanvas.getContext('2d');
let myWeatherCanvas = document.getElementById('weather');
let weatherContext = myWeatherCanvas.getContext('2d');
//object instantiation
let background = new Background();
let helicopter = new Image();
let missile = new Image();
let laser = new Image();
let fireball = new Image();
let satelliteImg = new Image();
let explosion = new Image();
let missilePack = new Image();
var boom = [];
for(let i = 0; i <= 8; i++) boom[i] = new Image();
var sonicBoom = [];
for(let i = 0; i <= 8; i++) sonicBoom[i] = new Image();
let themeMusic = new Audio("assets/themeMusic.mp3");
let laserSound = new Audio("assets/Laser_Machine_Gun.mp3");
let missileSound = new Audio("assets/MissileFireWar.mp3");
let explosionCrashSound = new Audio("assets/Explosion_Crash.mp3");
let explosionMissileSound = new Audio("assets/BigBomb.mp3");
//variable declaration
let gravity = 1.5;
var gForce = .3;
let score = 0;
let missileCount = 10;
let fireballs = [];
let satellites = [];
let missiles = [];
let missilePacks = [];
let lasers = [];
let isPause = true;
let start,stop;

//image sources
missile.src = "assets/missile.png";
laser.src = "assets/laser.png";
// helicopter.src = "assets/apache.png";
helicopter.src = "assets/Valor-class_cruiser.png";
satelliteImg.src = "assets/satellite.png";

fireball.src = "assets/fireball.png";
missilePack.src = "assets/ballistic_missile.png";
for(let i =0; i<=8;i++) boom[i].src=`assets/regularExplosion0${i}.png`;
for(let i =0; i<=8;i++) sonicBoom[i].src=`assets/sonicExplosion0${i}.png`;
  

//starts shooting fireballs
//increase difficulty as user progresses
setInterval(()=>{
  if(isPause)return;
  //increase game difficulty
  if(score>5 && score<10 && fireballs.length<3){
    generateFireball(3);
    generateSatellite(1);
  }else if(score>10 && score<15 && fireballs.length<4){
    generateFireball(4);
    generateSatellite(2);
  }else if(score>15 && fireballs.length<6){
    generateFireball(5);
    generateSatellite(2);
  }else if(score>25 && missileCount < 2){
    generateMissilePack(1); 
  }else{
    generateFireball(1);
    generateSatellite(1);
  }
} , 2000);



/*======================
        THE GAME
======================*/
function startGame() {

  //change background as score increases
  if(score>50)  myCanvas.style.backgroundImage = "url('../assets/heartNebula.jpg')";
  if(score>100) myCanvas.style.backgroundImage = "url('../assets/crabNebula.png')";
  if(score>150) myCanvas.style.backgroundImage = "url('../assets/neonNebula.jpg')";
  if(score>200) myCanvas.style.backgroundImage = "url('../assets/nebula.jpg')";

  playGameSong();
  
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  cx.clearRect(0,0,myCanvas.width,myCanvas.height);

  background.draw(ctx);
  
  ctx.drawImage(helicopter, Chopper.x, Chopper.y);

  // draw SHIELD  
  ctx.save();
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.shadowBlur = 10;
  ctx.shadowColor = 'aqua';
  ctx.beginPath();
  ctx.arc(Chopper.x + 125, Chopper.y + 35 , 100, 1.5 * Math.PI, 1.8 * Math.PI);
  ctx.strokeStyle = "#757575";
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(Chopper.x + 125, Chopper.y + 35 , 100, 1.8 * Math.PI, .2 * Math.PI);
  ctx.strokeStyle = "#757575";
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(Chopper.x + 125, Chopper.y + 35 , 100, .2 * Math.PI, .5 * Math.PI);
  ctx.strokeStyle = "#757575";
  ctx.stroke();
  ctx.restore();
  // end SHIELD

  
  for (let fire of fireballs) {
    ctx.drawImage(fireball, fire.x, fire.y);
    if(isPause) continue;//if game is pause dont move fireballs
    fire.x -= 10;
    if (isCollide(Chopper, fire)) {
      console.log('better luck next time Jack')
      explosionCrashSound.play();
      for(let i = 0; i <=8;i++) ctx.drawImage(boom[i],Chopper.x + Chopper.width, Chopper.y);
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
      e.y += 5;
      if (e.x > myCanvas.width) {
        deleteObject(e);
      }
      e.x += 10;
      if (isCollide(e, fire)) {
        for(let i = 0; i <=8;i++) ctx.drawImage(sonicBoom[i],fire.x, fire.y);
        explosionMissileSound.play();
        missileCount++;
        deleteObject(e);
        deleteObject(fire);
        addScore(10);
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
        for(let i = 0; i <=8;i++) ctx.drawImage(sonicBoom[i],fire.x, fire.y);
        explosionMissileSound.play();
        deleteObject(e);
        deleteObject(fire);
        addScore(5);
      }
    });
  } //end fire loop


  for (let satellite of satellites) {
    ctx.drawImage(satelliteImg, satellite.x, satellite.y);
    if(isPause) continue;//if game is pause dont move satellites
    satellite.x -= 10;


    if (isCollide(Chopper, satellite)) {
      console.log('you crashed into a friendly JACK')
      explosionCrashSound.play();
      for(let i = 0; i <=8;i++) ctx.drawImage(boom[i],Chopper.x + Chopper.width, Chopper.y);
      gameOver();
    }

    //delete satelitte after passes screen
    if (satellite.x + satellite.width <= 0) {
      deleteObject(satellite);
      addScore(10);
    }

    //draw missiles and detect collision
    //if missile shoots satellite -20 points
    missiles.forEach(e => {
      ctx.drawImage(missile, e.x, e.y);
      e.y += 5;
      if (e.x > myCanvas.width) {
        deleteObject(e);
      }
      e.x += 10;
      if (isCollide(e, satellite)) {
        for(let i = 0; i <=8;i++) ctx.drawImage(sonicBoom[i],satellite.x, satellite.y);
        explosionMissileSound.play();
        missileCount++;
        deleteObject(e);
        deleteObject(satellite);
        addScore(-20);
      }
    });

    //draw lasers and detect collision
    //if laser shoots satellite -10 points
    lasers.forEach(e => {
      ctx.drawImage(laser, e.x, e.y);
      if (e.x > myCanvas.width) {
        deleteObject(e);
      }
      e.x += 10;
      if (isCollide(e, satellite)) {
        for(let i = 0; i <=8;i++) ctx.drawImage(sonicBoom[i],satellite.x, satellite.y);
        explosionMissileSound.play();
        deleteObject(e);
        deleteObject(satellite);
        addScore(-10);
      }
    });
  } //end satellite loop


  // if missilePacks [] has been filled draw the missilePack
  // if (missilePacks != []) {
  //   ctx.drawImage(missilePack, missilePack.x, missilePack.y)
  //   missilePack.x -= 10;
  // }


  // hit the bottom boundary
  if (Chopper.y + 50 >= myCanvas.height) {
    console.log('hit the deck');
    for(let i = 0; i <=8;i++) ctx.drawImage(sonicBoom[i],Chopper.x, Chopper.y);
    explosionCrashSound.play();
    gameOver();
  }

  if (Chopper.y <= 0) {
    Chopper.y += gravity * 2;
  }

  if(Chopper.x <= 0){
    console.log('stay on the board');
    for(let i = 0; i <=8;i++) ctx.drawImage(sonicBoom[i],Chopper.x, Chopper.y);
    explosionCrashSound.play();
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

        case 83:
        // keyCode 83 is 's' for shoot
        //SHOOT LASER
        lasers.push(new Laser());
        laserSound.play();
        break;

        case 70:
        //keyCode 70 is 'f' for fire 
        //FIRE MISSILE
        if(missileCount==0)break;
        missiles.push(new Missile());
        missileSound.play();
        missileCount--;
        break;

        case 38: 
        case 83:
        //keyCode 39 is arrow right
        Chopper.x += 20;  
        // keyCode 76 is 'l' for laser
        //FIRE LASER
        lasers.push(new Laser());
        laserSound.play();
        break;

        case 40:
        case 83:
        //keyCode 40 is arrow down
        Chopper.y +=30;
        // keyCode 76 is 'l' for laser
        //FIRE LASER
        lasers.push(new Laser());
        laserSound.play();
        break;

        case 38:
        case 83:
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
  } else if (a instanceof Satellite) {
    satellites.splice(satellites.indexOf(a), 1);
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
  missilePacks = [];
  Chopper.x = 250;
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

//generates Satellites
function generateSatellite(x){
  for(let i=0;i<x;i++){
    let s = new Satellite();
    s.x = (Math.random()*myCanvas.width+200)+myCanvas.width;
    satellites.push(s);
  }
}


//generates missilePack
function generateMissilePack(x){
  for(let i=0;i<x;i++){
    let f = new MissilePack();
    f.x = (Math.random()*myCanvas.width+200)+myCanvas.width;
    missilePacks.push(f);
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

  

//make it rain

function makeItRain() {
  var w = myWeatherCanvas.width;
  var h = myWeatherCanvas.height;
  weatherContext.strokeStyle = 'rgba(174,194,224,0.5)';
  weatherContext.lineWidth = 1;
  weatherContext.lineCap = 'round';
  var init = [];
  var maxParts = 1000;

  for(var a = 0; a < maxParts; a++) {
    init.push({
      x: Math.random() * w,
      y: Math.random() * h,
      l: Math.random() * 1,
      xs: -4 + Math.random() * 4 + 2,
      ys: Math.random() * 10 + 10
    })
  }

  var particles = [];
  for(var b = 0; b < maxParts; b++) {
    particles[b] = init[b];
  }

  function draw() {
    weatherContext.clearRect(0, 0, w, h);
    for(var c = 0; c < particles.length; c++) {
      var p = particles[c];
      weatherContext.beginPath();
      weatherContext.moveTo(p.x, p.y);
      weatherContext.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
      weatherContext.stroke();
    }
    move();
  }

  function move() {
    for(var b = 0; b < particles.length; b++) {
      var p = particles[b];
      p.x += p.xs;
      p.y += p.ys;
      if(p.x > w || p.y > h) {
        p.x = Math.random() * w;
        p.y = -20;
      }
    }
  }

  setInterval(draw, 30);
  }; // end of rain

// startGame()
startGame();