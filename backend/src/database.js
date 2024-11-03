// Vamos a importar la libreria de mysql-promise
// para poder conectarnos con mysql usando promesas. 

const mysql = require('promise-mysql');
const dotenv = require('dotenv');
dotenv.config();

const connection = mysql.createConnection({
    host:process.env.host,
    database:process.env.database,
    user:process.env.user,
    password:process.env.password
});

// Una vez que tenemos esta coneccion,
// la idea es que vamos a tener que crear
// esta coneccion cada vez que nos comuniuquemos
// con el backend entonces
// 

const getConnection = async() => await connection;

// asi se puede usar en otros archivos
module.exports = {
    getConnection
}