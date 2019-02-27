/*###################
    GET CONTEXT 
###################*/


let myCanvas=document.getElementById('gameScreen');
let ctx=myCanvas.getContext('2d');

let myScoreCanvas = document.getElementById('scoreScreen');
let cx = myScoreCanvas.getContext('2d');

// ctx.shadowBlur = 20;
// ctx.shadowColor = white;


/*###################
    RESIZEABLE CANVAS 
###################*/

// myCanvas.width=window.innerWidth-50;
// myCanvas.height=window.innerHeight-50;



/*###################
    DRAW BACKGROUND
###################*/



const DEFAULTS = {
    X_POS: 0,
    Y_POS: 0,
    WIDTH: 1400,
    HEIGHT: 1000,
    SPEED: -1
  };
  
  class Background {
    constructor(options = {}) {
      this.xPos = DEFAULTS.X_POS;
      this.yPos = DEFAULTS.Y_POS;
      this.width = DEFAULTS.WIDTH;
      this.height = DEFAULTS.HEIGHT;
      this.speed = DEFAULTS.SPEED;
    //   this.game = options.game;
    }
  
    draw(ctx) {
      const imageRepository = new function() {
          this.background = new Image();
          this.background.src = "/assets/mountain.png";
      };
      const imageRepositoryFlip = new function() {
        this.background = new Image();
        this.background.src = "/assets/mountainFlip.png";
    };  

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
      
        this.move=function(){  
            this.xPos += this.speed;
          }
      this.move();
      if (this.xPos < -1400){
        this.xPos = 0;
      }  
}}



/*###################
    LOAD IMAGES 
###################*/

var background = new Background();
var helicopter = new Image();
var missile = new Image();
var fireball = new Image();
var laser = new Image();
var boom1 = new Image();
var boom2 = new Image();
var boom3 = new Image();
var boom4 = new Image();
var boom5 = new Image();
var boom6 = new Image();
var boom7 = new Image();
var boom8 = new Image();
var boom9 = new Image();
var sonicBoom1 = new Image();
var sonicBoom2 = new Image();
var sonicBoom3 = new Image();
var sonicBoom4 = new Image();
var sonicBoom5 = new Image();
var sonicBoom6 = new Image();
var sonicBoom7 = new Image();
var sonicBoom8 = new Image();
var sonicBoom9 = new Image();


missile.src = "/assets/missile.png";
helicopter.src = "/assets/helicopter.png";
fireball.src="/assets/fireball.png";
laser.src="/assets/laserRed16.png";
boom1.src="/assets/regularExplosion00.png";
boom2.src="/assets/regularExplosion01.png";
boom3.src="/assets/regularExplosion02.png";
boom4.src="/assets/regularExplosion03.png";
boom5.src="/assets/regularExplosion04.png";
boom6.src="/assets/regularExplosion05.png";
boom7.src="/assets/regularExplosion06.png";
boom8.src="/assets/regularExplosion07.png";
boom9.src="/assets/regularExplosion08.png";
sonicBoom1.src="/assets/sonicExplosion00.png";
sonicBoom2.src="/assets/sonicExplosion01.png";
sonicBoom3.src="/assets/sonicExplosion02.png";
sonicBoom4.src="/assets/sonicExplosion03.png";
sonicBoom5.src="/assets/sonicExplosion04.png";
sonicBoom6.src="/assets/sonicExplosion05.png";
sonicBoom7.src="/assets/sonicExplosion06.png";
sonicBoom8.src="/assets/sonicExplosion07.png";
sonicBoom9.src="/assets/sonicExplosion08.png";




 /*###################
        OBJECTS
###################*/

// fireball object
var fire = [];
function Fireball(){
    this.x= myCanvas.width,
    this.y= Math.random()*myCanvas.height,
    this.height = fireball.height,
    this.width = fireball.width
}

//helicopter object
let Chopper = {
    x: 150,
    y: 150,
    height : helicopter.height,
    width : helicopter.width,
    src :  "/assets/helicopter.png"
}

//missile object
var missiles = [];
function Missile() {
    this.x = Chopper.x + helicopter.width - 25,
    this.y = Chopper.y +40,
    this.height = missile.height,
    this.width= missile.width
}

