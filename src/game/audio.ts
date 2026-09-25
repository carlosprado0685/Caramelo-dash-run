/**
 * Áudio do jogo gerado por código (Web Audio), sem arquivos externos.
 * Efeitos curtos + música de fundo leve em loop, inspirada em rua de bairro.
 */

const SOUND_KEY = "caramelo-run-som";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let musicGain: GainNode | null = null;
let musicTimer: number | null = null;
let musicStep = 0;
let ligado = true;

export function carregarPreferenciaSom() {
  if (typeof window === "undefined") return true;
  const raw = window.localStorage.getItem(SOUND_KEY);
  ligado = raw === null ? true : raw === "1";
  return ligado;
}

export function somLigado() {
  return ligado;
}

function garantirContexto() {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = ligado ? 0.9 : 0;
    master.connect(ctx.destination);
    musicGain = ctx.createGain();
    musicGain.gain.value = 0.22;
    musicGain.connect(master);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function definirSom(on: boolean) {
  ligado = on;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(SOUND_KEY, on ? "1" : "0");
  }
  if (on) {
    garantirContexto();
    if (master && ctx) master.gain.setTargetAtTime(0.9, ctx.currentTime, 0.05);
  } else if (master && ctx) {
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
  }
}

type ToneOpts = {
  freq: number;
  dur: number;
  type?: OscillatorType;
  gain?: number;
  atraso?: number;
  freqFim?: number;
};

function tone({ freq, dur, type = "sine", gain = 0.3, atraso = 0, freqFim }: ToneOpts) {
  const c = garantirContexto();
  if (!c || !master || !ligado) return;
  const t0 = c.currentTime + atraso;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (freqFim) osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqFim), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + Math.min(0.02, dur * 0.3));
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function noise(dur: number, gain: number, freq: number, atraso = 0) {
  const c = garantirContexto();
  if (!c || !master || !ligado) return;
  const t0 = c.currentTime + atraso;
  const frames = Math.floor(c.sampleRate * dur);
  const buffer = c.createBuffer(1, frames, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
  }
  const src = c.createBufferSource();
  src.buffer = buffer;
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = freq;
  const g = c.createGain();
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(filter).connect(g).connect(master);
  src.start(t0);
}

/** Latido curto e simpático. */
export function tocarLatido() {
  tone({ freq: 620, freqFim: 300, dur: 0.11, type: "sawtooth", gain: 0.22 });
  tone({ freq: 430, freqFim: 210, dur: 0.13, type: "square", gain: 0.1, atraso: 0.02 });
  tone({ freq: 700, freqFim: 340, dur: 0.1, type: "sawtooth", gain: 0.16, atraso: 0.16 });
}

/** Moedinha brilhante (duas notas subindo). */
export function tocarMoeda() {
  tone({ freq: 1180, dur: 0.07, type: "square", gain: 0.12 });
  tone({ freq: 1760, dur: 0.14, type: "square", gain: 0.11, atraso: 0.06 });
}

/** Petisco: arpejo alegre. */
export function tocarPetisco() {
  [880, 1108, 1320, 1760].forEach((f, i) =>
    tone({ freq: f, dur: 0.16, type: "triangle", gain: 0.13, atraso: i * 0.06 }),
  );
}

/** Impacto surdo com batida. */
export function tocarImpacto() {
  noise(0.35, 0.5, 700);
  tone({ freq: 180, freqFim: 45, dur: 0.4, type: "sawtooth", gain: 0.3 });
  tone({ freq: 90, freqFim: 35, dur: 0.5, type: "sine", gain: 0.25, atraso: 0.03 });
}

/* ---------- Música de fundo: levada leve de rua, em loop ---------- */

const BAIXO = [98, 98, 131, 110, 98, 98, 87, 110];
const MELODIA = [
  392, 0, 440, 494, 0, 440, 392, 0, 330, 0, 392, 440, 0, 392, 330, 0,
];

function passoMusica() {
  const c = ctx;
  if (!c || !musicGain || !ligado) return;
  const t0 = c.currentTime;
  const step = musicStep % 16;

  const toca = (freq: number, dur: number, type: OscillatorType, gain: number) => {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(musicGain!);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  };

  // baixo (a cada 2 passos)
  if (step % 2 === 0) {
    const nota = BAIXO[(step / 2) % BAIXO.length]!;
    toca(nota, 0.4, "triangle", 0.3);
  }

  // melodia leve
  const mel = MELODIA[step]!;
  if (mel > 0) toca(mel, 0.26, "sine", 0.16);

  // percussão tipo pandeiro/tamborim (levada sincopada)
  if ([0, 3, 6, 8, 11, 14].includes(step)) {
    const frames = Math.floor(c.sampleRate * 0.06);
    const buffer = c.createBuffer(1, frames, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
    const src = c.createBufferSource();
    src.buffer = buffer;
    const hp = c.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 3800;
    const g = c.createGain();
    g.gain.setValueAtTime(step % 4 === 0 ? 0.1 : 0.06, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.06);
    src.connect(hp).connect(g).connect(musicGain);
    src.start(t0);
  }

  musicStep++;
}

export function iniciarMusica() {
  const c = garantirContexto();
  if (!c || musicTimer !== null) return;
  if (musicGain) musicGain.gain.setTargetAtTime(0.22, c.currentTime, 0.4);
  musicTimer = window.setInterval(passoMusica, 150);
}

export function pararMusica() {
  if (musicTimer !== null) {
    window.clearInterval(musicTimer);
    musicTimer = null;
  }
}
