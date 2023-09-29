/*
TP4

Recibir el puerto como parametro
Soportar dos comandos:
    list [path]: lista los archivos y carpetas del [path] en el server
    y los envia al cliente
    get [path]: obtiene el archivo desde el [path] remoto

se debe programar el cliente y se debe poder descargar un archivo binario
*/
import net from 'net';
import fs from 'fs';

net.bytesWritten=300000;
net.writableLength=30000;

const puerto=process.env.PUERTO || 7777;

const cliName=(socket)=>{
    return `${socket.remoteAddress}:${socket.remotePort}`;
};

const serverTCP=net.createServer( socketCliente => {
   
    console.log(`Se conectó el cliente ${cliName(socketCliente)}`);

    socketCliente.on('end',()=>{
        console.log(`${cliName(socketCliente)}: desconectado`);
    });

    socketCliente.on('data', datos=>{
        console.log(`${cliName(socketCliente)}: "${datos}"`);
        const mensaje = datos.toString().trim();
        const palabras = mensaje.split(' ');
        const path = palabras[1]

        if(datos.toString().startsWith('list')) {

            fs.readdirSync(path).map((file) => {
                const type = fs.statSync(path+"/"+file).isDirectory() ? "Dir" : "File"
                console.log(file+" ---> "+type);
                socketCliente.write(file+" ---> "+type+"\n")
            })
        } 
        if(datos.toString().startsWith('get')) {
            console.log(`Enviando ${path}`);
            fs.readFile(path, (err,data)=>{
                if(!err) {
                    socketCliente.write(data);
                    socketCliente.end();
                } else {
                    console.log(`Error: ${err}`)
                }
            })
        }
        else {
            socketCliente.write('Commandos soportados:\nlist [path]\nget[path]\n');
        }
    });
});


serverTCP.listen(puerto);
console.log(`Escuchando en puerto ${puerto}`);