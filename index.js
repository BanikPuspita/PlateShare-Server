// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const foodsRoutes = require("./routes/foods");
const requestsRoutes = require("./routes/requests");

const app = express();
app.use(cors());
app.use(express.json());

// Firebase Admin
try {
  const admin = require("./firebaseAdmin");
  console.log("Firebase Admin initialized");
} catch (err) {
  console.error("Firebase Admin failed:", err.message);
}

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Routes
app.use("/api/foods", foodsRoutes);
app.use("/api/requests", requestsRoutes);

app.get("/", (req, res) => res.send("PlateShare API running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;