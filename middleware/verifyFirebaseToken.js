const admin = require('firebase-admin');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  console.log("Authorization Header:", authHeader); 

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token' });
  }
  
  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name || decoded.email.split('@')[0],
    };
    console.log("Decoded User:", req.user); 
    next();
  } catch (err) {
    console.error('Token verify error', err);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};