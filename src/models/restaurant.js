const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const restaurantUserSchema = new mongoose.Schema({
    restaurantName: String,
    restaurantAdminName: String,
    restaurantLocation: String,
    restaurantEmail: String,
    restaurantPassword: String
    // ,tokens:[{
    //     token:{
    //         type: String,
    //         required: true
    //     }
    // }]
});

restaurantUserSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({_id: user.id.toString()}, 'thisisasecretcode');
    return token;
}

restaurantUserSchema.statics.findByCredentials = async(email,password)=>{
    const user = await restaurantUser.findOne({restaurantEmail:email});

    if(!user){
        throw new Error();
    }

    const isMatching = await bcrypt.compare(password,user.restaurantPassword);
    
    if(!isMatching){
        throw new Error();
    }

    return user;
}

restaurantUserSchema.pre('save',async function(next){
    let user = this;

    if(user.isModified('restaurantPassword')){
        user.restaurantPassword = await bcrypt.hash(user.restaurantPassword,8);
    }

    next();
});

const restaurantUser = mongoose.model('restaurantUser',restaurantUserSchema);

module.exports = restaurantUser;