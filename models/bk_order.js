'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrementModelID = require('./counterModel');

 
const schema = new Schema({
  id: { type: Number, unique: true, min: 1 },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  cart: {
    type: Object,
    required: true
  },
  address: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: false
  },
  datePedido: {
    type: Date,
    default: Date.now
  },
  dateModificacion: {
    type: Date,
    default: ""
  },
  estadoPedido: {
    type: String,
    default: "Pendiente"
  }
 
});
 

schema.pre('save', function (next) {
  if (!this.isNew) {
    next();
    return;
  }

  autoIncrementModelID('activities', this, next);
});

  
/*
instance.schema.virtual('partner', {
  ref: 'Partner', // The model to use
  localField: 'partnerNumber', // Find people where `localField`
  foreignField: 'partnerNumber', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: true,
  options: { select: { firstName: 1, lastName: 1, partnerNumber: 0, _id: 0 } } // Query options, see http://bit.ly/mongoose-query-options
});*/
module.exports = mongoose.model('Order', schema);
 