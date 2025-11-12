const express = require('express');
const Request = require('../models/Request');
const Food = require('../models/Food');
const verifyToken = require('../middleware/verifyFirebaseToken');
const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
  try {
    const { foodId, location, reason, contactNo } = req.body;
    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ message: 'Food not found' });

    const reqDoc = new Request({
      foodId,
      requester: { name: req.user.name, email: req.user.email, photoURL: req.body.photoURL || '' },
      location,
      reason,
      contactNo,
      status: 'pending'
    });

    await reqDoc.save();
    res.status(201).json(reqDoc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/food/:foodId', verifyToken, async (req, res) => {
  try {
    const food = await Food.findById(req.params.foodId);
    if (!food) return res.status(404).json({ message: 'Food not found' });
    if (food.donator.email !== req.user.email) return res.status(403).json({ message: 'Forbidden' });

    const requests = await Request.find({ foodId: req.params.foodId });
    res.json(requests);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id/accept', verifyToken, async (req, res) => {
  try {
    const r = await Request.findById(req.params.id);
    if (!r) return res.status(404).json({ message: 'Not found' });
    const food = await Food.findById(r.foodId);
    if (food.donator.email !== req.user.email) return res.status(403).json({ message: 'Forbidden' });

    r.status = 'accepted';
    await r.save();

    food.food_status = 'donated';
    await food.save();

    res.json({ request: r, food });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id/reject', verifyToken, async (req, res) => {
  try {
    const r = await Request.findById(req.params.id);
    if (!r) return res.status(404).json({ message: 'Not found' });
    const food = await Food.findById(r.foodId);
    if (food.donator.email !== req.user.email) return res.status(403).json({ message: 'Forbidden' });

    r.status = 'rejected';
    await r.save();
    res.json(r);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
