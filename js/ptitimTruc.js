// return an integer between 0 and a
function rand(a) {
    return Math.floor(Math.random() * a);
}
//return a positiv integer between b and a
function randBetween(a, b) {
    return rand(a) + b;
}
