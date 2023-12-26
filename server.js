import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Importa el módulo `path`
import path from 'path';

// Sirve archivos estáticos desde la carpeta 'dist'
app.use(express.static(path.join(__dirname, 'dist')));

// Maneja todas las demás rutas y envía el archivo HTML principal
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Inicia el servidor en el puerto especificado
app.listen(port, () => {
  console.log(`Servidor Express iniciado en el puerto ${port}`);
});
