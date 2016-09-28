const KEYTABAZERTY:Array<any>  = [{note:'C3', freq:261, key:'w',  keyCode:87, press: false, object: undefined},
                     {note:'D3', freq:293, key:'x',  keyCode:88, press: false, object: undefined},
                     {note:'E3', freq:329, key:'c',  keyCode:67, press: false, object: undefined},
                     {note:'F3', freq:349, key:'v',  keyCode:86, press: false, object: undefined},
                     {note:'G3', freq:392, key:'b',  keyCode:66, press: false, object: undefined},
                     {note:'A3', freq:440, key:'n',  keyCode:78, press: false, object: undefined},
                     {note:'B3', freq:494, key:',',  keyCode:18, press: false, object: undefined},
                     {note:'C4', freq:523, key:';',  keyCode:59, press: false, object: undefined},
                     {note:'D4', freq:587, key:':',  keyCode:58, press: false, object: undefined},
                     {note:'C3#', freq:277, key:'s',  keyCode:83, press: false, object: undefined},
                     {note:'D3#', freq:311, key:'d',  keyCode:68, press: false, object: undefined},
                     {note:'F3#', freq:370, key:'g',  keyCode:71, press: false, object: undefined},
                     {note:'G3#', freq:415, key:'h',  keyCode:72, press: false, object: undefined},
                     {note:'A3#', freq:466, key:'j',  keyCode:74, press: false, object: undefined},
                     {note:'C4#', freq:554, key:'l',  keyCode:76, press: false, object: undefined},
                     {note:'D4#', freq:622, key:'m',  keyCode:77, press: false, object: undefined}];

const INSTRUMENTS:Array<any> = [{name:"phase",   h1:0.5, h2:2,   decayTonal:0.1,  decayH1:0.3, decayH2:0.1,  gainTonal:0.8, gainH1:0.4, gainH2:0.2},
                                {name:"drum",    h1:0.7, h2:0.2, decayTonal:0.5,  decayH1:0.5, decayH2:0.5,  gainTonal:0.8, gainH1:0.4, gainH2:0.4}
]
var LOOPTAB:Array<any> = [{ src:"data/loop/looperman-l-1319.wav",  name:"djumbee1",  key:'a', keyCode:65, active: false, audio: undefined},
                          { src:"data/loop/2990.wav",  name:"djumbee2",  key:'z', keyCode:66, active: false, audio: undefined},
                          { src:"data/loop/6067.wav",  name:"batterie1", key:'r', keyCode:82, active: false, audio: undefined},
                          { src:"data/loop/6070.wav",  name:"batterie2", key:'t', keyCode:84, active: false, audio: undefined},
                          { src:"data/loop/6071.wav",  name:"batterie3", key:'y', keyCode:89, active: false, audio: undefined},
                          { src:"data/loop/6073.wav",  name:"batterie4", key:'u', keyCode:86, active: false, audio: undefined},
                          { src:"data/loop/21433.wav", name:"rock1",     key:'o', keyCode:79, active: false, audio: undefined},
                          { src:"data/loop/21437.wav", name:"rock2",     key:'p', keyCode:80, active: false, audio: undefined}];

class Note{
  public frequency:number;
  public press:boolean;
  public animation:any;
  public key:string;
  constructor(public note: any, public instrument:any){
      this.press = false;
      this.note = note;
      this.key = note.key;
      this.frequency = this.note.freq;
      this.instrument = this.instrument;

  }
}

class Instrument{
    private gainTonal:any;private decayTonal:number;
    private gainH1 : any;private decayH1:number;
    private gainH2 : any;private decayH2:number;


    private harmo1:number;
    private harmo2:number;

    private gainTonalInitialValue:number;
    private gainH1InitialValue:number;
    private gainH2InitialValue:number;

    private context: any;
    private volume: any;

    private typeOscTonal:string;
    private typeOscH1:string;
    private typeOscH2:string;
    private oscTonal: OscillatorNode;
    private oscH1: OscillatorNode;
    private oscH2: OscillatorNode;

    private gainTonalPreviousValue:number;
    private gainH1IPreviousValue: number;
    private gainH2PreviousValue: number;

    private regTypeOsc: any;

    private oscillators:Array<OscillatorNode>;

    public intervals: any;

    constructor(private prop:any){
                    this.regTypeOsc = /sine|triangle|square|sawtooth/;
                    this.decayTonal = prop.decayTonal;
                    this.harmo1 = prop.h1; this.decayH1 = prop.decayH1;
                    this.harmo2 = prop.h2; this.decayH2 = prop.decayH2;

                    this.setOscTonal("sine");
                    this.setOscH1("sine");
                    this.setOscH2("sine");

                    this.gainTonalInitialValue = prop.gainTonal || 1;
                    this.gainH1InitialValue = prop.gainH1 || 0.5;
                    this.gainH2InitialValue = prop.gainH2 || 0.3;
                    this.intervals = [];

                    this.createContext();
                }

