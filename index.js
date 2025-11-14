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

let serviceAccount;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    console.log("Firebase Admin: Using env var");
  } else {
    const serviceAccountPath = process.env.FIREBASE_ADMIN_SDK_PATH || "./serviceAccountKey.json";
    serviceAccount = require(path.resolve(serviceAccountPath));
    console.log("Firebase Admin: Using local file");
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  console.log("Firebase Admin initialized");
} catch (err) {
  console.error("Firebase initialization failed:", err.message);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

app.use("/api/foods", foodsRoutes);
app.use("/api/requests", requestsRoutes);

app.get("/", (req, res) => res.send("PlateShare API running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;