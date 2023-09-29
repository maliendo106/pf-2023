/*
TP2

1- Empaquetar la funcionalidad en un modulo
2- Recibir origen y destino como parametros
3- Controlar sintaxis
4- Controlar origen, que sea archivo y que se pueda leer
5- Si el destino existe y en un archivo da error, salvo que se reciba
   un 3er parametro 'w' (opcional) que indique el overwrite
*/


const origenDestinoPack = require('origenDestinoPack');
const args = process.argv

if(!args[2] || ! args[3]){
    console.log("node origenDestino.js [origen] [destino]");
    process.exit()
}

try{
    origenDestinoPack.copyFile(args[2],args[3],args[4])
}catch(error){
    console.log(error);
}