                createContext(){
                    this.context = new AudioContext();
                    this.volume = this.context.createGain();
                    this.volume.gain.value = 0.25;
                    this.volume.connect(this.context.destination);

                    this.gainTonal = this.context.createGain();
                    this.gainH1 = this.context.createGain();
                    this.gainH2 = this.context.createGain();

                    this.gainTonal.gain.value = this.gainTonalPreviousValue = this.gainTonalInitialValue;
                    this.gainH1.gain.value = this.gainH1IPreviousValue = this.gainH1InitialValue;
                    this.gainH2.gain.value = this.gainH2PreviousValue = this.gainH2InitialValue;

                    this.gainTonal.connect(this.volume);
                    this.gainH1.connect(this.volume);
                    this.gainH2.connect(this.volume);
                };

                createOsc(freq: number){
                    this.oscTonal = this.context.createOscillator();
                    this.oscH1 = this.context.createOscillator();
                    this.oscH2 = this.context.createOscillator();

                    this.oscTonal.type = this.typeOscTonal;
                    this.oscH1.type = this.typeOscH1;
                    this.oscH2.type = this.typeOscH2;

                    this.oscTonal.frequency.value = freq;
                    this.oscH1.frequency.value = freq * this.harmo1;
                    this.oscH2.frequency.value = freq * this.harmo2;

                    this.oscTonal.connect(this.gainTonal);
                    this.oscH1.connect(this.gainH1);
                    this.oscH2.connect(this.gainH2);
                    return [this.oscTonal,this.oscH1,this.oscH2];
                };

                play(freq:number){
                    this.oscillators = this.createOsc(freq);
                    this.gainTonal.gain.value = this.gainTonalPreviousValue = this.gainTonalInitialValue;
                    this.gainH1.gain.value = this.gainH1IPreviousValue = this.gainH1InitialValue;
                    this.gainH2.gain.value = this.gainH2PreviousValue = this.gainH2InitialValue;
                    this.intervals = window.setInterval(this.startDecay.bind(this), 100);

                    for (var i = 0; i < this.oscillators.length; i++){
                        this.oscillators[i].start(this.context.currentTime);
                    }
                    return {interval: this.intervals, oscillators: this.oscillators};
                };

                startDecay(){
                  console.log("decay",this.gainTonal.gain.value);
                  console.log("decay h1",this.gainH1.gain.value);
                  console.log("decay h2",this.gainH2.gain.value);

                  this.gainTonal.gain.value =  this.gainTonalPreviousValue - this.decayTonal;
                  this.gainH1.gain.value = this.gainH1IPreviousValue - this.decayH1;
                  this.gainH2.gain.value = this.gainH2PreviousValue - this.decayH2;

                  // gestion des gain negatif
                  this.gainTonal.gain.value  = this.gainTonal.gain.value <= 0 ? 0 : this.gainTonal.gain.value;
                  this.gainH1.gain.value  =this.gainH1.gain.value  <= 0 ? 0 :this.gainH1.gain.value;
                  this.gainH2.gain.value = this.gainH2.gain.value <= 0 ? 0 : this.gainH2.gain.value

                  if(this.gainTonal.gain.value <= 0 && this.gainH1.gain.value <= 0 && this.gainH2.gain.value <= 0){
                      this.stop();
                  }
                  this.gainTonalPreviousValue = this.gainTonal.gain.value.toFixed(2);
                  this.gainH1IPreviousValue = this.gainH1.gain.value.toFixed(2);
                  this.gainH2PreviousValue = this.gainH2.gain.value.toFixed(2);
                };

                stop(){
                  this.gainTonalPreviousValue = this.gainTonal.gain.value = 0;
                  this.gainH1IPreviousValue = this.gainH1.gain.value = 0;
                  this.gainH2PreviousValue = this.gainH2.gain.value = 0;
                  let tmp = this.oscillators.length;
                  for(let i = 0; i < tmp; i++){
                    let a = this.oscillators[i];
                    a.stop();
                  }
                  window.clearInterval(this.intervals);
                }

                setOscTonal(type:string): void{
                  type.match(this.regTypeOsc) ? this.typeOscTonal = type : console.log("Invalid type for oscTonal");
                };
                setOscH1(type:string): void{
                  type.match(this.regTypeOsc)? this.typeOscH1 = type : console.log("Invalid type for oscH1");
                };
                setOscH2(type:string): void{
                  type.match(this.regTypeOsc) ? this.typeOscH2 = type : console.log("Invalid type for oscH2");
                };
};