//laser object
var lasers = [];
function Laser(){
    this.x = Chopper.x + helicopter.width - 25,
    this.y = Chopper.y + 40,
    this.height = laser.height,
    this.width = laser.width
}


// starting variables

var gravity = 2;
var gForce = 1;
var score = 0;



/*###################
    KEYSTROKES 
###################*/


// on key down
document.addEventListener('keydown',
  function(event){

      switch(event.keyCode){

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

          case 32:
          // keyCode 32 is spacebar
          break;

          case 76:
          // keyCode 76 is 'l' for laser
          //FIRE LASER
          lasers.push(new Laser());
          break;

          case 39:
          //keyCode 39 is arrow right
          Chopper.x += 20;  
          break;

          case 77:
          //keyCode 77 is 'm' for missile  
          //FIRE MISSILE
          missiles.push(new Missile());
          break;

          default:
          break;
      }
    });


/*###################
    OBSTACLES 
###################*/ 


setInterval(function(){
    fire.push(new Fireball())
}, 2000);


/*###################
    DRAW IMAGES 
###################*/

function draw(){
    ctx.clearRect(0,0,myCanvas.width,myCanvas.height);
    cx.clearRect(0,0,myCanvas.width,myCanvas.height);

    background.draw(ctx);
   
    for(var i = 0; i < fire.length; i++){
    
        ctx.drawImage(fireball,fire[i].x,fire[i].y);
         
        fire[i].x-=10;

        if(isCollide(Chopper,fire[i])){
            //draw explosion at coordinates of collision
            ctx.drawImage(boom1,Chopper.x + Chopper.width, Chopper.y);
            ctx.drawImage(boom2,Chopper.x + Chopper.width, Chopper.y);
            ctx.drawImage(boom3,Chopper.x + Chopper.width, Chopper.y);
            ctx.drawImage(boom4,Chopper.x + Chopper.width, Chopper.y);
            ctx.drawImage(boom5,Chopper.x + Chopper.width, Chopper.y);
            ctx.drawImage(boom6,Chopper.x + Chopper.width, Chopper.y);
            ctx.drawImage(boom7,Chopper.x + Chopper.width, Chopper.y);
            ctx.drawImage(boom8,Chopper.x + Chopper.width, Chopper.y);
            ctx.drawImage(boom9,Chopper.x + Chopper.width, Chopper.y);


            //end game and display score
            //ask user if they want to play again

            location.reload();
        }
    
        if(fire[i].x == 0){
            score++;
        }

        missiles.forEach((e,j,arr)=>{
            ctx.drawImage(missile,e.x,e.y);
            if(e.x> myCanvas.width) {
                deleteObjects(arr, i);
            }
            e.x+=10;
            if(isCollide(e,fire[i])){
                //draw explosion at coordinates of collision
                ctx.drawImage(sonicBoom1,fire[i].x, fire[i].y);
                ctx.drawImage(sonicBoom2,fire[i].x, fire[i].y);
                ctx.drawImage(sonicBoom3,fire[i].x, fire[i].y);
                ctx.drawImage(sonicBoom4,fire[i].x, fire[i].y);
                ctx.drawImage(sonicBoom5,fire[i].x, fire[i].y);
                ctx.drawImage(sonicBoom6,fire[i].x, fire[i].y);
                ctx.drawImage(sonicBoom7,fire[i].x, fire[i].y);
                ctx.drawImage(sonicBoom8,fire[i].x, fire[i].y);
                ctx.drawImage(sonicBoom9,fire[i].x, fire[i].y);

                deleteObjects(arr,j,fire,i);
                //score 5
                score +=5;
            }
        })

        lasers.forEach((e,j,arr)=>{
            ctx.drawImage(laser,e.x,e.y);
            if(e.x> myCanvas.width) {
                deleteObjects(arr, i);
            }
            e.x+=10;
            if(isCollide(e,fire[i])){
                //draw explosion at coordinates of collision
                ctx.drawImage(sonicBoom1,fire[i].x, fire[i].y);
                ctx.drawImage(sonicBoom2,fire[i].x, fire[i].y);
                ctx.drawImage(sonicBoom3,fire[i].x, fire[i].y);
                ctx.drawImage(sonicBoom4,fire[i].x, fire[i].y);
                ctx.drawImage(sonicBoom5,fire[i].x, fire[i].y);
                ctx.drawImage(sonicBoom6,fire[i].x, fire[i].y);
                ctx.drawImage(sonicBoom7,fire[i].x, fire[i].y);
                ctx.drawImage(sonicBoom8,fire[i].x, fire[i].y);
                ctx.drawImage(sonicBoom9,fire[i].x, fire[i].y);

                deleteObjects(arr,j,fire,i);
                //score 5
                score +=5;
            }
        })

        function deleteObjects(a,ai,b,bi){
            a.splice(ai,1);
            if(!b) return;
            b.splice(bi,1);
        }   
    }//end fire loop

     // detect collision
    function isCollide(a,b){
        return !(
            ((a.y + a.height) < (b.y) ) || 
            (a.y > (b.y + b.height)) || 
            ((a.x + a.width) < b.x) || 
            (a.x > (b.x + b.width))
        );
    }

    ctx.drawImage(helicopter,Chopper.x,Chopper.y);
    
    if(Chopper.y + Chopper.height == 700){
        //draw explosion at coordinates of crash

        ctx.drawImage(sonicBoom1,Chopper.x, Chopper.y);
        ctx.drawImage(sonicBoom2,Chopper.x, Chopper.y);
        ctx.drawImage(sonicBoom3,Chopper.x, Chopper.y);
        ctx.drawImage(sonicBoom4,Chopper.x, Chopper.y);
        ctx.drawImage(sonicBoom5,Chopper.x, Chopper.y);
        ctx.drawImage(sonicBoom6,Chopper.x, Chopper.y);
        ctx.drawImage(sonicBoom7,Chopper.x, Chopper.y);
        ctx.drawImage(sonicBoom8,Chopper.x, Chopper.y);
        ctx.drawImage(sonicBoom9,Chopper.x, Chopper.y);

        location.reload();  
    }

    if(Chopper.y <= 0){
        Chopper.y += gravity*2;
    }

    if(Chopper.x <= 0){

        ctx.drawImage(sonicBoom1,Chopper.x, Chopper.y);
        ctx.drawImage(sonicBoom2,Chopper.x, Chopper.y);
        ctx.drawImage(sonicBoom3,Chopper.x, Chopper.y);
        ctx.drawImage(sonicBoom4,Chopper.x, Chopper.y);
        ctx.drawImage(sonicBoom5,Chopper.x, Chopper.y);
        ctx.drawImage(sonicBoom6,Chopper.x, Chopper.y);
        ctx.drawImage(sonicBoom7,Chopper.x, Chopper.y);
        ctx.drawImage(sonicBoom8,Chopper.x, Chopper.y);
        ctx.drawImage(sonicBoom9,Chopper.x, Chopper.y);

        location.reload();  

    }


    Chopper.y += gravity;
    Chopper.x -= gForce;
    
    cx.font = "26px Verdana";
    cx.fillStyle = "#FFFFFF"
    cx.fillText("Score : "+score,myCanvas.width-150,myCanvas.height-20);
    
    requestAnimationFrame(draw);
    
}

