const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
  requester: {
    name: String,
    email: String,
    photoURL: String,
  },
  location: String,
  reason: String,
  contactNo: String,
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Request', RequestSchema)