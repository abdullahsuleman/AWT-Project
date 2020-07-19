const mysql = require("mysql");
const config = require("config");

const db = mysql.createConnection(config.get('db_connection_string.string'));

db.connect((err)=>{
    if(err) return console.error('error: ' + err.message);
    console.log('Connected to the MySQL server.');
});

module.exports = db;