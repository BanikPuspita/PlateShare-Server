const express = require("express");
const Food = require("../models/Food");
const verifyToken = require("../middleware/verifyFirebaseToken");
const router = express.Router();

router.get("/", async (req, res) => { 
  try {
    const foods = await Food.find({ food_status: "Available" });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/featured", async (req, res) => { 
  try {
    const foods = await Food.find({ food_status: "Available" })
      .sort({ quantityNumber: -1 })
      .limit(6);
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Not found" });
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const body = req.body;
    const food = new Food({
      ...body,
      donator: {
        name: req.user.name,
        email: req.user.email,
        photoURL: req.user.photoURL || "", 
      },
      food_status: "Available",
    });
    await food.save();
    res.status(201).json(food);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Not found" });
    if (food.donator.email !== req.user.email)
      return res.status(403).json({ message: "Forbidden" });

    Object.assign(food, req.body);
    await food.save();
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Not found" });
    if (food.donator.email !== req.user.email)
      return res.status(403).json({ message: "Forbidden" });

    await food.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/my/foods", verifyToken, async (req, res) => {
  try {
    const foods = await Food.find({ "donator.email": req.user.email });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;