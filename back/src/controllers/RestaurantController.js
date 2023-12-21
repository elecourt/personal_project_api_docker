const { Router } = require("express");
const requireRoles = require("../middlewares/require-role");
const requireAuth = require("../middlewares/require-auth");
const User = require("../models/User");
const Dish = require("../models/Dish");
const Order = require("../models/Order");
const authenticator = require("../services/authenticator");

class UserNotFoundException extends Error {
  constructor(message) {
    super(message);
    this.code = "USER_NOT_FOUND";
    this.message = "This user does not exists";
    this.status = 404;
  }
}

class UserBadRequestException extends Error {
  constructor(message) {
    super(message);
    this.code = "BAD_REQUEST_FOR_USER";
    this.message = "This user endpoint not exists";
    this.status = 400;
  }
}

/**
 * @param {Express.Application} app
 * @param {Router} router
 */
module.exports = function (app, router) {
  router.get(
    "/restaurants",
    [requireAuth, requireRoles(["ADMIN","USER"])],
    async (req, res) => {
      try{
        const resto = await User.find({role: "RESTAURANT"});
        if(!resto){
          throw new UserNotFoundException();
        }
        res.send(resto);
      }catch(e) {
        throw new UserBadRequestException();
      }
    }
  );
  router.get(
    "/restaurants/:id",
    [requireAuth, requireRoles(["RESTAURANT"])],
    async (req, res) => {
      try{
        const resto = await User.findOne({_id : req.params.id, role: "RESTAURANT"});
        if(!resto){
          throw new UserNotFoundException();
        }
        res.send(resto);
      }catch(e) {
        throw new UserBadRequestException();
      }
    }
  );
  router.get(
    "/restaurants/:id/dishes",
    [requireAuth],
    async (req, res) => {
      try{
        const dishes = await Dish.find({user_id : req.params.id});
        if(!dishes){
          throw new UserNotFoundException();
        }
        res.send(dishes);
      }catch(e) {
        throw new UserBadRequestException();
      }
    }
  );
  router.get(
    "/restaurants/:id/orders",
    [requireAuth],
    async (req, res) => {
      try{
        const orders = await Order.find({restaurant_id : req.params.id});
        if(!orders){
          throw new UserNotFoundException();
        }
        res.send(orders);
      }catch(e) {
        throw new UserBadRequestException();
      }
    }
  );
  router.post(
    "/restaurants",
    [requireAuth, requireRoles(["ADMIN"])],
    async (req, res) => {
      try{
        req.body.role = "RESTAURANT"
        authenticator.create(req.body);
        res.status(201);
        res.send({"status":"OK","message":"This restaurant has been successfully created"})

      }catch(e) {
        throw new UserBadRequestException();
      }
    }
  );
  router.put(
    "/restaurants/:id",
    [requireAuth],
    async (req, res) => {
      try{
        const user = await User.findByIdAndUpdate( req.params.id,req.body,{new:true});
        if(!user){
          throw new UserNotFoundException();
        }
        res.send(user);
      }catch(e) {
        throw new UserBadRequestException();
      }
      
    }
  );
  router.delete(
    "/restaurants/:id",
    [requireAuth, requireRoles(["ADMIN"])],
    async (req, res) => {
      try{
        const user = await User.findByIdAndDelete( req.params.id,{},{new: true});
        if(!user){
          throw new UserNotFoundException();
        }
        res.send(user);
      }catch(e) {
        throw new UserBadRequestException();
      }
      
    }
  );
};
