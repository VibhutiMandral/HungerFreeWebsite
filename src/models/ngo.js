const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ngoUserSchema = new mongoose.Schema({
    ngoName: String,
    ngoAdminName: String,
    ngoEmail: String,
    ngoPassword: String,
    tokens:[{
        token: {
            type:String,
            required: true
        }
    }]
});

ngoUserSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({_id:user.id.toString()},'thisisacode');
    return token
}

ngoUserSchema.statics.findByCredentials = async(email,password) => {
    const user = await ngoUser.findOne({ngoEmail:email});

    if(!user){
        throw new Error('Unable to login!');
    }

    const isMatching = await bcrypt.compare(password,user.ngoPassword);
    
    if(!isMatching){
        throw new Error('Unable to login');
    }
    return user;
}

ngoUserSchema.pre('save', async function(next){
    let user = this;
    
    if(user.isModified('ngoPassword')){
        user.ngoPassword = await bcrypt.hash(user.ngoPassword,8);
    }
    
    next();
});

const ngoUser = mongoose.model('ngoUser',ngoUserSchema);


module.exports = ngoUser;