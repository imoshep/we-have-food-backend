const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");

const foodImage = "../assets/images/default-food-image.jpg";

const auth = require("../middleware/authMiddle");
const multerUpload = require("../middleware/multerMiddle");
const { Food, validateFood, validateImage } = require("../models/foodModel");

router.post("/", auth, multerUpload.single("foodImage"), async (req, res) => {
  console.log(req.body);
  console.log(req.user);
  console.log(req.file);
  const { error } = validateFood(req.body);
  const imageValid = req.file ? validateImage(req.file) : true;
  if (error || !imageValid) {
    return res.status(400).send(error.message);
  }

  let food = new Food({
    foodTitle: req.body.foodTitle,
    foodDesc: req.body.foodDesc,
    foodImage: req.file ? req.file.destination + req.file.filename : null,
    foodLocation: req.body.foodLocation,
    // user_id: req.user._id,
  });

  post = await food.save();
  res.send(post).end();
});

router.get("/", auth, async (req, res) => {
  let foodData = await Food.find();
  res.send(foodData);
});

module.exports = router;
