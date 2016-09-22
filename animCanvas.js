var canvas;
var context;

var tailleMin;
var tailleMax;
var tailleAct;

var xpos;
var ypos;
var vitesse;

var originx;
var originy;

var finx;
var finy;
var interval = [];

var rgb = "rgb(" + rand(255).toString() + "," + rand(255) + "," + rand(255)+ ")";
canvas = document.getElementById('canvas');
context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


function initCanvas(){
    interval.push(setInterval(animate,30));
    tailleMax = 30;
    tailleMin = 5;
    tailleAct = tailleMin +1;

    originx = rand(canvas.width);
    originy = rand(canvas.height);


    xpos = originx;
    ypos = originy;

    finx = xpos + 150;
    finy = ypos - 50;

    vitesse = 3;
    rgb = "rgb(" + rand(255).toString() + "," + rand(255) + "," + rand(255)+ ")";

}


function animate(){
    context.strokeStyle = rgb;
    context.lineWidth = 5;
    if(xpos <= finx && ypos >= finy && tailleAct < tailleMax){
      clearCanvas();
      context.beginPath();
      context.moveTo(originx, originy);
      context.lineTo(originx+tailleAct, originy-tailleAct);
      context.stroke();
      context.closePath()
      tailleAct += vitesse;
    }else if (xpos <= finx && ypos >= finy && tailleAct >= tailleMax) {
        clearCanvas();
        context.beginPath();
        context.moveTo(xpos, ypos);
        context.lineTo(xpos+tailleMax, ypos-tailleMax);
        context.closePath();
        context.stroke();
        xpos += vitesse;
        ypos -= vitesse;
    }else if (tailleAct > tailleMin) {
        clearCanvas();
        context.beginPath();
        context.moveTo(xpos,ypos);
        context.lineTo(xpos+tailleAct, ypos-tailleAct);
        context.closePath();
        context.stroke();
        xpos += vitesse;
        ypos -= vitesse;
        tailleAct -= vitesse;
    }else{
      clearAllIntervals(interval);
      initCanvas();
      console.log("new trait");
      return;
    }
}

function clearCanvas(){
  context.clearRect(0,0,canvas.width, canvas.height);
}

function clearAllIntervals(tab){
    for (var i = 0; i < tab.length; i++) {
      clearInterval(tab[i]);
    }
}
