'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    imagePath: {type: String, required: false},
    name: {type: String, required: true},
    description: {type: String, required: true},
});

const Category = mongoose.model('Category', schema);
module.exports = Category;