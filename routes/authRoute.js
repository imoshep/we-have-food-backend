const joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const { User } = require("../models/userModel");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  // Validate Message Body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Validate Users Exists
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  // Validate User's Password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  // If User Was Ok:
  let theToken = user.generateAuthToken();
  res.json({ token: theToken });
  // console.log('user:', user);
  // console.log('token:', theToken);
});

function validate(req) {
  const schema = joi.object({
    email: joi.string().min(6).max(255).required().email(),
    password: joi.string().min(6).max(1024).required(),
  });

  return schema.validate(req, { abortEarly: false });
}

module.exports = router;
