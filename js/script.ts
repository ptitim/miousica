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

const INSTRUMENTS:Array<any> = [{name: "phase"  ,h1:0.5 ,h2:1.2*Math.PI ,h3:0.5,  decayTonal:0.05, decayH1:0.06, decayH2:0.1,decayH3:0.08, gainTonal:0.6,gainH1:0.6,gainH2:0.2,gainH3:0.2}

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
  constructor(public press: boolean, public note: any, public animation: any,public instrument:string){
      this.press = press;
      this.note = note;
      this.animation = animation;
      this.instrument = instrument;
  }
}

class Instrument{
    private gainTonal:any;private decayTonal:number;
    private gainH1 : any;private decayH1:number;
    private gainH2 : any;private decayH2:number;
    private gainH3: any;private decayH3:number;


    private harmo1:number;
    private harmo2:number;
    private harmo3:number;

    private gainTonalInitialValue:number;
    private gainH1InitialValue:number;
    private gainH2InitialValue:number;
    private gainH3InitialValue:number;

    private context: any;
    private volume: any;

    private oscTonal: string;
    private oscH1: string;
    private oscH2: string;
    private oscH3: string;

    private gainTonalPreviousValue:number;
    private gainH1IPreviousValue: number;
    private gainH2PreviousValue: number;
    private gainH3PreviousValue: number;

    private regTypeOsc: any;

    private oscillators:Array<OscillatorNode>;

    public intervals: Array<any>;

    constructor( private prop:any)
                {
                    this.regTypeOsc = /sine|triangle|square|sawtooth/;
                    this.decayTonal = prop.decayTonal;
                    this.harmo1 = prop.h1; this.decayH1 = prop.decayH1;
                    this.harmo2 = prop.h2; this.decayH2 = prop.decayH2;
                    this.harmo3 = prop.h3; this.decayH3 = prop.decayH3;

                    this.setOscTonal("sine");
                    this.setOscH1("sine");
                    this.setOscH2("sine");
                    this.setOscH3("sine");

                    this.gainTonalInitialValue = prop.gainTonalInitialValue || 1;
                    this.gainH1InitialValue = prop.gainH1InitialValue || 0.5;
                    this.gainH2InitialValue = prop.gainH2InitialValue || 0.3;
                    this.gainH3InitialValue = prop.gainH3InitialValue || 0.1;
                    this.intervals = [];

                    this.createContext();
                }

                createContext(){
                    this.context = new AudioContext();
                    this.volume = this.context.createGain();
                    this.volume.gain.value = 1;
                    this.volume.connect(this.context.destination);

                    this.gainTonal = this.context.createGain();
                    this.gainH1 = this.context.createGain();
                    this.gainH2 = this.context.createGain();
                    this.gainH3 = this.context.createGain();

                    this.gainTonal.gain.value = this.gainTonalPreviousValue = this.gainTonalInitialValue;
                    this.gainH1.gain.value = this.gainH1IPreviousValue = this.gainH1InitialValue;
                    this.gainH2.gain.value = this.gainH2PreviousValue = this.gainH2InitialValue;
                    this.gainH3.gain.value = this.gainH3PreviousValue = this.gainH3InitialValue;

                    this.gainTonal.connect(this.volume);
                    this.gainH1.connect(this.volume);
                    this.gainH2.connect(this.volume);
                    this.gainH3.connect(this.volume);
                };

                createOsc(freq: number){
                    var oscTonal = this.context.createOscillator();
                    var oscH1 = this.context.createOscillator();
                    var oscH2 = this.context.createOscillator();
                    var oscH3 = this.context.createOscillator();

                    oscTonal.type = oscH1.type = oscH2.type = oscH3.type = 'sine';
                    oscTonal.frequency.value = freq;
                    oscH1.frequency.value = freq * this.harmo1;
                    oscH2.frequency.value = freq * this.harmo2;
                    oscH3.frequency.value = freq * this.harmo3;

                    oscTonal.connect(this.gainTonal);
                    oscH1.connect(this.gainH1);
                    oscH2.connect(this.gainH2);
                    oscH3.connect(this.gainH3);
                    return [oscTonal,oscH1,oscH2,oscH3];
                };

