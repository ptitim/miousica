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
              {note:'D4#', freq:622, key:'m',  keyCode:77,  press:false, osc: undefined, div: undefined},];

var piano = new Tone.PolySynth(4, Tone.Synth,{
  "volume": -3,
  "harmonicity": 0.5,
  "modulationIndex": 1.2,
  "oscillator": {
    "type": "sine",
    "modulationType": "sine",
    "modulationIndex": 1,
    "harmonicity": 5
  },
  "envelope": {
    "attack": 0,
    "decay": 0.1,
    "sustain": 1,
    "release": 1
  },
  "modulation": {
    "type": "sawtooth"
  },
  "modulationEnvelope": {
    "attack": 0.5,
    "decay": 0.25,
    "sustain": 0.25,
    "release": 0.5
  }
}).toMaster();

function play(event){
    var code = event.keycode;
    for (var i = 0; i < keyTab.length; i++) {
      if((code == keyTab[i].keyCode || event.key == keyTab[i].key) && !keyTab[i].press){
        console.log(event);
        console.log(keyTab[i]);
        keyTab[i].osc = piano;
        piano.triggerAttack(keyTab[i].note, "+0");
        keyTab[i].press = true;
        break;
      }
    }
}

function stop(event){
    for (var i = 0; i < keyTab.length; i++) {
      if(event.keycode == keyTab[i].keyCode || event.key == keyTab[i].key){
                keyTab[i].press = false;
                keyTab[i].osc.triggerRelease(keyTab[i].note);
      }
    }
}

function init(){
    document.addEventListener('keydown', play);
    document.addEventListener('keyup', stop);
}

init();
