var KEYTAB = [{ note: 'C3', freq: 261, key: 'w', keyCode: 87 },
    { note: 'D3', freq: 293, key: 'x', keyCode: 88 },
    { note: 'E3', freq: 329, key: 'c', keyCode: 67 },
    { note: 'F3', freq: 349, key: 'v', keyCode: 86 },
    { note: 'G3', freq: 392, key: 'b', keyCode: 66 },
    { note: 'A3', freq: 440, key: 'n', keyCode: 78 },
    { note: 'B3', freq: 494, key: ',', keyCode: 18 },
    { note: 'C4', freq: 523, key: ';', keyCode: 59 },
    { note: 'D4', freq: 587, key: ':', keyCode: 58 },
    { note: 'C3#', freq: 277, key: 's', keyCode: 83 },
    { note: 'D3#', freq: 311, key: 'd', keyCode: 68 },
    { note: 'F3#', freq: 370, key: 'g', keyCode: 71 },
    { note: 'G3#', freq: 415, key: 'h', keyCode: 72 },
    { note: 'A3#', freq: 466, key: 'j', keyCode: 74 },
    { note: 'C4#', freq: 554, key: 'l', keyCode: 76 },
    { note: 'D4#', freq: 622, key: 'm', keyCode: 77 }];
var INSTRUMENTS = [{ name: "organ", h1: 2, h2: 28 / 27, h3: 3, delay: 1000 },
    { name: "organ2", h1: 2, h2: 55 / 28, h3: 1 / 2, delay: 1000 },
    { name: "test", h1: 2, h2: 4, h3: 2, delay: 1000 }
];
var LOOPTAB = [{ src: "data/loop/looperman-l-1319.wav", name: "djumbee1", key: 'a', keyCode: 65, active: false, audio: undefined },
    { src: "data/loop/2990.wav", name: "djumbee2", key: 'z', keyCode: 66, active: false, audio: undefined },
    { src: "data/loop/6067.wav", name: "batterie1", key: 'r', keyCode: 82, active: false, audio: undefined },
    { src: "data/loop/6070.wav", name: "batterie2", key: 't', keyCode: 84, active: false, audio: undefined },
    { src: "data/loop/6071.wav", name: "batterie3", key: 'y', keyCode: 89, active: false, audio: undefined },
    { src: "data/loop/6073.wav", name: "batterie4", key: 'u', keyCode: 86, active: false, audio: undefined },
    { src: "data/loop/21433.wav", name: "rock1", key: 'o', keyCode: 79, active: false, audio: undefined },
    { src: "data/loop/21437.wav", name: "rock2", key: 'p', keyCode: 80, active: false, audio: undefined }];
var Note = (function () {
    function Note(press, note, animation, instrument) {
        this.press = press;
        this.note = note;
        this.animation = animation;
        this.instrument = instrument;
        this.press = press;
        this.note = note;
        this.animation = animation;
        this.instrument = instrument;
    }
    return Note;
})();
var Instrument = (function () {
    function Instrument(harmo1, harmo2, harmo3, decayTonal, decayH1, decayH2, decayH3, release) {
        this.harmo1 = harmo1;
        this.harmo2 = harmo2;
        this.harmo3 = harmo3;
        this.decayTonal = decayTonal;
        this.decayH1 = decayH1;
        this.decayH2 = decayH2;
        this.decayH3 = decayH3;
        this.release = release;
        this.harmo1 = harmo1;
        this.decayH1 = decayH1;
        this.harmo2 = harmo2;
        this.decayH2 = decayH2;
        this.harmo3 = harmo3;
        this.decayH3 = decayH3;
        this.release = release;
        this.gainTonalInitialValue = 1;
        this.gainH1InitialValue = 0.5;
        this.gainH2InitialValue = 0.2;
        this.gainH3InitialValue = 0.1;
        this.intervals = [];
        this.createContext();
    }
    Instrument.prototype.createContext = function () {
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
    ;
    Instrument.prototype.createOsc = function (freq) {
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
        return [oscTonal, oscH1, oscH2, oscH3];
    };
    ;
    Instrument.prototype.play = function (freq) {
        this.oscillators = this.createOsc(freq);
        this.gainTonal.gain.value = this.gainTonalPreviousValue = this.gainTonalInitialValue;
        this.gainH1.gain.value = this.gainH1IPreviousValue = this.gainH1InitialValue;
        this.gainH2.gain.value = this.gainH2PreviousValue = this.gainH2InitialValue;
        this.gainH3.gain.value = this.gainH3PreviousValue = this.gainH3InitialValue;
        console.log();
        this.intervals.push(setInterval(this.startDecay.bind(this), 100));
        for (var i = 0; i < this.oscillators.length; i++) {
            this.oscillators[i].start(this.context.currentTime);
        }
    };
    ;
    Instrument.prototype.startDecay = function () {
        console.log("decay", this.gainTonal.gain.value);
        this.gainTonal.gain.value = this.gainTonalPreviousValue - this.decayTonal;
        this.gainH1.gain.value = this.gainH1IPreviousValue - this.decayH1;
        this.gainH2.gain.value = this.gainH2PreviousValue - this.decayH2;
        this.gainH3.gain.value = this.gainH3PreviousValue - this.decayH3;
        // gestion des gain negatif
        this.gainTonal.gain.value = this.gainTonal.gain.value <= 0 ? 0 : this.gainTonal.gain.value;
        this.gainH1.gain.value = this.gainH1.gain.value <= 0 ? 0 : this.gainH1.gain.value;
        this.gainH2.gain.value = this.gainH2.gain.value <= 0 ? 0 : this.gainH2.gain.value;
        this.gainH3.gain.value = this.gainH3.gain.value <= 0 ? 0 : this.gainH3.gain.value;
        if (this.gainTonal.gain.value <= 0 &&
            this.gainH1.gain.value <= 0 &&
            this.gainH2.gain.value <= 0 &&
            this.gainH3.gain.value <= 0) {
            this.stop();
        }
        this.gainTonalPreviousValue = this.gainTonal.gain.value.toFixed(2);
        this.gainH1IPreviousValue = this.gainH1.gain.value.toFixed(2);
        this.gainH2PreviousValue = this.gainH2.gain.value.toFixed(2);
        this.gainH3PreviousValue = this.gainH3.gain.value.toFixed(2);
    };
    ;
    Instrument.prototype.stop = function () {
        for (var i = 0; i < this.oscillators.length; i++) {
            this.oscillators[i].stop(this.context.currentTime);
        }
        clearInterval(this.intervals[0]);
    };
    return Instrument;
})();