                play(freq:number){
                    this.oscillators = this.createOsc(freq);
                    this.gainTonal.gain.value = this.gainTonalPreviousValue = this.gainTonalInitialValue;
                    this.gainH1.gain.value = this.gainH1IPreviousValue = this.gainH1InitialValue;
                    this.gainH2.gain.value = this.gainH2PreviousValue = this.gainH2InitialValue;
                    this.gainH3.gain.value = this.gainH3PreviousValue = this.gainH3InitialValue;
                    console.log()
                    this.intervals.push(setInterval(this.startDecay.bind(this), 100));

                    for (var i = 0; i < this.oscillators.length; i++){
                        this.oscillators[i].start(this.context.currentTime);
                    }
                    return {inteval: this.intervals, oscillators: this.oscillators};
                };

                startDecay(){
                  console.log("decay",this.gainTonal.gain.value);
                  this.gainTonal.gain.value =  this.gainTonalPreviousValue - this.decayTonal;
                  this.gainH1.gain.value = this.gainH1IPreviousValue - this.decayH1;
                  this.gainH2.gain.value = this.gainH2PreviousValue - this.decayH2;
                  this.gainH3.gain.value = this.gainH3PreviousValue - this.decayH3;

                  // gestion des gain negatif
                  this.gainTonal.gain.value  = this.gainTonal.gain.value <= 0 ? 0 : this.gainTonal.gain.value;
                  this.gainH1.gain.value  =this.gainH1.gain.value  <= 0 ? 0 :this.gainH1.gain.value;
                  this.gainH2.gain.value = this.gainH2.gain.value <= 0 ? 0 : this.gainH2.gain.value
                  this.gainH3.gain.value  =this.gainH3.gain.value  <= 0 ? 0 :this.gainH3.gain.value;

                  if(this.gainTonal.gain.value <= 0 && this.gainH1.gain.value <= 0 && this.gainH2.gain.value <= 0 && this.gainH3.gain.value <= 0){
                    while(this.intervals.length > 0){
                       clearInterval(this.intervals[0]);
                     }
                    }

                  this.gainTonalPreviousValue = this.gainTonal.gain.value.toFixed(2);
                  this.gainH1IPreviousValue = this.gainH1.gain.value.toFixed(2);
                  this.gainH2PreviousValue = this.gainH2.gain.value.toFixed(2);
                  this.gainH3PreviousValue = this.gainH3.gain.value.toFixed(2);
                };

                stop(obj:any){
                  var interlength = obj.oscillators.length;
                  for(var i = 0; i < interlength; i++){
                    obj.oscillators[i].stop(this.context.currentTime);
                  }
                  var len = this.intervals.length;
                  for(var i = 0; i < len; i++){
                    clearInterval(obj.intervals[i]);
                  }
                }

                setOscTonal(type:string): void{
                  type.match(this.regTypeOsc) ? this.oscTonal = type : console.log("Invalid type for oscTonal");
                };
                setOscH1(type:string): void{
                  type.match(this.regTypeOsc) ? this.oscH1 = type : console.log("Invalid type for oscH1");
                };
                setOscH2(type:string): void{
                  type.match(this.regTypeOsc) ? this.oscH2 = type : console.log("Invalid type for oscH2");
                };
                setOscH3(type:string): void{
                  type.match(this.regTypeOsc) ? this.oscH3 = type : console.log("Invalid type for oscH3");
                };
};

var piano = new Instrument(INSTRUMENTS[0]);
var notes:Array<any> = [];
piano.setOscH1('sine');
piano.setOscH2('triangle');


function init(){
  window.addEventListener("keydown", noteEvent);
  window.addEventListener("keyup", noteStop);
}
init();

function noteEvent(event:any){
      var key = event.key;
      // console.log(event);
      switch(key){
        case KEYTABAZERTY[0].key:
          if(!KEYTABAZERTY[0].press){
              console.log(KEYTABAZERTY[0].press);
              KEYTABAZERTY[0].object = piano.play(KEYTABAZERTY[0].freq);
              KEYTABAZERTY[0].press = true;
          }
              break;
      }
}

function noteStop(event:any){
    var key = event.key;
    switch(key){
      case KEYTABAZERTY[0].key:
        console.log("tg");
        KEYTABAZERTY[0].press = false;
        piano.stop(KEYTABAZERTY[0].object);
    }
}


var anims:Array<any>;
