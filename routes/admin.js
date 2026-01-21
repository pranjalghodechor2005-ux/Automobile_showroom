var express = require("express");
var route = express.Router();

route.use(express.urlencoded({ extended:true }));
route.use(express.json());
const exe = require("../connection");
// Home
route.get("/",function(req,res){
    res.render("admin/index");
});



route.get("/dashboard", async (req, res) => {
    // Stats
    const cars = await exe("SELECT COUNT(*) AS total FROM cars");
    const orders = await exe("SELECT COUNT(*) AS total FROM service_orders");
    const customers = await exe("SELECT COUNT(*) AS total FROM customers");
    const messages = await exe("SELECT COUNT(*) AS total FROM contact_requests");

    // Recent 5 orders
    const recentOrders = await exe("SELECT * FROM service_orders ORDER BY created_at DESC LIMIT 5");

    // Render dashboard
    res.render("admin/dashboard", {
        cars: cars[0].total,
        orders: orders[0].total,
        customers: customers[0].total,
        messages: messages[0].total,
        recentOrders
    });
});



route.get("/cars", async function (req, res) {
    var sql = "SELECT * FROM cars";
    var cars = await exe(sql);

    res.render("admin/cars.ejs", { cars });
});

route.post("/save_car", async function(req,res){

    // FORM DATA
    var car_name  = req.body.car_name;
    var car_model = req.body.car_model;
    var car_price = req.body.car_price;

    if(req.files){
        var filename = Date.now()+"_"+req.files.car_image.name;
        req.files.car_image.mv("public/images/"+filename);
    } else {
        filename = ""; 
    }

    var sql = `INSERT INTO cars (car_name, car_model, car_price, car_image)
               VALUES (?, ?, ?, ?)`;

    await exe(sql, [car_name, car_model, car_price, filename]);

    res.redirect("/admin/cars");
});






// SHOW CUSTOMERS
route.get("/customers", async function (req, res) {

    var sql = "SELECT * FROM customers";
    var customers = await exe(sql);

    res.render("admin/customers.ejs", { customers });
});


// SAVE CUSTOMER
route.post("/save_customer", async function (req, res) {

    var name = req.body.name;
    var mobile = req.body.mobile;
    var email = req.body.email;
    var address = req.body.address;
    var enquiry_type = req.body.enquiry_type;
    var car_interest = req.body.car_interest;

    var sql = `
        INSERT INTO customers 
        (name, mobile, email, address, enquiry_type, car_interest)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    await exe(sql, [
        name,
        mobile,
        email,
        address,
        enquiry_type,
        car_interest
    ]);

    res.redirect("/admin/customers");
});


route.get("/blog", async function(req,res){

    var sql = "SELECT * FROM blog";
    var blogs = await exe(sql);

    res.render("admin/blog", { blogs });
});

// SAVE BLOG
route.post("/save_blog", async function(req,res){

    var {
        blog_title,
        blog_slug,
        blog_short_desc,
        blog_content,
        blog_author,
        blog_category,
        blog_tags
    } = req.body;

    var image_name = "";

    if(req.files && req.files.blog_image){
        var img = req.files.blog_image;
        image_name = Date.now()+"_"+img.name;
        img.mv("public/images/"+image_name);
    }

    var sql = `
        INSERT INTO blog
        (blog_title, blog_slug, blog_short_desc, blog_content, blog_image, blog_author, blog_category, blog_tags)
        VALUES (?,?,?,?,?,?,?,?)
    `;

    await exe(sql,[
        blog_title,
        blog_slug,
        blog_short_desc,
        blog_content,
        image_name,
        blog_author,
        blog_category,
        blog_tags
    ]);

    res.redirect("/admin/blog");
});

route.get("/delete_blog/:id", (req, res) => {

    const id = req.params.id;

    exe(
        "DELETE FROM blog WHERE blog_id=?",
        [id]
    ).then(() => {
        res.redirect("/admin/blog");
    });

});





// SHOW PAGE
route.get("/service_orders", async function(req,res){

var sql="SELECT * FROM service_orders ORDER BY id DESC";
var orders = await exe(sql);

res.render("admin/service_orders.ejs",{orders});
});


route.post("/add_service_order", async function(req,res){

    var filename = ""; 

    if(req.files && req.files.order_image){
        filename = Date.now() + "_" + req.files.order_image.name;
        req.files.order_image.mv("public/images/" + filename);
    }

    var { name, mobile, service } = req.body;  
    var sql = `INSERT INTO service_orders 
               (name, mobile, service, order_image) 
               VALUES (?, ?, ?, ?)`;

    await exe(sql, [name, mobile, service, filename]);

    res.redirect("/admin/service_orders");
});


// ADD ORDER
// route.post("/add_service_order",
// async function(req,res){

// var name=req.body.name;
// var mobile=req.body.mobile;
// var service=req.body.service;

// var sql=`INSERT INTO service_orders(name,mobile,service order_image)
//       VALUES(?,?,?)`;

// await exe(sql,[name,mobile,service,order_image]);

// res.redirect("/admin/service_orders");
// });


// DELETE
route.post("/delete_service_order/:id",
async function(req,res){

var id=req.params.id;

var sql="DELETE FROM service_orders WHERE id=?";

await exe(sql,[id]);

res.redirect("/admin/service_orders");
});

route.get("/contact", async function(req, res) {

    var sql = "SELECT * FROM contact_requests ORDER BY id DESC";
    var requests = await exe(sql);

    res.render("admin/contact_requests.ejs", { requests });
});






// Testimonials
route.get("/testimonials",(req,res)=>{
    res.render("admin/testimonials");
})

// Payment
route.get("/payment",(req,res)=>{
    res.render("admin/payment");
})

// Logout


    route.get("/login", (req,res)=>{
        res.render("admin/login.ejs");
    })

    route.post("/login_process", async function(req, res) {
    var data = req.body;

    if(!data.username || !data.password) {
        return res.render("admin/login.ejs", { 
            error: "Please enter username and password" 
        });
    }

    var sql = `SELECT * FROM admin WHERE username = ? AND password = ?`;
    var result = await exe(sql,[data.username, data.password]);

    if(result.length > 0){
        req.session.admin_id = result[0].admin_id;
        req.session.success = "Login Successful! 🎉";
        res.redirect("/admin/home");
    } else {
        res.render("admin/login.ejs", { 
            error: "Invalid Username or Password" 
        });
    }
});





module.exports = route;





