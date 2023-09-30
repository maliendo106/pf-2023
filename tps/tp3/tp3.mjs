//1) Obtener datos de randomuser.me. 
//   Recibir como parámetro del programa la cantidad de páginas de datos 
//   y la cantidad de objetos por página
//  a. Cuando se obtienen los datos, mediante una máquina de eventos
//     informar que se obtuvo el dato explicitando el número de página,
//     páginas faltantes y porcentaje de completado
//  b. crear un escuchador de eventos que a medida que se reciben las páginas
//     insertarlas en una tabla de mysql, en una columna de tipo JSON 
//     (investigar como acceder a mysql)

import fetch from 'node-fetch';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: '172.24.0.2',
    user: 'root',
    password: 'root',
    database: 'pf',
});

async function fetchUserData(cantidad=1, resultadosPorPagina=1) {
    const respuesta = await fetch(`https://randomuser.me/api/?results=${resultadosPorPagina}&inc=name,email`);
    const datosJson = await respuesta.json();
    return datosJson.results; //array de resultados
}

async function obtenerDatos(paginas, resultadosPorPagina) {
    let datosObtenidos = 0;

    for (let i = 1; i <= paginas; i++) {
        const resultados = await fetchUserData(1, resultadosPorPagina);
        datosObtenidos += resultadosPorPagina;

        await insertarResultados(resultados); //insert en la bd

        // evento para informar sobre los datos obtenidos
        emitirEvento('datosObtenidos', {
            pagina: i,
            datosFaltantes: paginas - i,
            completado: (datosObtenidos / (paginas * resultadosPorPagina)) * 100
        });
    }
}

async function insertarResultados(resultados) {
    try {
        const connection = await pool.getConnection();
        await connection.query('INSERT INTO usuarios (datos) VALUES (?)', [JSON.stringify(resultados)]);
        connection.release();
    } catch (error) {
        console.error('Error al insertar resultados en la base de datos:', error);
    }
}

function emitirEvento(evento, datos) {
    console.log(`Evento '${evento}':`, datos);
}

const paginas = process.argv[2] || 1;
const resultadosPorPagina = process.argv[3] || 1;

console.log(`Solicitando ${resultadosPorPagina} resultados por pagina durante ${paginas} paginas...`);

obtenerDatos(paginas, resultadosPorPagina)
    .then(() => console.log('Todas las paginas fueron procesadas.'));


/*
****************** utiles *************************
npm install node-fetch
npm install mysql2


CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    datos JSON
);
*/