// var piano = new Instrument(INSTRUMENTS[0]);

var noteDo =  new Note(KEYTABAZERTY[0], new Instrument(INSTRUMENTS[1]));
var noteRe =  new Note(KEYTABAZERTY[1], new Instrument(INSTRUMENTS[1]));
var noteMi =  new Note(KEYTABAZERTY[2], new Instrument(INSTRUMENTS[1]));
var noteFa =  new Note(KEYTABAZERTY[3], new Instrument(INSTRUMENTS[1]));
var noteSol = new Note(KEYTABAZERTY[4], new Instrument(INSTRUMENTS[1]));
var noteLa =  new Note(KEYTABAZERTY[5], new Instrument(INSTRUMENTS[1]));
var noteSi =  new Note(KEYTABAZERTY[6], new Instrument(INSTRUMENTS[1]));
var noteDo2 = new Note(KEYTABAZERTY[7], new Instrument(INSTRUMENTS[1]));
var noteRe2 = new Note(KEYTABAZERTY[8], new Instrument(INSTRUMENTS[1]));


function init(){
  window.addEventListener("keydown", noteEvent);
  window.addEventListener("keyup", noteStop);
}
init();

function noteEvent(event:any){
      var key = event.key;
      switch(key){
        case noteDo.key:
          if(!noteDo.press){
              noteDo.note.object = noteDo.instrument.play(noteDo.frequency);
              noteDo.press = true;
              noteDo.animation = new RoueDentée(0,10);
              noteDo.animation.animate();
          }
          break;
        case noteRe.key:
          if(!noteRe.press){
            noteRe.note.object = noteRe.instrument.play(noteRe.frequency);
            noteRe.press = true;
            noteRe.animation = new RoueDentée(10,10);
            noteRe.animation.animate();
          }
          break;
          case noteMi.key:
            if(!noteMi.press){
              noteMi.note.object = noteMi.instrument.play(noteMi.frequency);
              noteMi.press = true;
              noteMi.animation = new RoueDentée(20,10);
              noteMi.animation.animate();
            }
            break;
        case noteFa.key:
          if(!noteFa.press){
            noteFa.note.object = noteFa.instrument.play(noteFa.frequency);
            noteFa.press = true;
            noteFa.animation = new RoueDentée(30,10);
            noteFa.animation.animate();
          }
          break;
        case noteSol.key:
          if(!noteSol.press){
            noteSol.note.object = noteSol.instrument.play(noteSol.frequency);
            noteSol.press = true;
            noteSol.animation = new RoueDentée(40,10);
            noteSol.animation.animate();
          }
          break;
        case noteLa.key:
          if(!noteLa.press){
            noteLa.note.object = noteLa.instrument.play(noteLa.frequency);
            noteLa.press = true;
            noteLa.animation = new RoueDentée(50,10);
            noteLa.animation.animate();
          }
          break;
        case noteSi.key:
          if(!noteSi.press){
            noteSi.note.object = noteSi.instrument.play(noteSi.frequency);
            noteSi.press = true;
            noteSi.animation = new RoueDentée(60,10);
            noteSi.animation.animate();
          }
          break;
        case noteDo2.key:
          if(!noteDo2.press){
            noteDo2.note.object = noteDo2.instrument.play(noteDo2.frequency);
            noteDo2.press = true;
            noteDo2.animation = new RoueDentée(70,10);
            noteDo2.animation.animate();
          }
          break;

        case noteRe2.key:
          if(!noteRe2.press){
            noteRe2.note.object = noteRe2.instrument.play(noteRe2.frequency);
            noteRe2.press = true;
            noteRe2.animation = new RoueDentée(80,10);
            noteRe2.animation.animate();
          }
          break;
      }
}

function noteStop(event:any){
    var key = event.key;
    switch(key){
      case noteDo.key:
        noteDo.press = false;
        noteDo.instrument.stop();
        break;
      case noteRe.key:
        noteRe.press = false;
        noteRe.instrument.stop();
        break;
      case noteMi.key:
        noteMi.press = false;
        noteMi.instrument.stop();
        break;
      case noteFa.key:
        noteFa.press = false;
        noteFa.instrument.stop();
        break;
      case noteSol.key:
        noteSol.press = false;
        noteSol.instrument.stop();
        break;
      case noteLa.key:
        noteLa.press = false;
        noteLa.instrument.stop();
        break;
      case noteSi.key:
        noteSi.press = false;
        noteSi.instrument.stop();
        break;
      case noteDo2.key:
        noteDo2.press = false;
        noteDo2.instrument.stop();
        break;
      case noteRe2.key:
        noteRe2.press = false;
        noteRe2.instrument.stop();
        break;
    }
}
