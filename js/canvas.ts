var idNumber: number = 0;
function idGen(str:string){
  return str + idNumber.toString();
}
var elePrincipal: any = document.getElementsByClassName('principal')[0];

class Canvas{
  private canvas:any;
  private html: HTMLElement;

  constructor(private originX:number,private originY: number,private width:number,private height: number, public id:string){
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.id = id;
    this.canvas.style.position = "absolute";
    this.canvas.style.top = originY;
    this.canvas.style.left = originX;
    this.html = this.createCanvas(elePrincipal);
  }
  createCanvas(parentElement: HTMLElement){
    elePrincipal.appendChild(this.canvas);
    return this.canvas;
  }
}

class RoueDentée{
  private originX:number;
  private originY:number;
  private avancement:number;

  private acLength:number;
  private maxLength:number;

  private rgb:string;
  private lineWidth:number;

  public canvas:any;
  public htmlCanvas:any;
  public context:any;

  private time:any;

  constructor(){
    this.canvas = new Canvas(rand(window.innerWidth), rand(window.innerHeight), 100, 100, idGen("canvas"));
    this.htmlCanvas = this.canvas.html;
    this.context = this.htmlCanvas.getContext('2d');
    this.originX = this.canvas.width / 2;
    this.originY = this.canvas.height / 2;
    this.lineWidth = 5;
    this.acLength = 0;
    this.maxLength = 25;


    this.rgb = "rgb(" + rand(255).toString() + "," + rand(255) + "," + rand(255)+ ")";
    this.avancement = 0;
  }
  animate(){
    this.clearCanvas();
    this.context.strokeStyle = this.rgb;
    this.context.lineWidth = this.lineWidth;


    // top bar
    this.context.beginPath();
    this.context.moveTo(this.originX, this.originY - this.avancement);
    this.context.lineTo(this.originX, this.originY  - this.avancement - this.acLength);
    this.context.closePath();
    this.context.stroke();

    // top right
    this.context.beginPath();
    this.context.moveTo(this.originX + this.avancement,  this.originY - this.avancement);
    this.context.lineTo(this.originX + this.avancement + this.acLength/1.5, this.originY - this.avancement - this.acLength/1.5);
    this.context.stroke();
    this.context.closePath();

    // right
    this.context.beginPath();
    this.context.moveTo(this.originX + this.avancement,  this.originY);
    this.context.lineTo(this.originX + this.avancement + this.acLength, this.originY);
    this.context.stroke();
    this.context.closePath();

    // bottom right
    this.context.beginPath();
    this.context.moveTo(this.originX + this.avancement,  this.originY + this.avancement);
    this.context.lineTo(this.originX + this.avancement + this.acLength/1.5, this.originY + this.avancement + this.acLength);
    this.context.stroke();
    this.context.closePath();

    //bottom
    this.context.beginPath();
    this.context.moveTo(this.originX,  this.originY + this.avancement);
    this.context.lineTo(this.originX, this.originY  + this.avancement + this.acLength);
    this.context.stroke();
    this.context.closePath();

    // bottom left
    this.context.beginPath();
    this.context.moveTo(this.originX - this.avancement,  this.originY);
    this.context.lineTo(this.originX, this.originY  + this.avancement + this.acLength);
    this.context.stroke();
    this.context.closePath();

    // left
    this.context.beginPath();
    this.context.moveTo(this.originX,  this.originY + this.avancement);
    this.context.lineTo(this.originX, this.originY  + this.avancement + this.acLength);
    this.context.stroke();
    this.context.closePath();

    // top left
    this.context.beginPath();
    this.context.moveTo(this.originX,  this.originY + this.avancement);
    this.context.lineTo(this.originX, this.originY  + this.avancement + this.acLength);
    this.context.stroke();
    this.context.closePath();

    if(this.avancement < this.canvas.width/2){
      console.log("this",this.avancement);
      this.acLength > this.maxLength ? this.acLength: this.acLength+=3;
      // this.acLength > this.maxLength ? this.avancement++: this.avancement++;

      this.avancement+=2;
      this.time = setTimeout(this.animate.bind(this),10);
    }else{
      this.reset();
      clearTimeout(this.time);
    }
  }
  clearCanvas(){
    this.context.clearRect(0 ,0, this.canvas.width, this.canvas.height);
  }
  reset(){
    this.rgb = "rgb(" + rand(255).toString() + "," + rand(255) + "," + rand(255)+ ")";
    this.avancement = 0;
    this.acLength = 0;
  }

}

var a = new RoueDentée();
