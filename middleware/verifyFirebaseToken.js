// backend/middleware/verifyFirebaseToken.js
const admin = require("../firebaseAdmin");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = {
      email: decoded.email,
      name: decoded.name || decoded.displayName,
      photoURL: decoded.picture || decoded.photoURL,
    };
    next();
  } catch (err) {
    console.error("Token error:", err.message);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};