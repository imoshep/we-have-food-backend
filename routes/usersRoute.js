const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const router = express.Router();

const { User, validate } = require("../models/userModel");
const auth = require("../middleware/authMiddle");
const {validateFoodId} = require('../models/foodModel')

// get user's info by id
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

  // console.log(req.body);
  user = new User(req.body);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  res.send(_.pick(user, ["_id", "name", "email"]));
});

// get favorites by user id
router.get('/favorites', auth, async (req, res) => {
  let user = await User.findOne({_id: req.query.id})
  if (user) {console.log(user);
    res.send(user.favorites)
  } else {
    res.status(404).send("User not found")
  }
})

// Update user's favorites
router.patch("/favorites", auth, async (req, res) => {
    if (typeof req.body === 'object') {
      let validIdsArray = []
      let invalidIdsArray = []
    
      req.body.forEach((str) => {
        if(validateFoodId(str)) {
          validIdsArray.push(str)
        } else {
          invalidIdsArray.push(str)
        }
      })
    
      if (invalidIdsArray.length > 0 ) res.status(400).send(`יש  שגיאה במידע ששלחת`)
      
      try {
      const favorites = await User.findByIdAndUpdate(req.user._id, {favorites: validIdsArray}, {new: true})
      res.send(favorites);

      } catch(err) {
        res.status(500).send(err.message);
      }
    } else {
      res.status(400).send(`יש  שגיאה במידע ששלחת`)
    }
});

// remove array of favorites from user data
router.post('/favorites', auth, async (req, res) => {
  if (typeof req.body === 'object') {
    let validIdsArray = []
    let invalidIdsArray = []
      req.body.forEach((str) => {
        if(validateFoodId(str)) {
          validIdsArray.push(str)
        } else {
          invalidIdsArray.push(str)
        }
      })
    if (invalidIdsArray.length > 0 ) res.status(400).send(`יש  שגיאה במידע ששלחת`)
    
    try {
    await User.findById(req.user._id).then(async (user) => {
      req.body.forEach((idFromUser, idx) => {
        let newFavs = user.favorites.filter((id) => id !== idFromUser)
        user.favorites = newFavs;
      })
      await user.save();
      res.send(user.favorites);
    })} catch(err) {
      res.status(500).send(err.message);
    }
  } else {
    res.status(400).send(`יש  שגיאה במידע ששלחת`)
  }
})

module.exports = router;
