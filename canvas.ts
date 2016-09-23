class Canvas{
    private canvas:any;

    constructor(private originX:number,private oiriginY: number,private width:number,private height: number, public id:string){
      this.canvas = document.createElement('canvas');
      this.canvas.width = width;
      this.canvas.height = height;
      this.canvas.id = id;
    }
    createCanvas(parentElement: HTMLElement){
        parentElement.appendChild(this.canvas);
        return this.canvas;
    }
}
