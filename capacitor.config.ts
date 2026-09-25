import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Configuração de exportação do jogo para Android com Capacitor.
 *
 * Passos (fora do Lovable, em uma máquina com Android Studio):
 *   bun install
 *   bun run android:sync
 *   bun run android:open
 */
const config: CapacitorConfig = {
  appId: "app.lovable.carameloRun",
  appName: "Caramelo Run Adventures",
  webDir: ".output/public",
  android: {
    allowMixedContent: false,
  },
  server: {
    androidScheme: "https",
  },
};

export default config;
