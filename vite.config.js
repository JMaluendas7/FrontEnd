import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        entryFileNames: 'scripts/[name].[hash].js',
        assetFileNames: 'assets/[name].[ext]',
      },
      manualChunks(id) {
        if (id.includes('node_modules')) {
          return 'vendor'; // Carpeta para módulos de terceros
        }
      },
    },
    optimizeDeps: {
      include: ['/*.js', '/*.jsx'],
    },
  },
  // Añade esta sección para copiar las imágenes al directorio de salida
  // También puedes incluir otros tipos de archivos si es necesario
  define: {
    'process.env': process.env,
  },
  // Añade esta sección para copiar las imágenes al directorio de salida
  assetsInclude: ['src/img/**'], // Ruta a las imágenes
});
