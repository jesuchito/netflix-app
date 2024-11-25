# Usar una imagen base oficial de Node.js
FROM node:alpine

# Crear y establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar el archivo de dependencias al contenedor
COPY package*.json .


# Instalar las dependencias
RUN npm install

# Copiar el resto de los archivos de la aplicación
COPY . .


RUN npm run build


# Exponer el puerto que usa la aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación en modo desarrollo
CMD ["npm","start"]
