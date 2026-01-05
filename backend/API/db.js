// db.js
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

pool.getConnection((err, conn) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  }else {
  console.log('Conectado ao banco de dados MySQL!');
  conn.release();
  }
});

module.exports = pool;
