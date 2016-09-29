var idNumber = 0;
function idGen(str) {
    return str + idNumber.toString();
}
var elePrincipal = document.getElementsByClassName('principal')[0];
var Canvas = (function () {
    function Canvas(originX, originY, width, height, id) {
        this.originX = originX;
        this.originY = originY;
        this.width = width;
        this.height = height;
        this.id = id;
        this.canvas = document.createElement('canvas');
        this.canvas.pointerEvents = "none";
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.id = id;
        this.canvas.style.position = "absolute";
        this.canvas.style.top = originY;
        this.canvas.style.left = originX;
        this.html = this.createCanvas(elePrincipal);
    }
    Canvas.prototype.createCanvas = function (parentElement) {
        elePrincipal.appendChild(this.canvas);
        return this.canvas;
    };
    return Canvas;
}());
var RoueDentée = (function () {
    function RoueDentée(left, right) {
        this.canvas = new Canvas(rand(window.innerWidth), rand(window.innerHeight), 80, 80, idGen("canvas"));
        this.htmlCanvas = this.canvas.html;
        this.context = this.htmlCanvas.getContext('2d');
        this.originX = this.canvas.width / 2;
        this.originY = this.canvas.height / 2;
        this.lineWidth = 3;
        this.acLength = 0;
        this.maxLength = 25;
        this.duree = 10;
        this.speed = 2;
        this.limitLeft = left;
        this.limitRight = right;
        this.htmlCanvas.style.position = "absolute";
        this.rgb = "rgb(" + rand(255).toString() + "," + rand(255) + "," + rand(255) + ")";
        this.avancement = 0;
        this.randomPlacement();
    }
    RoueDentée.prototype.animate = function () {
        this.clearCanvas();
        this.context.strokeStyle = this.rgb;
        this.context.lineWidth = this.lineWidth;
        // top
        this.context.beginPath();
        this.context.moveTo(this.originX, this.originY - this.avancement / 2);
        this.context.lineTo(this.originX, this.originY - this.avancement / 2 - this.acLength);
        this.context.closePath();
        this.context.stroke();
        // top right
        this.context.beginPath();
        this.context.moveTo(this.originX + this.avancement / 2, this.originY - this.avancement / 2);
        this.context.lineTo(this.originX + this.avancement / 2 + this.acLength / 1.2, this.originY - this.avancement / 2 - this.acLength / 1.2);
        this.context.stroke();
        this.context.closePath();
        // right
        this.context.beginPath();
        this.context.moveTo(this.originX + this.avancement / 2, this.originY);
        this.context.lineTo(this.originX + this.avancement / 2 + this.acLength, this.originY);
        this.context.stroke();
        this.context.closePath();
        // bottom right
        this.context.beginPath();
        this.context.moveTo(this.originX + this.avancement / 2, this.originY + this.avancement / 2);
        this.context.lineTo(this.originX + this.avancement / 2 + this.acLength / 1.2, this.originY + this.avancement / 2 + this.acLength / 1.2);
        this.context.stroke();
        this.context.closePath();
        //bottom
        this.context.beginPath();
        this.context.moveTo(this.originX, this.originY + this.avancement / 2);
        this.context.lineTo(this.originX, this.originY + this.avancement / 2 + this.acLength);
        this.context.stroke();
        this.context.closePath();
        // bottom left
        this.context.beginPath();
        this.context.moveTo(this.originX - this.avancement / 2, this.originY + this.avancement / 2);
        this.context.lineTo(this.originX - this.avancement / 2 - this.acLength, this.originY + this.avancement / 2 + this.acLength / 1.2);
        this.context.stroke();
        this.context.closePath();
        // left
        this.context.beginPath();
        this.context.moveTo(this.originX - this.avancement / 2, this.originY);
        this.context.lineTo(this.originX - this.avancement / 2 - this.acLength, this.originY);
        this.context.stroke();
        this.context.closePath();
        // top left
        this.context.beginPath();
        this.context.moveTo(this.originX - this.avancement / 2, this.originY - this.avancement / 2);
        this.context.lineTo(this.originX - this.avancement / 2 - this.acLength / 1.2, this.originY - this.avancement / 2 - this.acLength / 1.2);
        this.context.stroke();
        this.context.closePath();
        if (this.avancement < this.canvas.width / 2) {
            this.acLength > this.maxLength ? this.acLength : this.acLength += 1;
            this.avancement += this.speed;
            this.time = setTimeout(this.animate.bind(this), this.duree);
        }
        else if (this.avancement >= this.canvas.width / 2 && this.acLength > 0) {
            this.avancement += 2;
            this.acLength -= 2;
            this.time = setTimeout(this.animate.bind(this), this.duree);
        }
        else {
            this.avancement = 0;
            this.acLength = 0;
            this.reset();
            clearTimeout(this.time);
        }
    };
    RoueDentée.prototype.clearCanvas = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    RoueDentée.prototype.reset = function () {
        this.rgb = "rgb(" + rand(255).toString() + "," + rand(255) + "," + rand(255) + ")";
        this.avancement = 0;
        this.acLength = 0;
        this.randomPlacement();
    };
    RoueDentée.prototype.randomPlacement = function () {
        this.htmlCanvas.style.top = randBetween(20, 40) + "%";
        this.htmlCanvas.style.left = randBetween(this.limitRight, this.limitLeft) + "%";
    };
    return RoueDentée;
}());
// return an integer between 0 and a
function rand(a) {
    return Math.floor(Math.random() * a);
}
//return a positiv integer between b and a
function randBetween(a, b) {
    return rand(a) + b;
}
