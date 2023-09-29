/*
TP01
Sintaxis: listFiles path

1- recibir y controlar un argumento que represente el path a un directorio
2- leer el directorio y listar los archivos y carpetas que contenga, discriminando
   si se trata de una carpeta o un archivo.
3- si no se recibe el parametro mostrar en la pantalla la sintaxis del 
   programa

tips:
- libreria 'fs'
- ver readdir()
- se puede salir de un programa Node.js utilizando process.exit(-1)
*/


const fs = require("fs")
const arg = process.argv[2]

if(!arg){
    console.log("node listFiles.js [path]");
    process.exit()
}

fs.readdirSync(arg).map((file) => {
    const type = fs.statSync(arg+"/"+file).isDirectory() ? "Dir" : "File"
    console.log(file+" ---> "+type);
})