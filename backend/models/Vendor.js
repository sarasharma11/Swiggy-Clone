const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Create Schema

const VendorSchema = new Schema({
  managerName: {
    type: String,
    // required: true,
  },
  shopName: {
    type: String,
    // required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  contact: {
    type: String,

    // validate: {
        // check if contact is a valid phone number
        // validator: function(V){
        //     return /d{10}/.test(V);;
        // },
        // message: '{VALUE} is not a valid phone number.'
    // },
    // required: true

  },
  
  // password: {
  //   type: String,
  //   required: true,
  // },
  openTime: {
    type: Date,
    required: true
  },
  closeTime: {
    type: Date,
    required: true
  },

});

module.exports = Vendor = mongoose.model("vendors", VendorSchema);