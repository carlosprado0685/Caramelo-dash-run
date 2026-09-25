/**
 * Constantes de "feel" do jogo. Ajuste estes valores para mudar a jogabilidade.
 * Todas as unidades são em metros / segundos.
 */
export const LANE_X = [-2.2, 0, 2.2] as const;

export const SPEED_START = 7.5; // começa devagar
export const SPEED_MAX = 27;
export const SPEED_GAIN = 1.15; // aceleração inicial, desacelera conforme se aproxima do máximo

export const LANE_LERP = 16; // velocidade da troca de pista
export const GRAVITY = 26;
export const JUMP_VELOCITY = 9.2;
export const ROLL_DURATION = 0.55;

export const SPAWN_Z = -70;
export const DESPAWN_Z = 8;
export const HIT_Z = 1.1;

export const COIN_POINTS = 10;
export const TREAT_POINTS = 35;
export const BEST_SCORE_KEY = "caramelo-run-melhor-pontuacao";

export type ObstacleKind =
  | "cone"
  | "bicicleta"
  | "buraco"
  | "moto"
  | "caixa"
  | "caixa-alta"
  | "lixeira"
  | "placa"
  | "carrinho"
  | "banco"
  | "pneus";
export type CollectibleKind = "moeda" | "petisco";

/** Como o jogador escapa de cada obstáculo. */
export const CLEAR_BY: Record<ObstacleKind, "pular" | "rolar" | "desviar"> = {
  cone: "pular",
  buraco: "pular",
  caixa: "pular",
  lixeira: "pular",
  pneus: "pular",
  "caixa-alta": "rolar",
  placa: "rolar",
  bicicleta: "desviar",
  moto: "desviar",
  carrinho: "desviar",
  banco: "desviar",
};

export const OBSTACLE_LABEL: Record<ObstacleKind, string> = {
  cone: "Cone",
  bicicleta: "Bicicleta",
  buraco: "Buraco",
  moto: "Moto",
  caixa: "Caixa",
  "caixa-alta": "Caixa suspensa",
  lixeira: "Lixeira",
  placa: "Placa baixa",
  carrinho: "Carrinho de feira",
  banco: "Banco de praça",
  pneus: "Pilha de pneus",
};
