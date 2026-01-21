var mysql = require("mysql2");
var util = require("util");

var conn = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"automobile_showroom"   
});

conn.connect((err)=>{
    if(err){
        console.log(err);
    } else{
        console.log("DB Connected");
    }
});

const exe = util.promisify(conn.query).bind(conn);

module.exports = exe;
