var keyTab = [{note:'C3', freq:261, key:'w',  keyCode:87,  press:false, osc: undefined, div: undefined},
              {note:'D3', freq:293, key:'x',  keyCode:88,  press:false, osc: undefined, div: undefined},
              {note:'E3', freq:329, key:'c',  keyCode:67,  press:false, osc: undefined, div: undefined},
              {note:'F3', freq:349, key:'v',  keyCode:86,  press:false, osc: undefined, div: undefined},
              {note:'G3', freq:392, key:'b',  keyCode:66,  press:false, osc: undefined, div: undefined},
              {note:'A3', freq:440, key:'n',  keyCode:78,  press:false, osc: undefined, div: undefined},
              {note:'B3', freq:494, key:',',  keyCode:188, press:false, osc: undefined, div: undefined},
              {note:'C4', freq:523, key:';',  keyCode:59,  press:false, osc: undefined, div: undefined},
              {note:'D4', freq:587, key:':',  keyCode:58,  press:false, osc: undefined, div: undefined},
              {note:'C#', freq:277, key:'s',  keyCode:83,  press:false, osc: undefined, div: undefined},
              {note:'D#', freq:311, key:'d',  keyCode:68,  press:false, osc: undefined, div: undefined},
              {note:'F#', freq:370, key:'g',  keyCode:71,  press:false, osc: undefined, div: undefined},
              {note:'G#', freq:415, key:'h',  keyCode:72,  press:false, osc: undefined, div: undefined},
              {note:'A#', freq:466, key:'j',  keyCode:74,  press:false, osc: undefined, div: undefined},
              {note:'C#', freq:554, key:'l',  keyCode:76,  press:false, osc: undefined, div: undefined},
              {note:'D#', freq:622, key:'m',  keyCode:77,  press:false, osc: undefined, div: undefined},];

var loopTab = [{ src:"data/loop/looperman-l-1319.wav",  name:"djumbee1",  key:'a', keyCode:65, active: false, audio: undefined},
             { src:"data/loop/2990.wav",  name:"djumbee2",  key:'z', keyCode:66, active: false, audio: undefined},
             { src:"data/loop/6067.wav",  name:"batterie1", key:'r', keyCode:82, active: false, audio: undefined},
             { src:"data/loop/6070.wav",  name:"batterie2", key:'t', keyCode:84, active: false, audio: undefined},
             { src:"data/loop/6071.wav",  name:"batterie3", key:'y', keyCode:89, active: false, audio: undefined},
             { src:"data/loop/6073.wav",  name:"batterie4", key:'u', keyCode:86, active: false, audio: undefined},
             { src:"data/loop/21433.wav", name:"rock1",     key:'o', keyCode:79, active: false, audio: undefined},
             { src:"data/loop/21437.wav", name:"rock2",     key:'p', keyCode:80, active: false, audio: undefined}];


// var freeverb = new Tone.Freeverb(0.2, 1000).toMaster();
var chorus = new Tone.Chorus().toMaster();
var piano = new Tone.PolySynth(6, Tone.Synth,{
  "volume": -12,
  "harmonicity": 2,
  "modulationIndex": 1.2,
  "oscillator": {
    "type": "triangle",
    "modulationType": "sine",
    "modulationIndex": 2,
    "harmonicity": 8
  },
  "envelope": {
    "attack": 0,
    "decay": 4,
    "sustain": 1,
    "release": 0.3
  }
}).connect(chorus);



function play(event){
    var code = event.keycode || event.key;
    for (var i = 0; i < keyTab.length; i++) {
      if((code == keyTab[i].keyCode || code == keyTab[i].key) && !keyTab[i].press){
        console.log(event);
        console.log(keyTab[i]);
        keyTab[i].osc = piano;
        piano.triggerAttackRelease(keyTab[i].freq, 0.5);
        keyTab[i].press = true;
        break;
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

function stop(event){
    for (var i = 0; i < keyTab.length; i++) {
      if(event.keycode == keyTab[i].keyCode || event.key == keyTab[i].key){
                keyTab[i].press = false;
                keyTab[i].osc.triggerRelease(keyTab[i].freq);
      }
    }
}

function init(){
    document.addEventListener('keydown', play);
    document.addEventListener('keyup', stop);
}

init();


function launchLoop(loop){
      myAudio = new Audio(loop);
      myAudio.addEventListener('ended', function() {
          this.currentTime = 0;
          this.play();
      }, false);
      myAudio.play();
      return myAudio;
}
