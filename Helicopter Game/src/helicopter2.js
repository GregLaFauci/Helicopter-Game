let myCanvas=document.getElementById('gameScreen');
let ctx=myCanvas.getContext('2d');

// myCanvas.width=window.innerWidth-50;
// myCanvas.height=window.innerHeight-50;

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

// load images

var background = new Background();
var helicopter = new Image();
var missile = new Image();
var fireball = new Image();

missile.src = "/assets/missile.png";
helicopter.src = "/assets/helicopter.png";
fireball.src="/assets/fireball.png";

 /*###################
        OBJECTS
###################*/
// fireball coordinates
var fire = [];
// fire[0] = {
//     x: myCanvas.width,
//     y: Math.random()*myCanvas.height,
//     height : fireball.height,
//     width : fireball.width
// };

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


// starting variables
var yStart;
var gravity = 2;
var score = 0;

//first fireball
// fire[0] = new Fireball();
//helicopter starting position
// var bX = 150;
// var bY = 150;

// on key down
document.addEventListener('keydown',
  function(event){

      switch(event.keyCode){
          case 38:
            //keyCode 38 is arrow up
            Chopper.y -=25;
          break;

          case 40:
            //keyCode 40 is arrow down
            
          break;

          case 37:
            //keyCode 37 is arrow left
            //FIRE MISSILE
            console.log('missile away')
            missiles.push(new Missile());
          break;

          case 39:
            //keyCode 39 is arrow right
            //FIRE LASER
          break;

          default:
           break;
      }
    });



setInterval(function(){
    fire.push(new Fireball())
    console.log(fire);

}, 2000);
// draw images
function draw(){
    ctx.clearRect(0,0,myCanvas.width,myCanvas.height);

    background.draw(ctx);
   
    for(var i = 0; i < fire.length; i++){
        yStart = Math.random()*1000;
    
        // ctx.drawImage(fireball,fire[i].x,fire[i].y);
        ctx.drawImage(fireball,fire[i].x,fire[i].y);

                 
        fire[i].x-=10;
        

        
        // if( fire[i].x == 500 ){
        //     fire.push({
        //         x : myCanvas.width,
        //         y : Math.random()*myCanvas.height,
        //         height : fireball.height,
        //         width : fireball.width
        //     }); 
        // }

        if(isCollide(Chopper,fire[i])){
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
                deleteObjects(arr,j,fire,i);
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
        location.reload(); //Crash 
    }
    if(Chopper.y <= 0){
        Chopper.y += gravity*2;
    }
    Chopper.y += gravity;
    
    ctx.font = "26px Verdana";
    ctx.fillStyle = "#FFFFFF"
    ctx.fillText("Score : "+score,myCanvas.width-150,myCanvas.height-20);
    
    requestAnimationFrame(draw);
    
}

draw();