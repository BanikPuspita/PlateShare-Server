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

const serviceAccountPath =
  process.env.FIREBASE_ADMIN_SDK_PATH || "./serviceAccountKey.json";
const serviceAccount = require(path.resolve(serviceAccountPath));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => { console.error('MongoDB connect error', err); process.exit(1); });

app.use('/api/foods', foodsRoutes);
app.use('/api/requests', requestsRoutes);


app.get('/', (req, res) => res.send('PlateShare API running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`))





