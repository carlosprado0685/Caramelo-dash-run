# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## Caramelo Run

Jogo de corrida infinita em 3D (React Three Fiber) com interface em português.

- `src/game/` — regras, constantes de jogabilidade, estado, pontuação/recorde e controles por deslizar
- `src/components/game/` — cena 3D (cachorro, rua, obstáculos, itens) e interface (telas inicial, HUD e fim de jogo)
- `capacitor.config.ts` — configuração pronta para gerar o app Android com Capacitor

### Exportar para Android

```bash
bun add @capacitor/core @capacitor/cli @capacitor/android
bun run build
bunx cap add android
bunx cap sync
bunx cap open android
```
