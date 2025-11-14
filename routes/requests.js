const express = require("express");
const Request = require("../models/Request");
const Food = require("../models/Food");
const verifyToken = require("../middleware/verifyFirebaseToken");
const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  try {
    const { foodId, location, reason, contactNo, photoURL } = req.body;

    if (!foodId || !location || !contactNo) {
      return res.status(400).json({ message: "Location and Contact No. are required" });
    }

    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ message: "Food not found" });
    if (food.food_status !== "Available") {
      return res.status(400).json({ message: "Food is no longer available" });
    }
    if (food.donator.email === req.user.email) {
      return res.status(400).json({ message: "You can't request your own food" });
    }

    const newRequest = new Request({
      foodId,
      requester: {
        name: req.user.name,
        email: req.user.email,
        photoURL: photoURL || req.user.photoURL || "",
      },
      location,
      reason,
      contactNo,
      status: "pending",
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/food/:foodId", verifyToken, async (req, res) => {
  try {
    const { foodId } = req.params;
    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ message: "Food not found" });
    if (food.donator.email !== req.user.email) {
      return res.status(403).json({ message: "Forbidden: Not the food owner" });
    }

    const requests = await Request.find({ foodId }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/:requestId", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const request = await Request.findById(req.params.requestId).populate("foodId");
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.foodId.donator.email !== req.user.email) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (status === "accepted") {
      const alreadyAccepted = await Request.findOne({
        foodId: request.foodId,
        status: "accepted",
        _id: { $ne: request._id }
      });
      if (alreadyAccepted) {
        return res.status(400).json({ message: "Food already donated to someone else" });
      }
      if (request.foodId.food_status === "donated") {
        return res.status(400).json({ message: "Food already donated" });
      }
    }

    request.status = status;
    await request.save();

    if (status === "accepted") {
      request.foodId.food_status = "donated";
      await request.foodId.save();
    }

    res.json({ message: "Request updated", request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/my", verifyToken, async (req, res) => {
  try {
    const requests = await Request.find({
      "requester.email": req.user.email,
    }).populate("foodId");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;