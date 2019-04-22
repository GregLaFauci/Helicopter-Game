/*jshint esversion: 6*/
/*======================
        OBJECTS
======================*/
//background object
class Background {
  constructor(_options = {}) {
    this.xPos = 0;
    this.yPos = 0;
    this.width = 1400;
    this.height = 1000;
    this.speed = -1;
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
class Fireball {
  constructor() {
    this.x = myCanvas.width;
    this.y = Math.random() * myCanvas.height;
    this.height = fireball.height;
    this.width = fireball.width;
  }
}

//helicopter object
let Chopper = {
  x: 250,
  y: 150,
  height: 40,
  width: 130
};

//clone object
class Clone {
  constructor() {
    this.x = Chopper.x;
    this.y = Chopper.y - 200;
    this.height = Chopper.height;
    this.width = Chopper.width;
  }
}

//satellite object
class Satellite {
  constructor() {
    this.x = myCanvas.width;
    this.y = Math.random() * myCanvas.height;
    this.height = satelliteImg.height;
    this.width = satelliteImg.width;
  }
}

//laser object
class Laser {
  constructor() {
    this.x = Chopper.x + helicopter.width - 25;
    this.y = Chopper.y + 40;
    this.height = laser.height;
    this.width = laser.width;
  }
}

//laserClone object
class LaserClone {
  constructor() {
    this.x = Chopper.x + helicopter.width - 25;
    this.y = Chopper.y + 240;
    this.height = laser.height;
    this.width = laser.width;
  }
}

//missile object
class Missile {
  constructor() {
    this.x = Chopper.x + helicopter.width - 25;
    this.y = Chopper.y + 40;
    this.height = missile.height;
    this.width = missile.width;
  }
}

//missile pack object
class MissilePack {
  constructor() {
    this.x = myCanvas.width;
    this.y = Math.random() * myCanvas.height;
    this.height = missilePackImg.height;
    this.width = missilePackImg.width;
  }
}

//shield pack object
class ShieldPack {
  constructor() {
    this.x = myCanvas.width;
    this.y = Math.random() * myCanvas.height;
    this.height = shieldPackImg.height;
    this.width = shieldPackImg.width;
  }
}

//clone pack object
class ClonePack {
  constructor() {
    this.x = myCanvas.width;
    this.y = Math.random() * myCanvas.height;
    this.height = clonePackImg.height;
    this.width = clonePackImg.width;
  }
}




//keyboard construction
class Keyboard {
  constructor() {
    var keyState = {};
    window.addEventListener("keydown", function (e) {
      // e.preventDefault();
      keyState[e.keyCode] = true;
    });
    window.addEventListener("keyup", function (e) {
      // e.preventDefault();
      keyState[e.keyCode] = false;
      e.keyCode == 80 ? isPause = !isPause : null;
    });
    this.isDown = function (keyCode) {
      return keyState[keyCode] === true;
    };
    this.KEYS = {
    LEFT: 37,
      RIGHT: 39,
      UP: 38,
      DOWN: 40,
      S: 83,
      F: 70,
      P: 80
    };
  }
}
;

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
let clone = new Image();
let missile = new Image();
let laser = new Image();
let fireball = new Image();
let satelliteImg = new Image();
let explosion = new Image();
let missilePackImg = new Image();
let shieldPackImg = new Image();
let clonePackImg = new Image();
let keyboard = new Keyboard();
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
let shieldPacks = [];
let clonePacks = [];
let lasers = [];
let lasersCloned = [];
let clones = [];
let isPause = true;
let start,stop, clone500;
let plusOrMinus= 1;
let playerLife = 4;
let missileFired = false;
let cloned = false;


//image sources
missile.src = "assets/missile.png";
laser.src = "assets/laser.png";
helicopter.src = "assets/Valor-class_cruiser.png";
clone.src = helicopter.src;
satelliteImg.src = "assets/satellite.png";
fireball.src = "assets/fireball.png";
missilePackImg.src = "assets/ballistic_missile.png";
shieldPackImg.src = "assets/shield.png";
clonePackImg.src = "assets/clone.png";
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
    generateSatellite(1);
  }else if(score>15 && fireballs.length<6){
    generateFireball(5);
    generateSatellite(1);
  }else if(score>25 && missileCount < 2){
    generateMissilePack(1); 
  } else if (playerLife < 2) {
    generateShieldPack(1);
  } else if (score > 2) {
    generateClonePack(1);
  }
  else{
    generateFireball(1);
    generateSatellite(1);
  }
} , 2000);




