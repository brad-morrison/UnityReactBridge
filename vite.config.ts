import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "public/Build/*.gz",
          dest: "dist/Build",
        },
        {
          src: "public/Build/*.br",
          dest: "dist/Build",
        },
      ],
    }),
  ],
  server: {
    headers: {
      "Content-Encoding": "gzip", // or 'br' for Brotli
    },
  },
});
