require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const admin = require("firebase-admin");
const path = require("path");

const foodsRoutes = require("./routes/foods");
const requestsRoutes = require("./routes/requests");

const app = express();
app.use(cors());
app.use(express.json());

try {
  const serviceAccountPath =
    process.env.FIREBASE_ADMIN_SDK_PATH || "./serviceAccountKey.json";
  const serviceAccount = require(path.resolve(serviceAccountPath));

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  console.log("✅ Firebase Admin initialized");
} catch (err) {
  console.error("⚠️ Firebase initialization failed:", err.message);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use("/api/foods", foodsRoutes);
app.use("/api/requests", requestsRoutes);

app.get("/", (req, res) => res.send("PlateShare API running successfully 🚀"));


module.exports = app;
