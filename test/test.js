var keyTab = [{note:'C3', freq:261, key:'w',  keyCode:87,  press:false, osc: undefined, div: undefined},
              {note:'D3', freq:293, key:'x',  keyCode:88,  press:false, osc: undefined, div: undefined},
              {note:'E3', freq:329, key:'c',  keyCode:67,  press:false, osc: undefined, div: undefined},
              {note:'F3', freq:349, key:'v',  keyCode:86,  press:false, osc: undefined, div: undefined},
              {note:'G3', freq:392, key:'b',  keyCode:66,  press:false, osc: undefined, div: undefined},
              {note:'A3', freq:440, key:'n',  keyCode:78,  press:false, osc: undefined, div: undefined},
              {note:'B3', freq:494, key:',',  keyCode:188, press:false, osc: undefined, div: undefined},
              {note:'C4', freq:523, key:';',  keyCode:59,  press:false, osc: undefined, div: undefined},
              {note:'D4', freq:587, key:':',  keyCode:58,  press:false, osc: undefined, div: undefined},
              {note:'C3#', freq:277, key:'s',  keyCode:83,  press:false, osc: undefined, div: undefined},
              {note:'D3#', freq:311, key:'d',  keyCode:68,  press:false, osc: undefined, div: undefined},
              {note:'F3#', freq:370, key:'g',  keyCode:71,  press:false, osc: undefined, div: undefined},
              {note:'G3#', freq:415, key:'h',  keyCode:72,  press:false, osc: undefined, div: undefined},
              {note:'A3#', freq:466, key:'j',  keyCode:74,  press:false, osc: undefined, div: undefined},
              {note:'C4#', freq:554, key:'l',  keyCode:76,  press:false, osc: undefined, div: undefined},
              {note:'D4#', freq:622, key:'m',  keyCode:77,  press:false, osc: undefined, div: undefined}];

var instruments = [ {name: "organ",  h1:2, h2:28/27, h3:3    , delay: 1000},
                   {name: "organ2", h1:2 ,h2:55/28, h3:1/2  , delay: 1000},
                   {name: "test"   ,h1:2 ,h2:4    , h3:2    , delay: 1000}

]
var loopTab = [{ src:"data/loop/looperman-l-1319.wav",  name:"djumbee1",  key:'a', keyCode:65, active: false, audio: undefined},
               { src:"data/loop/2990.wav",  name:"djumbee2",  key:'z', keyCode:66, active: false, audio: undefined},
               { src:"data/loop/6067.wav",  name:"batterie1", key:'r', keyCode:82, active: false, audio: undefined},
               { src:"data/loop/6070.wav",  name:"batterie2", key:'t', keyCode:84, active: false, audio: undefined},
               { src:"data/loop/6071.wav",  name:"batterie3", key:'y', keyCode:89, active: false, audio: undefined},
               { src:"data/loop/6073.wav",  name:"batterie4", key:'u', keyCode:86, active: false, audio: undefined},
               { src:"data/loop/21433.wav", name:"rock1",     key:'o', keyCode:79, active: false, audio: undefined},
               { src:"data/loop/21437.wav", name:"rock2",     key:'p', keyCode:80, active: false, audio: undefined}];

var stopAllNotes = [];
function showme(event){

  var code = event.keycode || event.key;

    // console.log(event);
    for (var i = 0; i < keyTab.length; i++) {
        if((keyTab[i].keyCode == event.keyCode || keyTab[i].key == event.key) && !keyTab[i].press ){
          // console.log(event);
            keyTab[i].press = true;
            playNote(keyTab[i], instruments[2]);
            keyTab[i].div = createDivNote(keyTab[i]);
            break
        }
    }
    for(var i=0; i < loopTab.length; i++){
      if((code == loopTab[i].keyCode || code == loopTab[i].key) && !loopTab[i].active){
          loopTab[i].audio = launchLoop(loopTab[i].src);
          loopTab[i].active = true;
      }else if ((code == loopTab[i].keyCode || code == loopTab[i].key) && loopTab[i].active) {
          loopTab[i].audio.pause();
          loopTab[i].active = false;
      }
    }
}

