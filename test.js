var keyTab = [{note:'C3', freq:261, key:'w',  keyCode:87,  press:false, osc: undefined, div: undefined},
              {note:'D3', freq:293, key:'x',  keyCode:88,  press:false, osc: undefined, div: undefined},
              {note:'E3', freq:329, key:'c',  keyCode:67,  press:false, osc: undefined, div: undefined},
              {note:'F3', freq:349, key:'v',  keyCode:86,  press:false, osc: undefined, div: undefined},
              {note:'G3', freq:392, key:'b',  keyCode:66,  press:false, osc: undefined, div: undefined},
              {note:'A3', freq:440, key:'n',  keyCode:78,  press:false, osc: undefined, div: undefined},
              {note:'B3', freq:494, key:',',  keyCode:188, press:false, osc: undefined, div: undefined},
              {note:'C4', freq:523, key:';',  keyCode:59,  press:false, osc: undefined, div: undefined},
              {note:'D4', freq:587, key:':',  keyCode:58,  press:false, osc: undefined, div: undefined}];

function showme(event){
    // console.log(event);
    for (var i = 0; i < keyTab.length; i++) {
        if(keyTab[i].keyCode == event.keyCode && !keyTab[i].press){
            keyTab[i].press = true;
            playNote(keyTab[i]);
            keyTab[i].div = createDivNote(keyTab[i]);
            break
        }
    }
}

function stopit(event){
    for (var i = 0; i < keyTab.length; i++) {
      if(keyTab[i].keyCode == event.keyCode){
          keyTab[i].press = false;
          stopNote(keyTab[i]);
          var parentElement = document.getElementsByClassName('principal')[0];
          parentElement.removeChild(keyTab[i].div);
          break;
      }
    }
}


function init(){
  document.addEventListener("keydown",showme);
  document.addEventListener("keyup", stopit);
  initAudio();
  console.log("chargemnt terminer");
}

init();

var masterVolume;
var context;

function initAudio(){
    context = new AudioContext();
    masterVolume = context.createGain();

    masterVolume.gain.value = 0.2;
    masterVolume.connect(context.destination);
}



function playNote(note){
    var osc = context.createOscillator();
    var osc2 = context.createOscillator();
    //
    var osca = context.createOscillator();

    var tab = [];
    osc.type = 'sine';
    osc.frequency.value = note.freq;
    osc.detune.value = -10;


    osca.type = 'triangle';
    osca.frequency.value = note.freq;
    osca.detune = -5;

    osc2.type = 'sine';
    osc2.frequency = note.freq * 2 + 2;
    osc2.detune.value = -10;


    tab.push(osc, osc2, osca);

    note.osc = tab;

    for (var i = 0; i < tab.length; i++) {
      tab[i].connect(masterVolume);
      tab[i].start(context.currentTime);
    }
}

function stopNote(note){
  for (var i = 0; i < note.osc.length; i++) {
    note.osc[i].stop(context.currentTime);
  }
}

function createDivNote(note){
    var div = document.createElement('div');
    var rgb = "rgb(" + rand(255).toString() + "," + rand(255) + "," + rand(255)+ ")";
    // div.style.backgroundColor = rgb;
    div.style.border = "3px solid " + rgb;
    div.style.borderRadius = "100%";
    div.style.position = "absolute";
    div.style.top = randBetween(10,20).toString() + '%';
    div.style.height = "4vh";
    div.style.width = "4vh";
    div.className += "anim"

    if(note.note == "C3"){
      div.style.left = randBetween(0,10).toString() + "%";
    }else if (note.note == "D3") {
      div.style.left = randBetween(10,20).toString() + "%";
    }else if (note.note == "E3") {
      div.style.left = randBetween(10,30).toString() + "%";
    }else if (note.note == "F3") {
      div.style.left = randBetween(10,40).toString() + "%";
    }else if (note.note == "G3") {
      div.style.left = randBetween(10,50).toString() + "%";
    }else if (note.note == "A3") {
      div.style.left = randBetween(10,60).toString() + "%";
    }else if (note.note == "B3") {
      div.style.left = randBetween(10,70).toString() + "%";
    }else if(note.note == "C4"){
      div.style.left = randBetween(10,80).toString() + "%";
    }else if (note.note == "D4") {
      div.style.left = randBetween(8,90).toString() + "%";
    }
    var parentElement = document.getElementsByClassName('principal')[0];
    parentElement.appendChild(div);
    return div;
}



function rand(a){
    return Math.floor(Math.random()*a);
}

function randBetween(a, b){
  return Math.floor(Math.random()*a + b);

}