/*======================
        THE GAME
======================*/
function startGame() {
  
  Chopper.prototype.update();
  
  //change background as score increases
  if(score>100)  myCanvas.style.backgroundImage = "url('../assets/heartNebula.jpg')";
  // if(score>250) makeItRain();
  // if(score>450) stopRain();
  if(score>500) myCanvas.style.backgroundImage = "url('../assets/crabNebula.png')";
  // if(score>750) makeItRain();
  // if(score>850) stopRain();
  if(score>1000) myCanvas.style.backgroundImage = "url('../assets/neonNebula.jpg')";
  // if(score>1500) makeItRain();
  // if(score>1750) stopRain();
  if(score>2000) myCanvas.style.backgroundImage = "url('../assets/nebula.jpg')";

  playGameSong();

  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  cx.clearRect(0,0,myCanvas.width,myCanvas.height);
  
  background.draw(ctx);
  
  ctx.drawImage(helicopter, Chopper.x, Chopper.y);

  if(cloned == true){
    ctx.drawImage(helicopter, Chopper.x, Chopper.y + 200 );
  }

  //draw SHIELD  
  if(playerLife > 1){
    ctx.save();
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'aqua';
    if(playerLife > 3){
      ctx.beginPath();
      ctx.arc(Chopper.x + 125, Chopper.y + 35 , 100, 1.5 * Math.PI, .5 * Math.PI);
      ctx.strokeStyle = "green";
      ctx.stroke();
    }
    if(playerLife > 2){
    ctx.beginPath();
    ctx.arc(Chopper.x + 125, Chopper.y + 35 , 100, 1.7 * Math.PI, .3 * Math.PI);
    ctx.strokeStyle = "#757575";
    ctx.stroke();
  }
      ctx.beginPath();
      ctx.arc(Chopper.x + 125, Chopper.y + 35 , 100, 1.9 * Math.PI, .1 * Math.PI);
      ctx.strokeStyle = "red";
      ctx.stroke();
    ctx.restore();
  }
  //end SHIELD




  //FIREBALL LOOP
  for (let fire of fireballs) {
    ctx.drawImage(fireball, fire.x, fire.y);
    if(isPause) continue;//if game is pause dont move fireballs
    fire.x -= 10;
    if (isCollide(Chopper, fire)) {
      console.log('better luck next time Jack')
      deleteObject(fire);
      playerLife--;
      if(playerLife == 0){
        explosionCrashSound.play();
        for(let i = 0; i <=8;i++) ctx.drawImage(boom[i],Chopper.x + Chopper.width, Chopper.y);
        gameOver();
      }
    }

    //delete fireball after passes screen
    if (fire.x + fire.width <= 0) {
      deleteObject(fire);
      addScore(1);
    }

    //draw missiles and detect collision
    missiles.forEach(e => {
      
      ctx.drawImage(missile, e.x, e.y);
      e.y += 5 * plusOrMinus;
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
    if(cloned == true) {
      lasersCloned.forEach(e => {
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
    }

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

//SATELLITE LOOP
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


  //if missilePacks [] has been filled draw the missilePack
  if (missilePacks != []) {
    missilePacks.forEach(e=>{
      ctx.drawImage(missilePackImg, e.x, e.y)
      e.x -= 10;
      if (isCollide(e, Chopper)) {
        deleteObject(e);
        missileCount = missileCount + 10;
      }
    });
  }

//if shieldPacks [] has been filled draw the shieldPack
if (shieldPacks != []) {
  shieldPacks.forEach(e=>{
    ctx.drawImage(shieldPackImg, e.x, e.y)
    e.x -= 10;
    if (isCollide(e, Chopper)) {
      deleteObject(e);
      playerLife = 4;
    }
  });
}

//if clonePacks [] has been filled draw the clonePack
if (clonePacks != []) {
  clonePacks.forEach(e=>{
    ctx.drawImage(clonePackImg, e.x, e.y)
    e.x -= 10;
    if (isCollide(e, Chopper)) {
      deleteObject(e);
      cloned = true;
      
      
    }
  });
}



  // hit the bottom boundary
  if (Chopper.y + 50 >= myCanvas.height) {
    console.log('hit the deck');
    for(let i = 0; i <=8;i++) ctx.drawImage(sonicBoom[i],Chopper.x, Chopper.y);
    explosionCrashSound.play();
    gameOver();
  }

  //hit the top boundary
  if (Chopper.y <= 0) {
    console.log('come back down to earth Jim')
    Chopper.y += gravity * 8;
  }

//hit the left boundary
  if(Chopper.x <= 0){
    console.log('stay on the board');
    for(let i = 0; i <=8;i++) ctx.drawImage(sonicBoom[i],Chopper.x, Chopper.y);
    explosionCrashSound.play();
    gameOver();
}

//hit the right boundary
if (Chopper.x >= myCanvas.width) {
  console.log('slow down Jimmy');
  Chopper.x += gForce * 8;
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

Chopper.prototype = {
  update: function() {
    this.respondToUserInput();
  },

  respondToUserInput: function() {
    if (keyboard.isDown(keyboard.KEYS.LEFT)) {
      
      this.moveLeft();
    } 
    if (keyboard.isDown(keyboard.KEYS.RIGHT)) {
      this.moveRight();
    }
    if (keyboard.isDown(keyboard.KEYS.UP)) {
      this.moveUp();
    }
    if (keyboard.isDown(keyboard.KEYS.DOWN)) {
      this.moveDown();
    }

    if (keyboard.isDown(keyboard.KEYS.S)) {
      this.laser();
    }
    if (keyboard.isDown(keyboard.KEYS.F)) {
      this.missile();
    } else {
      missileFired = false;
    }
  },

  moveLeft: function() {
    Chopper.x -=2;
  },

  moveRight: function() {
    Chopper.x += 5; 
  },

  moveUp: function() {
    Chopper.y -=5;
  },
  moveDown: function() {
    Chopper.y +=5;
  },

  laser: function() {
    lasers.push(new Laser());
    if(cloned == true) lasers.push(new LaserClone());
    laserSound.play();
  },

  missile: function(){
    if(missileCount==0)return;
    if(missileFired) return;
      missiles.push(new Missile());
      missileSound.play();
      missileCount--;
      missileFired = true;
  }

};



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
  }else if (a instanceof MissilePack) {
    missilePacks.splice(missilePacks.indexOf(a), 1);
    return;
  }else if (a instanceof ShieldPack) {
    shieldPacks.splice(shieldPacks.indexOf(a), 1);
    return;
  }else if (a instanceof ClonePack) {
    clonePacks.splice(clonePacks.indexOf(a), 1);
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
  shieldPacks = [];
  clonePacks = [];
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

//generates shieldPack
function generateShieldPack(x){
  for(let i=0;i<x;i++){
    let f = new ShieldPack();
    f.x = (Math.random()*myCanvas.width+200)+myCanvas.width;
    shieldPacks.push(f);
  }
}

//generates ClonePack
function generateClonePack(x){
  for(let i=0;i<x;i++){
    let f = new ClonePack();
    f.x = (Math.random()*myCanvas.width+200)+myCanvas.width;
    clonePacks.push(f);
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

function generateClone500() {
  clone500 = Math.floor(Math.random() * 500);
  plusOrMinus = -plusOrMinus;

}
  

//make it rain
let myVar;
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

  myVar = setInterval(draw, 30);
  }; // end of rain

  function stopRain(){
    clearInterval(myVar)
    weatherContext.clearRect(0, 0, myCanvas.width, myCanvas.height);
  }

// startGame()
startGame();