function stopit(event){
    // console.log(event);
    for (var i = 0; i < keyTab.length; i++) {
      if(keyTab[i].keyCode == event.keyCode || keyTab[i].key == event.key){
          keyTab[i].press = false;
          stopNote(keyTab[i]);
          var parentElement = event.target;
          parentElement.removeChild(keyTab[i].div);
          break;
      }
    }
}


function init(){
  document.addEventListener("keydown",showme);
  document.addEventListener("keyup", stopit);
  initAudio();
  console.log("chargement terminer");
}

init();

var masterVolume;
var audioContext;

function initAudio(){
    audioContext = new AudioContext();
    masterVolume = audioContext.createGain();
    masterVolume.gain.value = 0.2;
    masterVolume.connect(audioContext.destination);
}



function playNote(note, instrument){
    var osc = audioContext.createOscillator();
    var osc2 = audioContext.createOscillator();
    //
    var osca = audioContext.createOscillator();
    var osc3 = audioContext.createOscillator();

    var tab = [];
    osc.type = 'sine';
    osc.frequency.value = note.freq;

    osca.type = 'sine';
    osca.frequency.value = note.freq*instrument.h1;

    osc2.type = 'sine';
    osc2.frequency = note.freq*instrument.h2;

    osc3.type  ='sine';
    osc3.frequency.value = note.freq*instrument.h3;
    tab.push(osc, osc2, osca, osc3);

    note.osc = tab;

    var harmo = audioContext.createGain();
    harmo .gain.value = 0.01;
    harmo.connect(audioContext.destination);

    for (var i = 0; i < tab.length - 1; i++) {
      tab[i].connect(masterVolume);
      tab[i].start(audioContext.currentTime);
    }
    osc3.connect(harmo);
    osc3.start(audioContext.currentTime);
}

function stopNote(note){
  clearAllIntervals(interval);
  clearCanvas();

  for (var i = 0; i < note.osc.length; i++) {
    note.osc[i].stop(audioContext.currentTime);
  }
}

function createDivNote(note){
    var div = document.createElement('div');
    var rgb = "rgb(" + rand(255).toString() + "," + rand(255) + "," + rand(255)+ ")";
    div.style.border = "5px ridge " + rgb;
    div.style.borderRadius = "100%";
    div.style.position = "absolute";
    div.style.top = randBetween(10,20).toString() + '%';
    div.style.height = "8vh";
    div.style.width = "8vh";
    div.className += "anim";

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
    }else if (note.note == "C3#") {
      div.style.left = randBetween(5,10).toString() + "%";
    }else if (note.note == "D3#") {
      div.style.left = randBetween(5,20).toString() + "%";
    }else if (note.note == "F3#") {
      div.style.left = randBetween(5,30).toString() + "%";
    }else if (note.note == "G3#") {
      div.style.left = randBetween(5,40).toString() + "%";
    }else if (note.note == "A3#") {
      div.style.left = randBetween(5,50).toString() + "%";
    }else if (note.note == "C4#") {
      div.style.left = randBetween(5,80).toString() + "%";
    }else if (note.note == "D4#") {
      div.style.left = randBetween(5,90).toString() + "%";
    }

    var parentElement = document.getElementsByTagName('body')[0];
    parentElement.appendChild(div);
    return div;
}

function launchLoop(loop){
      myAudio = new Audio(loop);
      myAudio.addEventListener('ended', function() {
          this.currentTime = 0;
          this.play();
      }, false);
      myAudio.play();
      initCanvas();
      return myAudio;
}


function rand(a){
    return Math.floor(Math.random()*a);
}

function randBetween(a, b){
  return Math.floor(Math.random()*a + b);

}
