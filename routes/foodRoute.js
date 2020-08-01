const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");

const foodImage = "../assets/images/default-food-image.jpg";

const auth = require("../middleware/authMiddle");
// const multer = require("../middleware/multerMiddle");
const { Food, validateFood } = require("../models/foodModel");

////////////////////////////////////////////////////////////////////////
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./public/data/food/images/",
  filename: function (req, file, cb) {
    const fileName = _.padStart(_.toString(_.random(99999999)), 8, "0");
    const parts = file.mimetype.split("/");
    cb(null, "IMAGE-" + fileName + "." + parts[1]);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 },
});

////////////////////////////////////////////////////////////////////////

router.post("/", auth, upload.single("foodImage"), async (req, res) => {
  // const { error } = validateFood(req.body);
  // if (error) return res.status(400).send("Card detailes are not valid");
  console.log(req.body);
  console.log(req.file);
  // let food = new Food({
  //   foodTitle: req.body.foodTitle,
  //   foodDesc: req.body.foodDesc,
  //   foodImage: req.body.foodImage ? req.body.foodImage : foodImage,
  //   foodLocation: req.body.foodLocation,
  // });

  // post = await food.save();
  // res.send(post);
  res.send(200).end();
});

module.exports = router;