draw();




//this seems to prevent the scrolling default behavior of the spacebar, albeit glitchy. decided to not use spacebar and rerouted laser to 'l'
/*
window.addEventListener('keydown', function(e) {
    if(e.keyCode == 32 && e.target == document.body) {
      e.preventDefault();
    }
  });



 //trying to make it rain

var init = [];
var maxParts = 1000;

for (var a = 0; a < maxParts; a++) {
    init.push({
      x: Math.random() * myCanvas.width,
      y: Math.random() * myCanvas.height,
      l: Math.random() * 1,
      xs: -4 + Math.random() * 4 + 2,
      ys: Math.random() * 10 + 10
    })
  }

  var particles = [];
  for (var b = 0; b < maxParts; b++) {
    particles[b] = init[b];
  }

  function rain() {
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    for (var c = 0; c < particles.length; c++) {
      var p = particles[c];
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
      ctx.stroke();
    }
    move();
  }

  function move() {
    for (var b = 0; b < particles.length; b++) {
      var p = particles[b];
      p.x += p.xs;
      p.y += p.ys;
      if (p.x > myCanvas.width || p.y > myCanvas.height) {
        p.x = Math.random() * myCanvas.width;
        p.y = -20;
      }
    }
  }

  setInterval(rain, 30);

  */