var idNumber = 0;
function idGen(str) {
    return str + idNumber.toString();
}
var elePrincipal = document.getElementById('principal');
var Canvas = (function () {
    function Canvas(originX, originY, width, height, id) {
        this.originX = originX;
        this.originY = originY;
        this.width = width;
        this.height = height;
        this.id = id;
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.id = id;
        this.canvas.style.position = "absolute";
        this.canvas.style.top = originY;
        this.canvas.style.left = originX;
        this.html = this.createCanvas(elePrincipal);
    }
    Canvas.prototype.createCanvas = function (parentElement) {
        parentElement.appendChild(this.canvas);
        return this.canvas;
    };
    return Canvas;
})();
var RoueDentée = (function () {
    function RoueDentée() {
        this.canvas = new Canvas(rand(window.innerWidth), rand(window.innerHeight), 100, 100, idGen("canvas"));
        this.htmlCanvas = this.canvas.html;
        this.context = this.htmlCanvas.getContext('2d');
        this.originX = this.canvas.width / 2;
        this.originY = this.canvas.height / 2;
        this.rgb = "rgb(" + rand(255).toString() + "," + rand(255) + "," + rand(255) + ")";
        this.avancement = 0;
    }
    RoueDentée.prototype.animate = function () {
        if (this.avancement < this.canvas.width) {
            this.avancement++;
            this.animate();
        }
    };
    return RoueDentée;
})();
