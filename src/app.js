const express = require('express');
const res = require('express/lib/response');
const path = require('path');

const app = express();

const port = process.env.port||3000;

// Defining Paths
const publicDirectoryPath = path.join(__dirname, '../public');

app.set('view engine','hbs');   
app.use(express.static(publicDirectoryPath));

app.get("/",(req,res)=>{
    res.render('index.hbs');
});

app.get("/choicepage",(req,res)=>{
    res.render('choicepage.hbs');
});

app.get("/ngoregister",(req,res)=>{
    res.render('ngoregister.hbs');
});

app.get("/restaurant_register_page",(req,res)=>{
    res.render('restaurant_register_page');
});

app.get("/login",(req,res)=>{
    res.render('login');
})

app.listen(port,()=>{
    console.log("Server is up and running on port " + port + ".");
});