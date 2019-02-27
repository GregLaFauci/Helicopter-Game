let myCanvas=document.getElementById('gameScreen');
let ctx=myCanvas.getContext('2d');

myCanvas.width=window.innerWidth-50;
myCanvas.height=window.innerHeight-50;

var helicopter = new Image();
var mountain = new Image();
helicopter.src = '/assets/helicopter.png';
// mountain.src = '/assets/mountain.png';

function drawMountain(){
  ctx.beginPath();
  ctx.drawImage(mountain,0,myCanvas.height-mountain.height,myCanvas.width,myCanvas.height);
  ctx.closePath();
}
mountain.onload=function(){
  drawMountain();
}




// mountain.onload = function() { 
//     // the initial image height 
//     var imgWidth = 0; 
  
//     // the scroll speed 
//     // an important thing to ensure here is that can.height 
//     // is divisible by scrollSpeed 
//     var scrollSpeed = 10; 

//     ctx.save();
  
//     // this is the primary animation loop that is called 60 times 
//     // per second 
//     function loop() 
//     { 
//         // draw image 1 
//         ctx.drawImage(mountain, imgWidth, myCanvas.height - mountain.height, ); 

//         drawImage(mountain, 0, can.height- moun.height, can.widht, can.height)
  
//         // draw image 2 
//         ctx.drawImage(mountain, imgWidth - myCanvas.width, 0); 
  
//         // update image width 
//         imgWidth += scrollSpeed; 
  
//         // reseting the images when the first image entirely exits the screen 
//         if (imgWidth == myCanvas.width) 
//             ctx.clearRect(0,0,myCanvas.width,myCanvas.height);
//             imgWidth = 0; 
  
//         // this function creates a 60fps animation by scheduling a 
//         // loop function call before the 
//         // next redraw every time it is called 
//         window.requestAnimationFrame(loop); 
//     } 
//     ctx.restore();
  
//     // this initiates the animation by calling the loop function 
//     // for the first time 
//     loop(); 
// }
  





let x=0;
let y=100;
let dx=30;
let dy=30;

function drawHelicopter(){
   ctx.beginPath();
   //This makes sure of right and left boundary(x)
   if(x+50>myCanvas.width ||x<0){ //adding 
      
       
   }
   //This makes sure of top and bottom boundary(y)
   if(y+50>myCanvas.height ||y<0){
       
   }
   

   ctx.clearRect(0,0,myCanvas.width,myCanvas.height);
   ctx.drawImage(helicopter,x,y);
   ctx.closePath();
}


////LETS TRY TO MANIPULATE THE HELICOPTER'S PATH ACCORDING TO ARROW KEYS( -> <- etc,). SO WE NEED TO HANDLE KEYPRESS/KEYUP EVENT HANDLER.




window.addEventListener('keydown',
  function(event){
      console.log(event);

      switch(event.keyCode){
          case 38:
            //keyCode 38 is arrow up
            y-=dy;
          break;

          case 40:
            //keyCode 40 is arrow down
            y+=dy;
          break;

          case 37:
            //keyCode 37 is arrow left
            x-=dx;
          break;

          case 39:
            //keyCode 39 is arrow right
            x+=dx;
          break;

          default:
           break;
      }

      drawHelicopter();
      drawMountain();

  }
);
