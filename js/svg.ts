function svgTest(){
  var princ = document.getElementsByClassName('principal')[0];
  var svg = SVG(princ).size(1000,1000);
  var image = svg.image('data/img/blue-154328.svg');
  image.size(100,100);
}


function createContainer(index:number){
  var ele = document.createElement('div');
  ele.style.position = "absolute";
  ele.style.top = randBetween(20,19).toString() + "%";
}
