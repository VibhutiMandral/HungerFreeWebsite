const mongoose = require('mongoose');

const ngoUserSchema = new mongoose.Schema({
    ngoName: String,
    ngoAdminName: String,
    ngoEmail: String,
    ngoPassword: String
});

const ngoUser = mongoose.model('ngoUser',ngoUserSchema);


module.exports = ngoUser;