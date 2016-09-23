// return an integer between 0 and a
function rand(a:number){
  return Math.floor(Math.random()*a);
}

//return a positiv integer between b and a
function randBetween(a:number, b:number){
  return rand(a) + b
}
