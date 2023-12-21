const mongoose = require("mongoose");
const User = require("./User");
const Dish = require("./Dish");

const Schema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    total: {
      type: String,
      required: true,
    },
    dishes:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: Dish,
      required: true,
    }],
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
      role:'USER',
    },
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
      role:'RESTAURANT',
    },
  },
  { timestamps: true }
);

Schema.methods.toJSON = function () {
  return {
    _id: this._id,
    date: this.date,
    name: this.name,
    total: this.total,
    dishes: this.dishes,
    user_id: this.user_id,
    restaurant_id: this.restaurant_id,
  };
};

module.exports = mongoose.model("Order", Schema);
