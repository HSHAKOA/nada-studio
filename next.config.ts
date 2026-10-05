import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    // Export estático não tem otimizador de imagem. As larguras abaixo são
    // geradas por scripts/imagens.mjs; o loader só aponta pro arquivo certo.
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.ts",
    deviceSizes: [480, 960, 1600],
    imageSizes: [],
  },
  // View Transitions (capa do índice que vira topo do case) não pedem flag
  // desde o Next 16.3: experimental.viewTransition saiu do schema.
};

export default nextConfig;
