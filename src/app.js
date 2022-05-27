const express = require('express');
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
require('./db/mongoose');
const NgoUser = require('./models/ngo');
const RestaurantUser = require('./models/restaurant');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth');
const ngoAuth = require('./middleware/ngoAuth');
const restaurantAuth = require('./middleware/restaurantAuth');
const res = require('express/lib/response');
const multer = require('multer');
const ngoUser = require('./models/ngo');

const app = express();

const port = process.env.PORT||3000;

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
app.use(cookieParser());


// multer

// const storage = multer.diskStorage({
//     destination: './public/uploads/',
//     filename: function(req, file, cb){
//         cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });

// const upload = multer({
//     storage: storage,
//     limits:{fileSize: 1000000},
//     fileFilter: function(req, file, cb){
//       checkFileType(file, cb);
//     }
// }).single('myImage');




let navbar = {
    normal: true
};

app.get("/",(req,res)=>{

    res.render('index.hbs',navbar);
});

app.get("/choicepage",(req,res)=>{
    res.render('choicepage.hbs',navbar);
});

app.get("/aboutus",(req,res)=>{
    res.render('aboutus.hbs',navbar);
});

app.get("/news",(req,res)=>{ 
    res.render('news.hbs',navbar);

});

app.get("/ngoregister",(req,res)=>{
    res.render('ngoregister.hbs',navbar);

});

app.post("/ngoregister",async(req,res)=>{
    const ngoUser = new NgoUser({
        ngoName:req.body.ngoName,
        ngoAdminName:req.body.adminName,
        ngoEmail:req.body.email,
        ngoPassword:req.body.password
    });

    try{
        const token = await ngoUser.generateAuthToken();
        // ngoUser.tokens = ngoUser.tokens.concat({token});
        await ngoUser.save();
        res.cookie("jwt",token, {
            expires: new Date(Date.now() + 6000000),
            httpOnly: true
        });

        // adding second type of navbar
        res.redirect("/ngoViewPage");
    }
    catch(e){
        res.status(500).send(e);
    }
    // console.log("NGO Name is " + req.body.ngoName +". Admin name is "+req.body.adminName+". Email is "+req.body.email+". Password is "+req.body.password);

});

app.get("/restaurantRegisterPage",(req,res)=>{
    res.render('restaurantRegisterPage.hbs',navbar);
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
        const token = await restaurantUser.generateAuthToken();
        // restaurantUser.tokens = restaurantUser.tokens.concat({token});
        await restaurantUser.save();
        res.cookie("jwt",token, {
            expires: new Date(Date.now() + 6000000),
            httpOnly: true
        });

        res.redirect("/restaurantViewPage");
    }
    catch(e){
        res.status(500).send(e);
    }
    // console.log("Restaurant Name is " + req.body.restaurantName +". Admin name is "+req.body.adminName+". Email is "+req.body.email+". Password is "+req.body.password);
});

app.get("/ngoLogin",(req,res)=>{
    res.render('ngoLogin',navbar);
});

app.post("/ngoLogin", async(req,res)=>{
    try{
        const ngoUser = await NgoUser.findByCredentials(req.body.email,req.body.password);
        const token = await ngoUser.generateAuthToken();
        // ngoUser.tokens = ngoUser.tokens.concat({token});
        // await ngoUser.save();
        res.cookie("jwt",token, {
            expires: new Date(Date.now() + 6000000),
            httpOnly: true
        });

        res.redirect("/ngoViewPage");
    }
    catch(e){
        res.redirect("/choicepage");
    }
});

app.get("/restaurantLogin",(req,res)=>{
    res.render('restaurantLogin',navbar);
})

app.post("/restaurantLogin", async(req,res)=>{
    try{
        const restaurantUser = await RestaurantUser.findByCredentials(req.body.email,req.body.password);
        const token = await restaurantUser.generateAuthToken();
        // restaurantUser.tokens = restaurantUser.tokens.concat({token});
        // await restaurantUser.save();
        res.cookie("jwt",token, {
            expires: new Date(Date.now() + 6000000),
            httpOnly: true
        });

        res.redirect("/restaurantViewPage");
    }
    catch(e){
        res.redirect("/choicepage");
    }
});

app.get("/ngoViewPage",ngoAuth,async(req,res)=>{

    const restaurantArray = await RestaurantUser.find();


    //passing navbar.normal in single object as normal
    navbar.normal = false;
    res.render("ngoViewPage",{
        ngoName: req.ngoUser.ngoName,
        ngoEmail: req.ngoUser.ngoEmail,
        restaurantArray,
        normal: false 
    });
});

app.get("/restaurantViewPage",restaurantAuth,async(req,res)=>{
    navbar.normal = false;
    res.render("restaurantViewPage",{
        restaurant:req.restaurantUser,
        normal:false
    });
})

app.post("/logout",(req,res)=>{
    try{
        res.clearCookie("jwt");

        navbar.normal = true;
        res.redirect("/");
    }
    catch(e){
        res.send("Error in loggin out!");
    }
});


// Read More Route
app.post("/readmore",ngoAuth,async(req,res)=>{
    const restaurant = await RestaurantUser.findById({_id:req.body.restaurantid});
    navbar.normal = false;
    res.render("readmore",{
        ngo:req.ngoUser,
        normal:false,
        food:restaurant.food,
        restaurant  
    });
});


app.get("/addfood",restaurantAuth,(req,res)=>{

    navbar.normal = false;
    res.render("addFood",{
        restaurant:req.restaurantUser,
        normal:false
    });
    
});

app.post("/addfood",restaurantAuth,async(req,res)=>{
    const user = await RestaurantUser.findById({_id:req.restaurantUser._id});
    user.food = user.food.concat({
        foodName: req.body.foodName,
        foodType: req.body.foodType,
        foodQuantity: req.body.foodQuantity,
        foodDescription: req.body.foodDesc
    });
    await user.save();

    res.redirect("/restaurantViewPage");
});

app.post("/deletefood",restaurantAuth,async(req,res)=>{
    const foodId = req.body.foodid;
    const user = await RestaurantUser.findById({
        _id:req.restaurantUser._id
    });

    user.food = user.food.filter(function(obj){
        return obj._id.toString() != foodId;
    });

    await user.save();

    res.redirect("/restaurantViewPage");

});

app.listen(port,()=>{
    console.log("Server is up and running on port " + port + ".");
});