var Canvas = (function () {
    function Canvas(originX, oiriginY, width, height, id) {
        this.originX = originX;
        this.oiriginY = oiriginY;
        this.width = width;
        this.height = height;
        this.id = id;
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.id = id;
    }
    Canvas.prototype.createCanvas = function (parentElement) {
        parentElement.appendChild(this.canvas);
        return this.canvas;
    };
    return Canvas;
})();
