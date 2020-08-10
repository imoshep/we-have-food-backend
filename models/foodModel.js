const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const _ = require("lodash");
const { string } = require("@hapi/joi");

const locationRegex = /^{"lat":\d{2}.\d{5,12},"lng":\d{2}.\d{5,12}}$/;

const foodSchema = new mongoose.Schema({
  foodTitle: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  foodDesc: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1024,
  },
  foodImage: {
    type: String,
    minlength: 2,
    maxlength: 255,
  },
  foodLocation: {
    type: String,
    match: locationRegex,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: { type: Date, default: Date.now },
});

const Food = mongoose.model("Food", foodSchema);

function validateFood(food) {
  const foodValidationSchema = Joi.object({
    foodTitle: Joi.string().min(2).max(255).required(),
    foodDesc: Joi.string().min(2).max(1024).required(),
    foodImage: Joi.string().min(2).max(255),
    foodLocation: Joi.string().regex(locationRegex),
  });
  return foodValidationSchema.validate(food);
}

function validateImage(file) {
  return file.mimetype.startsWith("image");
}

module.exports = {
  Food,
  validateFood,
  validateImage,
};
