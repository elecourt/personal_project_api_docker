const mongoose = require("mongoose");
const User = require("./User");

const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    price: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    image:{
      type: String,
      required: false,
    },
    user_id: {
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
    name: this.name,
    price: this.price,
    image: this.image,
    description: this.description,
    user_id: this.user_id,
  };
};

module.exports = mongoose.model("Dish", Schema);
