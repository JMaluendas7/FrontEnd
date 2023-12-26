# Utiliza la imagen base de Node.js
FROM node:21.4.0

# Establece el directorio de trabajo en /code
WORKDIR /code

# Copia el package.json y package-lock.json a /code
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia todo el código fuente al directorio /code
COPY . .

# Ejecuta el comando de construcción (npm run build)
RUN npm run build

# Instala el servidor de archivos estáticos 'serve'
RUN npm install -g serve

# Define el comando para servir los archivos estáticos después de la construcción
CMD ["serve", "-s", "./dist", "-l", "3000"]
