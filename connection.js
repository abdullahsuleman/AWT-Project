const mysql = require("mysql");

const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : "inventory"
});

db.connect((err)=>{
    if(err){
        console.log("Can not connect to database");
    }
    console.log('database connected');
});

module.exports = db;