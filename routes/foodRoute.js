const express = require("express");
const router = express.Router();
// const bcrypt = require("bcrypt");
// const _ = require("lodash");
const moment = require("moment");

const auth = require("../middleware/authMiddle");
// const multerUpload = require("../middleware/multerMiddle");
// multerUpload.single("foodImage"),
const { Food, validateFood, validateImage } = require("../models/foodModel");

const defaultImagePath = "./public/website/images/default-food-image.jpg";

router.post("/", auth, async (req, res) => {
  console.log("body: ", req.body);
  // console.log(req.user);
  // console.log(req.file);
  const { error } = validateFood(req.body);
  const imageValid = req.file ? validateImage(req.file) : true;
  if (error || !imageValid) {
    return res.status(400).send(error.details[0].message);
  }

  let food = new Food({
    foodTitle: req.body.foodTitle,
    foodDesc: req.body.foodDesc,
    foodImage: req.file
      ? req.file.destination + req.file.filename
      : defaultImagePath,
    foodCity: req.body.foodCity,
    user_id: req.user._id,
  });
  try {
    post = await food.save();
    res.send(post).end();
  } catch (err) {
    res.status(500).send(error.message);
  }
});

router.put("/:id", auth, async (req, res) => {
  // console.log("body: ", req.body);
  // console.log("user: ", req.user);
  // console.log("file: ", req.file);
  // console.log("id from params: ", req.params.id);
  const { error } = validateFood(req.body);
  const imageValid = req.file ? validateImage(req.file) : true;
  if (error || !imageValid) {
    return res.status(400).send(error.details[0].message);
  }

  req.file
    ? (req.body.foodImage = req.file.destination + req.file.filename)
    : (req.body.foodImage = defaultImagePath),
    console.log(req.body);

  try {
    let food = await Food.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      req.body
    );
    if (!food)
      return res
        .status(404)
        .send(
          "The food listing with the provided ID wasn't found in the database"
        );
  } catch (error) {
    res.status(500).send(error.message);
  }

  try {
    food = await Food.findOne({ _id: req.params.id, user_id: req.user._id });
    res.send(food);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/", auth, async (req, res) => {
  if (req.query.foodCity) {
    try {
      const foodData = await Food.find({
        foodCity: req.query.foodCity,
        createdAt: { $gte: moment().subtract(1, "weeks") },
      });
      res.send(foodData);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }

  if (req.query.user_id) {
    try {
      const foodData = await Food.find({
        user_id: req.query.user_id,
      });
      res.send(foodData);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }

  if (req.query._id) {
    try {
      const foodData = await Food.find({
        _id: req.query._id,
      });
      res.send(foodData);
    } catch (err) {
      console.log(err.message);
      return res.status(404).send(err.message);
    }
  }
});

router.delete("/:id", auth, async (req, res) => {
  // console.log(req.body);
  // console.log(req.user);
  // console.log(req.params.id);
  const food = await Food.findOneAndRemove({
    _id: req.params.id,
    user_id: req.user._id,
  });
  if (!food) return res.status(404).send("לא מצאנו אוכל כזה במאגר");
  res.send(food);
});

module.exports = router;

// foodLocation: req.body.foodLocation,
