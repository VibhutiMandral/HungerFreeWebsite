const express = require('express');
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');

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

app.get("/ngoviewpage",(req,res)=>{
    
    res.render('ngoviewpage.hbs');

});

app.post("/ngoregister",(req,res)=>{

    console.log("NGO Name is " + req.body.ngoName +". Admin name is "+req.body.adminName+". Email is "+req.body.email+". Password is "+req.body.password);

});

app.get("/restaurantRegisterPage",(req,res)=>{
    res.render('restaurantRegisterPage.hbs');
});

app.post("/restaurantRegisterPage",(req,res)=>{

    console.log("Restaurant Name is " + req.body.restaurantName +". Admin name is "+req.body.adminName+". Email is "+req.body.email+". Password is "+req.body.password);

});

app.get("/login",(req,res)=>{
    res.render('login');
});

app.listen(port,()=>{
    console.log("Server is up and running on port " + port + ".");
});