'use strict';

const User = require('../models/user');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shada');

const users = [
    new User({
       
        email: "administrador@shadasrl.com.ar",
        password: "$2a$05$ZRDAOFRdwPi4c.PonbBIU.tLbYXLune5MuppKr9eVfRq1LuGonKki",
        role:"admin"
    }) 
    
    
    ]

let done = 0;

for (let i = 0; i < users.length; i++) {
    users[i].save((err, result) => {
        done++;
        if (done === users.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}
