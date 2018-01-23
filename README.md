# Aquapp 2 setup

A continuación se decribe los pasos a seguir para configurar phonegap y desplegar la aplicación locamente.

## Instalar Phonegap

Para esto el sistema debe contar con [nodeJS][nodejs-url], [npm][npm-url], [Java JDK][java-jdk-url] (mínimo en su versión 14) preinstalado y funcionando correctamente.

Si no cuenta con Phonegap instalado en su máquina, deberá ejecutar el siguiente comando

    sudo npm i -g phonegap@latest

Esto instalará todas las dependencias necesarias para que phonegap CLI funcione correctamente.

Para garantizar que todo se instaló como se esperaba, se puede rectificar la versión de phonegap instalada con el comando

    phonegap --version


## Creación de proyecto base

Para crear un poryecto utilizando phonegap se debe posicionar en el folder donde se desea crear el proyecto y luego utilizar el siguiente comando:

    phonegap create [nombre_proyecto]

En este caso, nos interesa el comando: 

    phonegap create aquapp2 && cd aquapp2

Usted debe obtener como output algo similar a:

    Creating new cordoba project.

Paso seguido:

    rm -rf www README.md;

## Conación del repositorio

Para clonar el repositorio usted debe copiar y pegar el siguente comando en su consola:

    git clone https://github.com/IngenieriaDeSistemasUTB/aquapp2mobile;

## Correr proyecto localmente

Para esto usted debe utilizar el comando:

    phonegap serve;


[nodejs-url]: https://nodejs.org/es/
[npm-url]: https://www.npmjs.com/
[java-jdk-url]: http://www.oracle.com/technetwork/java/javase/overview/index.html