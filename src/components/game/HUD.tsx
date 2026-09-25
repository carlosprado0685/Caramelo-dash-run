import { sendCommand } from "../../game/runtime";
import { useGameStore } from "../../game/store";

function Placar({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-ink/45 px-4 py-2 backdrop-blur-sm">
      <span className="font-display text-2xl leading-none text-cream">{value}</span>
      <span className="text-[0.62rem] uppercase tracking-widest text-cream/70">{label}</span>
    </div>
  );
}

export function HUD({
  onJogar,
  onAlternarSom,
}: {
  onJogar: () => void;
  onAlternarSom: () => void;
}) {
  const { phase, score, coins, treats, best, som } = useGameStore();

  return (
    <div className="pointer-events-none fixed inset-0 z-10 font-body">
      {phase === "jogando" && (
        <div className="flex items-start justify-between p-4 pt-[max(1rem,env(safe-area-inset-top))]">
          <div className="rounded-2xl bg-ink/45 px-4 py-2 backdrop-blur-sm">
            <span className="font-display text-4xl leading-none text-cream drop-shadow">
              {score}
            </span>
            <span className="ml-2 text-xs uppercase tracking-widest text-cream/70">pontos</span>
          </div>
          <div className="flex gap-2">
            <Placar label="Moedas" value={coins} />
            <Placar label="Petiscos" value={treats} />
          </div>
        </div>
      )}

      {phase === "inicio" && (
        <div className="pointer-events-auto flex h-full flex-col items-center justify-between bg-gradient-to-b from-ink/55 via-ink/25 to-ink/70 px-6 py-10 [@media(max-height:600px)]:py-3">
          <div className="mt-6 text-center [@media(max-height:600px)]:mt-0">
            <h1 className="font-display text-6xl leading-none text-coin drop-shadow-[0_4px_0_rgba(0,0,0,0.35)] [@media(max-height:600px)]:text-5xl">
              Caramelo
            </h1>
            <h2 className="font-display text-5xl leading-none text-cream drop-shadow-[0_4px_0_rgba(0,0,0,0.35)] [@media(max-height:600px)]:text-4xl">
              Run
            </h2>
            <p className="mt-3 text-sm text-cream/85 [@media(max-height:600px)]:mt-1 [@media(max-height:600px)]:text-xs">
              Corra pelas ruas, desvie do trânsito e junte moedas e petiscos!
            </p>
          </div>

          <div className="w-full max-w-xs rounded-3xl bg-ink/45 p-5 text-cream backdrop-blur-sm [@media(max-height:600px)]:p-3">
            <p className="mb-3 text-center font-display text-xl text-coin [@media(max-height:600px)]:mb-1 [@media(max-height:600px)]:text-lg">Como jogar</p>
            <ul className="space-y-1.5 text-sm [@media(max-height:600px)]:space-y-0 [@media(max-height:600px)]:text-xs">
              <li>Deslize para a esquerda ou direita para trocar de pista</li>
              <li>Deslize para cima para pular cones, caixas e buracos</li>
              <li>Deslize para baixo para rolar por baixo das caixas suspensas</li>
              <li>Bicicletas e motos só com desvio de pista!</li>
            </ul>
          </div>

          <div className="flex w-full max-w-xs flex-col items-center gap-3 [@media(max-height:600px)]:gap-1">
            <p className="text-sm text-cream/80">
              Melhor pontuação: <span className="font-display text-lg text-coin">{best}</span>
            </p>
            <button
              type="button"
              onClick={onAlternarSom}
              aria-label={som ? "Desligar som" : "Ligar som"}
              aria-pressed={som}
              className="flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-ink/45 px-5 py-2 text-sm font-bold text-cream backdrop-blur-sm active:bg-ink/65"
            >
              <span aria-hidden="true">{som ? "🔊" : "🔇"}</span>
              Som {som ? "ligado" : "desligado"}
            </button>
            <button onClick={onJogar} className="btn-caramelo w-full">
              Jogar
            </button>
          </div>
        </div>
      )}

      {phase === "fim" && (
        <div className="pointer-events-auto flex h-full flex-col items-center justify-center gap-6 bg-ink/65 px-6 backdrop-blur-sm">
          <h2 className="font-display text-5xl text-cream drop-shadow-[0_4px_0_rgba(0,0,0,0.35)]">
            Fim de jogo
          </h2>
          <div className="w-full max-w-xs rounded-3xl bg-ink/50 p-6 text-center text-cream">
            <p className="text-xs uppercase tracking-widest text-cream/70">Pontuação</p>
            <p className="font-display text-6xl leading-tight text-coin">{score}</p>
            <div className="mt-3 flex justify-center gap-6 text-sm">
              <span>
                <span className="font-display text-coin">{coins}</span> moedas
              </span>
              <span>
                <span className="font-display text-coin">{treats}</span> petiscos
              </span>
            </div>
            <p className="mt-4 text-sm text-cream/80">
              Recorde: <span className="font-display text-lg text-coin">{best}</span>
              {score >= best && score > 0 ? " — novo recorde!" : ""}
            </p>
          </div>
          <button onClick={onJogar} className="btn-caramelo w-full max-w-xs">
            Jogar novamente
          </button>
        </div>
      )}

      {/* Botões de apoio para quem joga sem deslizar (ex.: navegador) */}
      {phase === "jogando" && (
        <div className="pointer-events-auto absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-0 right-0 flex justify-center gap-2 px-4 opacity-70">
          {(
            [
              ["esquerda", "◀"],
              ["pular", "▲"],
              ["rolar", "▼"],
              ["direita", "▶"],
            ] as const
          ).map(([cmd, icon]) => (
            <button
              key={cmd}
              aria-label={cmd}
              onPointerDown={() => sendCommand(cmd)}
              className="h-12 w-14 rounded-2xl bg-ink/45 font-display text-lg text-cream backdrop-blur-sm active:bg-caramelo"
            >
              {icon}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
