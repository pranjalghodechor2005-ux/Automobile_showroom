var mysql = require("mysql2");
var util = require("util");

var conn = mysql.createConnection({
    host:"blvsdefohetmgrgixns7-mysql.services.clever-cloud.com",
    user:"ugj4sjeilsuqadyt",
    password:"KnasOAIbsxk7Sf68HSBh",
    database:"blvsdefohetmgrgixns7"   
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
