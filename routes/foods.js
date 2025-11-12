const express = require("express");
const Food = require("../models/Food");
const verifyToken = require("../middleware/verifyFirebaseToken");
const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const foods = await Food.find();
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


router.get("/:id", async (req, res) => {
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
        photoURL: body.donator?.photoURL || "",
      },
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


module.exports = router;






// [
//   {
//     "name": "Chicken Curry",
//     "image": "https://i.ibb.co.com/Fk111vy0/Chicken-Curry-Recipe0.webp",
//     "quantityText": "Serves 3 people",
//     "quantityNumber": 3,
//     "pickupLocation": "Banani, Dhaka",
//     "expireDate": "2025-11-14T00:00:00.000Z",
//     "notes": "Keep refrigerated, serve warm.",
//     "donator": {
//       "name": "Ayesha Rahman",
//       "email": "ayesha@example.com",
//       "photoURL": "https://i.ibb.co/7Qm0VqB/user2.png"
//     },
//     "food_status": "Available"
//   },
//   {
//     "name": "Vegetable Sandwich",
//     "image": "https://i.ibb.co.com/N6sjKP6R/vegetable-sandwich-recipe.webp",
//     "quantityText": "Serves 2 people",
//     "quantityNumber": 2,
//     "pickupLocation": "Gulshan, Dhaka",
//     "expireDate": "2025-11-13T00:00:00.000Z",
//     "notes": "Freshly made, eat within 2 hours.",
//     "donator": {
//       "name": "Rashed Khan",
//       "email": "rashed@example.com",
//       "photoURL": "https://i.ibb.co/Qv7Z8jP/user3.png"
//     },
//     "food_status": "Available"
//   },
//   {
//     "name": "Fried Noodles",
//     "image": "https://i.ibb.co.com/zhQW3R91/Soy-Sauce-Pan-Fried-Noodles-Takestwoeggs-sq.jpg",
//     "quantityText": "Serves 5 people",
//     "quantityNumber": 5,
//     "pickupLocation": "Dhanmondi, Dhaka",
//     "expireDate": "2025-11-16T00:00:00.000Z",
//     "notes": "Contains soy sauce. Vegan-friendly.",
//     "donator": {
//       "name": "Tanvir Hossain",
//       "email": "tanvir@example.com",
//       "photoURL": "https://i.ibb.co/vxqK6jL/user4.png"
//     },
//     "food_status": "Available"
//   },
//   {
//     "name": "Pasta Alfredo",
//     "image": "https://i.ibb.co.com/8D7CcZj4/Spaghetti-Alfredo-FEAT-IMAGE.jpg",
//     "quantityText": "Serves 4 people",
//     "quantityNumber": 4,
//     "pickupLocation": "Mirpur, Dhaka",
//     "expireDate": "2025-11-17T00:00:00.000Z",
//     "notes": "Keep warm, contains dairy.",
//     "donator": {
//       "name": "Farhana Sultana",
//       "email": "farhana@example.com",
//       "photoURL": "https://i.ibb.co/7Qm0VqB/user2.png"
//     },
//     "food_status": "Available"
//   },
//   {
//     "name": "Fruit Salad",
//     "image": "https://i.ibb.co.com/Q3WFHxZN/images.jpg",
//     "quantityText": "Serves 3 people",
//     "quantityNumber": 3,
//     "pickupLocation": "Uttara, Dhaka",
//     "expireDate": "2025-11-14T00:00:00.000Z",
//     "notes": "Fresh fruits, keep chilled.",
//     "donator": {
//       "name": "Imran Ali",
//       "email": "imran@example.com",
//       "photoURL": "https://i.ibb.co/Qv7Z8jP/user3.png"
//     },
//     "food_status": "Available"
//   },
//   {
//     "name": "Egg Roll",
//     "image": "https://i.ibb.co.com/6c5CDxBz/californian-egg-roll-main-header-anz.jpg",
//     "quantityText": "Serves 2 people",
//     "quantityNumber": 2,
//     "pickupLocation": "Kalabagan, Dhaka",
//     "expireDate": "2025-11-13T00:00:00.000Z",
//     "notes": "Eat immediately after pickup.",
//     "donator": {
//       "name": "Nadia Karim",
//       "email": "nadia@example.com",
//       "photoURL": "https://i.ibb.co/vxqK6jL/user4.png"
//     },
//     "food_status": "Available"
//   }
// ]
