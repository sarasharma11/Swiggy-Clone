const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema

const FoodSchema = new Schema({
  name: {
    type: String,
  },
  price: {
    type: Number,
  },
  rating: {
    type: Number,
    default: 0,
  },
  veg: {
    type: String,
  },
  addOns: {
    type: Array,
  },
  tags: {
    type: Array,
  },
  vendorID: {
    type: String,
  },
  numberOfOrders: {
    type: Number,
    default: 0,
  },
  // image: {
  //     type: String
  // },
});

module.exports = Food = mongoose.model("food", FoodSchema);
