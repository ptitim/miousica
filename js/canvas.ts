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
  private originX:number;//central point
  private originY:number;//central point
  private avancement:number;
  private speed:number;

  private acLength:number;//actual length of 'sticks'
  private maxLength:number; //max lengh of 'sticks'

  private rgb:string;//color of the animation, radomize  at every callback
  private lineWidth:number;

  public canvas:any;//object canvas constructor upside
  public htmlCanvas:any;//html element of canvas
  public context:any;

  private time:any;//contains timeout
  private duree:number;//propertie of timeout time in milliseconds

  constructor(){
    this.canvas = new Canvas(rand(window.innerWidth), rand(window.innerHeight), 80, 80, idGen("canvas"));
    this.htmlCanvas = this.canvas.html;
    this.context = this.htmlCanvas.getContext('2d');
    this.originX = this.canvas.width / 2;
    this.originY = this.canvas.height / 2;
    this.lineWidth = 3;
    this.acLength = 0;
    this.maxLength = 25;
    this.duree = 1;
    this.speed = 2;

    this.htmlCanvas.style.position = "absolute";
    this.rgb = "rgb(" + rand(255).toString() + "," + rand(255) + "," + rand(255)+ ")";
    this.avancement = 0;
    this.randomPlacement();
  }
  animate(){
    this.clearCanvas();
    this.context.strokeStyle = this.rgb;
    this.context.lineWidth = this.lineWidth;


    // top
    this.context.beginPath();
    this.context.moveTo(this.originX, this.originY - this.avancement/2);
    this.context.lineTo(this.originX, this.originY  - this.avancement/2 - this.acLength);
    this.context.closePath();
    this.context.stroke();

    // top right
    this.context.beginPath();
    this.context.moveTo(this.originX + this.avancement/2,  this.originY - this.avancement/2);
    this.context.lineTo(this.originX + this.avancement/2 + this.acLength/1.2, this.originY - this.avancement/2 - this.acLength/1.2);
    this.context.stroke();
    this.context.closePath();

    // right
    this.context.beginPath();
    this.context.moveTo(this.originX + this.avancement/2,  this.originY);
    this.context.lineTo(this.originX + this.avancement/2 + this.acLength, this.originY);
    this.context.stroke();
    this.context.closePath();

    // bottom right
    this.context.beginPath();
    this.context.moveTo(this.originX + this.avancement/2,  this.originY + this.avancement/2);
    this.context.lineTo(this.originX + this.avancement/2 + this.acLength/1.2, this.originY + this.avancement/2 + this.acLength/1.2);
    this.context.stroke();
    this.context.closePath();

    //bottom
    this.context.beginPath();
    this.context.moveTo(this.originX,  this.originY + this.avancement/2);
    this.context.lineTo(this.originX, this.originY  + this.avancement/2 + this.acLength);
    this.context.stroke();
    this.context.closePath();

    // bottom left
    this.context.beginPath();
    this.context.moveTo(this.originX - this.avancement/2,  this.originY + this.avancement/2);
    this.context.lineTo(this.originX - this.avancement/2 - this.acLength, this.originY  + this.avancement/2 + this.acLength/1.2);
    this.context.stroke();
    this.context.closePath();

    // left
    this.context.beginPath();
    this.context.moveTo(this.originX - this.avancement/2,  this.originY);
    this.context.lineTo(this.originX - this.avancement/2 - this.acLength, this.originY);
    this.context.stroke();
    this.context.closePath();

    // top left
    this.context.beginPath();
    this.context.moveTo(this.originX - this.avancement/2,  this.originY - this.avancement/2);
    this.context.lineTo(this.originX - this.avancement/2 - this.acLength/1.2, this.originY  - this.avancement/2 - this.acLength/1.2);
    this.context.stroke();
    this.context.closePath();

    if(this.avancement < this.canvas.width/2){
      console.log("this",this.avancement);
      this.acLength > this.maxLength ? this.acLength: this.acLength+=1;
      this.avancement += this.speed;
      this.time = setTimeout(this.animate.bind(this),this.duree);
    }else if(this.avancement >= this.canvas.width/2 && this.acLength >0){
      console.log("this length",this.acLength);
      this.avancement += 2;
      this.acLength -= 2;
      this.time = setTimeout(this.animate.bind(this),this.duree);
    }else{
      this.avancement = 0;
      this.acLength = 0;
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
    this.randomPlacement();
  }
  randomPlacement(){
      this.htmlCanvas.style.top = rand(80)+"%";
      this.htmlCanvas.style.left = rand(80)+"%";
  }

}

var a = new RoueDentée();
