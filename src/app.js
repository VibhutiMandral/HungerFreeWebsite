const express = require('express');
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
require('./db/mongoose');
const NgoUser = require('./models/ngo');
const RestaurantUser = require('./models/restaurant');

const app = express();

const port = process.env.port||3000;

// Defining Paths
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsDirectoryPath = path.join(__dirname,'../templates/views');
const partialsPath = path.join(__dirname,'../templates/partials');

app.set('view engine','hbs');   
app.set('views',viewsDirectoryPath);
app.use(express.static(publicDirectoryPath));
hbs.registerPartials(partialsPath);
app.use(bodyParser.urlencoded({
    extended: true
}));


app.get("/",(req,res)=>{
    res.render('index.hbs');
});

app.get("/choicepage",(req,res)=>{
    res.render('choicepage.hbs');
});

app.get("/ngoregister",(req,res)=>{
    
    res.render('ngoregister.hbs');

});

app.post("/ngoregister",async(req,res)=>{
    const ngoUser = new NgoUser({
        ngoName:req.body.ngoName,
        ngoAdminName:req.body.adminName,
        ngoEmail:req.body.email,
        ngoPassword:req.body.password
    });

    try{
        await ngoUser.save();
        res.send(ngoUser);
    }
    catch(e){
        res.status(500).send(e);
    }
    // console.log("NGO Name is " + req.body.ngoName +". Admin name is "+req.body.adminName+". Email is "+req.body.email+". Password is "+req.body.password);
});

app.get("/restaurantRegisterPage",(req,res)=>{
    res.render('restaurantRegisterPage.hbs');
});

app.post("/restaurantRegisterPage",async(req,res)=>{
    const restaurantUser = new RestaurantUser({
        restaurantName: req.body.restaurantName,
        restaurantAdminName: req.body.adminName,
        restaurantLocation: req.body.location,
        restaurantEmail: req.body.email,
        restaurantPassword: req.body.password
    });

    try{
        await restaurantUser.save();
        res.send(restaurantUser);
    }
    catch(e){
        res.status(500).send(e);
    }
    // console.log("Restaurant Name is " + req.body.restaurantName +". Admin name is "+req.body.adminName+". Email is "+req.body.email+". Password is "+req.body.password);
});

app.get("/login",(req,res)=>{
    res.render('login');
});

app.post("/login", async(req,res)=>{
    res.send("Hello!");
});

app.listen(port,()=>{
    console.log("Server is up and running on port " + port + ".");
});