const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema

const OrderSchema = new Schema({
  placedTime: {
    type: Date,
  },
  quantity: {
    type: Number,
  },
  foodId: {
    type: String,
  },
  vendorID: {
    type: String,
  },
  addOns: {
    type: Array,
  },
  status: {
    type: Number,
    // 0 placed
    // 1 accepted
    // 2 cooking
    // 3 ready to pickup
    // 4 completed
    // 5 rejected
  },
  price: {
    type: Number,
  },
  buyerID: {
    type: String,
  },
});

module.exports = Order = mongoose.model("order", OrderSchema);
