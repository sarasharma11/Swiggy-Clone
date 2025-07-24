const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

// Create Schema

const UserSchema = new Schema({

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: {
        values: ['buyer', 'vendor'],
        message: '{VALUE} is not supported'
      },
    required: true
  }
}
);


module.exports = User = mongoose.model("users", UserSchema);