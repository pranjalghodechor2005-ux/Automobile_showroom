var express = require("express");
var route = express.Router();
const exe = require("../connection"); // Make sure this is your DB connection
// home
// route.get("/", function(req, res) {
//     res.render("user/index.ejs");
// });

route.get("/", async function(req, res) {
    try {
        // Replace with your actual tables
        var vehiclesRepairedResult = await exe("SELECT COUNT(*) AS total FROM service_orders");
        var workshopNetworkResult = await exe("SELECT COUNT(*) AS total FROM workshops");
        var happyCustomersResult = await exe("SELECT COUNT(*) AS total FROM customers");
        var expertTechniciansResult = await exe("SELECT COUNT(*) AS total FROM technicians");

        res.render("user/index", {
            vehiclesRepaired: vehiclesRepairedResult[0].total,
            workshopNetwork: workshopNetworkResult[0].total,
            happyCustomers: happyCustomersResult[0].total,
            expertTechnicians: expertTechniciansResult[0].total
        });
    } catch(err) {
        console.error(err);
        res.render("user/index", {
            vehiclesRepaired: 0,
            workshopNetwork: 0,
            happyCustomers: 0,
            expertTechnicians: 0
        });
    }
});

// about
route.get("/about", function(req, res) {
    res.render("user/about.ejs");
});

route.get("/services", async function(req,res){
    var cars = await exe("SELECT * FROM cars"); 
    res.render("user/services.ejs", { cars });
});



route.post("/place_order", async function(req,res){
    try {
        var { name, mobile, car_name } = req.body;

        var sql = `INSERT INTO service_orders (name, mobile, service) VALUES (?, ?, ?)`;
        await exe(sql, [name, mobile, car_name]);

        res.send(`<script>alert('Order placed successfully!'); window.location='/services';</script>`);
    } catch(err) {
        console.error(err);
        res.send("Error placing order!");
    }
});


route.get("/news", async function(req,res){

    var sql = "SELECT * FROM blog ORDER BY blog_id DESC";
    var blogs = await exe(sql);

    res.render("user/news.ejs", { blogs });
});


module.exports = route;

// user.js (or wherever your user routes are)
route.get("/contact", function(req, res) {
    var success = req.query.success;
    res.render("user/contact", { success });
});

route.post("/contact/submit", async function(req, res) {
    var { name, email, mobile, message } = req.body;

    var sql = `
        INSERT INTO contact_requests (name, email, mobile, message)
        VALUES (?, ?, ?, ?)
    `;
    await exe(sql, [name, email, mobile, message]);

    // Redirect back with success message
    res.redirect("/contact?success=Message sent successfully!");
});



module.exports = route;
