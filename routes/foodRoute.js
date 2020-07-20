const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/userModel");
const auth = require("../middleware/authMiddle");
const router = express.Router();

router.post("/add", auth, async (req, res) => {
  //add new food
});

module.exports = router;
