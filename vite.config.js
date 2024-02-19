import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    {
      // Configura el complemento para la recarga en caliente de CSS
      name: "vite-plugin-style-import",
      config: {
        libs: [
          {
            libraryName: "antd", // Puedes especificar tus propias bibliotecas si es necesario
            esModule: true,
            resolveStyle: (name) => `antd/es/${name}/style/index`,
          },
        ],
      },
    },
  ],
  build: {
    outDir: "dist",
    assetsDir: "assets",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        entryFileNames: "scripts/[name].[hash].js",
        assetFileNames: "assets/[name].[ext]",
      },
      manualChunks(id) {
        if (id.includes("node_modules")) {
          return "vendor"; // Carpeta para módulos de terceros
        }
      },
    },
    optimizeDeps: {
      include: ["/*.js", "/*.jsx", "src/img/*"],
    },
  },
  assetsInclude: ["./src/img/**"], // Ruta a las imágenes
});
