import { createFileRoute } from "@tanstack/react-router";
import { GameCanvas } from "../components/game/GameCanvas";

export const Route = createFileRoute("/")({
  ssr: false, // o Canvas 3D nunca deve renderizar no servidor
  head: () => ({
    meta: [
      { title: "Caramelo Run — corrida infinita com o cachorro caramelo" },
      {
        name: "description",
        content:
          "Jogo de corrida infinita em 3D cartoon: desvie de cones, motos, bicicletas e buracos, colete moedas e petiscos e bata seu recorde.",
      },
      { property: "og:title", content: "Caramelo Run" },
      {
        property: "og:description",
        content:
          "Corrida infinita em 3D com o cachorro caramelo. Deslize para desviar, pular e rolar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GameCanvas,
});
