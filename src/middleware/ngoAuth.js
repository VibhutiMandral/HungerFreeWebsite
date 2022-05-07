const jwt = require('jsonwebtoken');
const NgoUser = require('../models/ngo');
// const RestaurantUser = require('../models/restaurant');

const auth = async (req,res,next) => {
    try {
        const token = req.cookies.jwt;
        const decoded = jwt.verify(token,'thisisasecretcode');
        // const ngoUser = await NgoUser.findOne({ _id:decoded._id, 'tokens.token': token});
        // const restaurantUser = await RestaurantUser.findOne({ _id:decoded._id, 'tokens.token': token});
        const ngoUser = await NgoUser.findOne({ _id:decoded._id});
        
        if(ngoUser){
            req.ngoUser = ngoUser;
            req.ngoToken = token;
        }
        // else if(restaurantUser){
        //     req.restaurantUser = restaurantUser;
        //     req.restaurantToken = token;
        // }
        else{
            throw new Error();
        }
        
        next();
    } catch(e) {
        res.status(401).send({error:'Please Authenticate'});
    }
}

module.exports = auth;