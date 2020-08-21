const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const router = express.Router();

const { User, validate } = require("../models/userModel");
const auth = require("../middleware/authMiddle");

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.query.id)
      .select("-password")
      .select("-createdAt");
    res.send(user);
  } catch (err) {
    res.status(404).send(err);
  }
});

//New user sign up
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("This email is already registered");

  console.log(req.body);
  user = new User(req.body);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  res.send(_.pick(user, ["_id", "name", "email"]));
});

// view user's favorites
// router.post("/my-favorites", async (req, res) => {
// }

module.exports = router;
