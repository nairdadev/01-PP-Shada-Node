const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrementModelID = require('./counterModel');
const orderSchema = Schema({
  id: { type: Number, unique: true, min: 1 },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
 
  sigma: {
    type: String,
    required: false
  },
  cart: {
    totalQty: {
      type: Number,
      default: 0,
      required: false,
    },
    totalCost: {
      type: Number,
      default: 0,
      required: false,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        qty: {
          type: Number,
          default: 0,
        },
        price: {
          type: Number,
          default: 0,
        },
        title: {
          type: String,
        },
        code: {
          type: String,
        },
      },
    ],
  },
  address: {
    type: String,
    required: false,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  Delivered: {
    type: Boolean,
    default: false,
  },
});

orderSchema.pre('save', function (next) {
  if (!this.isNew) {
    next();
    return;
  }

  autoIncrementModelID('activities', this, next);
});
module.exports = mongoose.model("Order", orderSchema);
 