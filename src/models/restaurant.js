const mongoose = require('mongoose');

const restaurantUserSchema = new mongoose.Schema({
    restaurantName: String,
    restaurantAdminName: String,
    restaurantLocation: String,
    restaurantEmail: String,
    restaurantPassword: String
});

const restaurantUser = mongoose.model('restaurantUser',restaurantUserSchema);

module.exports = restaurantUser;