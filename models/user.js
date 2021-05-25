'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const schema = new Schema({
    sigma: {type: String, required: false},
    email: {type: String, required: true},
    password: {type: String, required: true},
    name: {type: String, required:false},
    addres: {type: String, required:false},
    city: {type: String, required: false},
    cp: {type: String, required: false},
    tel: {type: String, required: false},
    role: {type: String, default: "customer"}
});

schema.methods.encryptPassword = function(password) {
    // use 5 rounds of salt creation here
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5));
}


schema.methods.isAdmin = function() {
    return (this.role === "admin");
};

schema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', schema);
module.exports = User;