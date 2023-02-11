const db = require("mysql");


// export the database connection
module.exports = db.createConnection({
    host : process.env.DB_HOST,
    database : process.env.DB_NAME,
    user : process.env.DB_USER,
    password : process.env.DB_PSW 
});