'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    category: {type: Schema.ObjectId, ref: 'Category'}, 
    imagePath: {type: String, required: false},
    title: {type: String, required: false, index: true},
    code: {type: String, required: false},
    description: {type: String, required: false},
    quantity: {type: String, required: false},
    available: {type: String, required: false},
    price: {type: Number, required: false},
    index: {type: String, required: false}
   
});

const Product = mongoose.model('Product', schema);
module.exports = Product;