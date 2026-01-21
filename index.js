var express = require("express");
var bodyparser = require("body-parser");
var upload = require("express-fileupload");
var session = require("express-session");

var user_route = require("./routes/user");
var admin_route = require("./routes/admin");
var admin_login = require("./routes/admin_login");

var app = express();

app.use(bodyparser.urlencoded({ extended: true }));
app.use(upload());
app.use(express.static("public"));

// Session setup
app.use(session({
    secret: "a2zsecret123",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000*60*60 } // 1 hour
}));

// VIEW ENGINE
app.set("view engine","ejs");
app.set("views","views");

app.use(express.urlencoded({ extended:true }));


// USER SIDE
app.use("/", user_route); 

// ADMIN SIDE
app.use("/admin", admin_route);  

// ADMIN LOGIN
app.use("/admin_login", admin_login);  
 
var user = require("./routes/user");
app.use("/", user);


app.listen(1000);
