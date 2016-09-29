function svgTest(){
  var princ = document.getElementsByClassName('principal')[0];
  var svg = SVG(princ).size(1000,1000);

  var image = svg.image('data/img/blue-154328.svg');
  image.size(100,100);
}
