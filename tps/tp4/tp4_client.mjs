import net from 'net';
import fs from 'fs';

net.bytesWritten=300000;
net.writableLength=30000;

const puerto=process.env.PUERTO_SERVER || 7777;

const cliente=net.connect({port: puerto, address:'localhost'},()=>{
    console.log('Conetado!');
    cliente.write('get /home/marcos/hola.png');
});

const partes=[];

cliente.on('data',(parte)=>{
    partes.push(parte);
});

cliente.on('end',()=>{
    const archivoDestino='/home/marcos/archivo-binario';
    const contenido=Buffer.concat(partes);
    if (contenido.length > 0) {
        fs.writeFile(archivoDestino, contenido, err => {
            if (!err) {
                console.log(`Se almacenó correctamente el archivo ${archivoDestino}`);
            } else {
                console.log(`Error: ${err}`);
            }
        });
    } else {
        console.log('No se recibio el contenido del archivo.');
    }
});