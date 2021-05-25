'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    codigo: {type: String, required: true},
    nombre: {type: String, required: true},
    direccion: {type: String, required: true},
});

const Ptoventa = mongoose.model('Ptoventa', schema);
module.exports = Ptoventa;