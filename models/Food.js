const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  quantityText: { type: String, required: true },
  quantityNumber: { type: Number, required: true }, 
  pickupLocation: { type: String, required: true },
  expireDate: { type: Date, required: true },
  notes: { type: String },
  donator: {
    name: String,
    email: String,
    photoURL: String,
  },
  food_status: { type: String, default: "Available" }, 
  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Food', FoodSchema)