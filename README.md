# Netflix Para ASEE
![image](https://github.com/user-attachments/assets/e19a65fb-e738-4044-b64c-5c295c8756bf)


## Descripción

Este proyecto es una aplicación frontend desarrollada en **React** como parte de una entrega para el curso de **Arquitecturas de Software en Entornos Empresariales**. La finalidad es aprender a implementar y consumir microservicios como se hace en la mayoría de entornos empresariales modernos.

## Características

- Uso de microservicios para la gestión y recuperación de datos, concretamente: Usuarios, Contenidos y Vistas
- Implementación de componentes modulares y reutilizables propios de React.
- Uso de bibliotecas como Axios para el consumo de APIs.
- Estilos incorporados con **Bootstrap**.

## Estructura del Proyecto

- **`public/`**: Archivos estáticos y plantilla HTML principal.
- **`src/`**: Contiene los componentes React, estilos, y servicios.
  - **`components/`**: Componentes reutilizables de la UI.
  - **`services/`**: Módulos para la integración con microservicios.
  - **`App.js`**: Componente principal de la aplicación.
- **`package.json`**: Configuración del proyecto y dependencias.

## Funcionalidad de Inicio de Sesión

![image](https://github.com/user-attachments/assets/273410e4-f0e0-4a14-9872-523c57e713a1)

## Instalación y Uso

1. Clona este repositorio en tu máquina local.
2. Navega a la carpeta raíz del proyecto.
3. Instala los archivos necesarios ejecutando:

   ```bash
   npm install
- **`npm start`**: Inicia el servidor de desarrollo.



## Despliegue en Docker 

Este documento describe los pasos necesarios para desplegar una frontend dentro de un contenedor Docker utilizando `docker-compose`.

---

### Requisitos previos

1. **Docker**: Asegúrate de tener instalado Docker en tu sistema. Puedes descargarlo desde [Docker](https://www.docker.com/).
2. **docker-compose**: Comprueba que tienes instalado `docker-compose`. Si no, sigue las instrucciones de instalación [aquí](https://docs.docker.com/compose/install/).

---

### Pasos para el despliegue

### Paso 1: Crear una red en Docker

Antes de desplegar el frontend  , necesitas crear una red específica para el proyecto. Esto permitirá que los contenedores se comuniquen entre sí.

Ejecuta el siguiente comando en la terminal:

```bash
docker network create flask_network
```

### Paso 2: Construir e iniciar la API

Para construir la imagen de Docker y poner en marcha los contenedores, sigue los pasos a continuación:

Desde el directorio donde se encuentra el archivo `docker-compose.yml`, ejecuta el siguiente comando para construir las imágenes y levantar los contenedores:

```bash
docker-compose up --build
```

### Paso 3. Verificar el despliegue
Una vez que los contenedores estén en funcionamiento, puedes verificar el estado de los servicios con el siguiente comando:

```bash
docker ps
```

## ¡Todo listo! 🚀

Tu frontend  ahora está en funcionamiento dentro de un contenedor Docker, junto con sus otros servicios asociados.


