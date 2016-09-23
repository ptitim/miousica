var idNumber: number = 0;
function idGen(str:string){
  return str + idNumber.toString();
}
var elePrincipal: HTMLElement = document.getElementById('principal');

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
    parentElement.appendChild(this.canvas);
    return this.canvas;
  }
}

class RoueDentée{
  private originX:number;
  private originY:number;
  private avancement:number;

  private rgb:string;
  public canvas:any;
  public htmlCanvas:any;
  public context:any;

  constructor(){
    this.canvas = new Canvas(rand(window.innerWidth), rand(window.innerHeight), 100, 100, idGen("canvas"));
    this.htmlCanvas = this.canvas.html;
    this.context = this.htmlCanvas.getContext('2d');
    this.originX = this.canvas.width / 2;
    this.originY = this.canvas.height / 2;

    this.rgb = "rgb(" + rand(255).toString() + "," + rand(255) + "," + rand(255)+ ")";
    this.avancement = 0;
  }
  animate(){

    if(this.avancement < this.canvas.width){
      this.avancement++;
      this.animate();
    }
  }

}
