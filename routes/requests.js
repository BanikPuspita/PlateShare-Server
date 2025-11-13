const express = require('express');
const Request = require('../models/Request');
const Food = require('../models/Food');
const verifyToken = require('../middleware/verifyFirebaseToken');
const router = express.Router();


router.post('/', verifyToken, async (req, res) => {
  try {
    const { foodId, location, reason, contactNo, photoURL } = req.body;

    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ message: 'Food not found' });

  
    if (food.donator.email === req.user.email) {
      return res.status(400).json({ message: "You can't request your own food" });
    }

    const newRequest = new Request({
      foodId,
      requester: {
        name: req.user.name,
        email: req.user.email,
        photoURL: photoURL || "",
      },
      location,
      reason,
      contactNo,
      status: 'pending',
    });

    await newRequest.save();
    console.log("New Request Created:", newRequest); 
    res.status(201).json(newRequest);
  } catch (err) {
    console.error("Error occurred while creating request:", err);
    res.status(500).json({ message: err.message });
  }
});


router.get('/my', verifyToken, async (req, res) => {
  try {
    const requests = await Request.find({ "requester.email": req.user.email }).populate('foodId');
    console.log("Requests fetched for user:", requests); 
    res.json(requests);
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;