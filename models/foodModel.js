const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const _ = require("lodash");

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
  foodCity: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
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
    foodImage: Joi.string().max(255).allow(""),
    foodCity: Joi.string().min(2).max(255).required(),
  });
  return foodValidationSchema.validate(food);
}

function validateImage(file) {
  return file.mimetype.startsWith("image");
}

function validateFoodId(foodId) {
  return mongoose.Types.ObjectId.isValid(foodId) 
    && (new mongoose.Types.ObjectId(foodId)).toString() === foodId;
}

module.exports = {
  Food,
  validateFood,
  validateImage,
  foodSchema,
  validateFoodId
};