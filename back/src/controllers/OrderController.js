const { Router } = require("express");
const requireRoles = require("../middlewares/require-role");
const requireAuth = require("../middlewares/require-auth");
const Order = require("../models/Order");

class DishNotFoundException extends Error {
  constructor(message) {
    super(message);
    this.code = "DISH_NOT_FOUND";
    this.message = "This Order does not exists";
    this.status = 404;
  }
}

class DishBadRequestException extends Error {
  constructor(message) {
    super(message);
    this.code = "BAD_REQUEST_FOR_DISH";
    this.message = "This Order endpoint not exists";
    this.status = 400;
  }
}

/**
 * @param {Express.Application} app
 * @param {Router} router
 */
module.exports = function (app, router) {
  router.get(
    "/orders",
    [requireAuth],
    async (req, res) => {
      try{
        if (req.query){
          const orders = await Order.find( req.query );
          if (!orders){
            throw new DishNotFoundException();
          }
          res.send(orders);
        }else{        
          const orders = await Order.find()
          if (!orders){
            throw new DishNotFoundException();
          }
          res.send(orders);
        }
      }catch(e) {
        throw new DishBadRequestException()
      }
      
    }
  );
  router.get(
    "/orders/:id",
    [requireAuth],
    async (req, res) => {
      try {
        const order = await Order.findOne({_id : req.params.id})
        if(!order) {
          throw new DishNotFoundException()
        }
        res.send(order);
      }
      catch(e) {
        throw new DishBadRequestException()
      }
    }
  );
  router.post(
    "/orders",
    [requireAuth, requireRoles(["USER", "ADMIN"])],
    async (req, res) => {
      try{
        Order.create(req.body);
        res.send("Order created");
      }catch(e) {
        throw new DishBadRequestException();
      }
    }
  );
  router.put(
    "/orders/:id",
    [requireAuth],
    async (req, res) => {
      try {
        const order = await Order.findByIdAndUpdate( req.params.id,req.body,{new: true})
        if(!order) {
          throw new DishNotFoundException()
        }
        res.send(order);
      }
      catch(e) {
        throw new DishBadRequestException()
      }
    }
  );
  router.delete(
    "/orders/:id",
    [requireAuth, requireRoles(["RESTAURANT", "ADMIN"])],
    async (req, res) => {
      try {
        const order = await Order.findByIdAndDelete( req.params.id,req.body,{new: true})
        if(!order) {
          throw new DishNotFoundException()
        }
        res.send(order);
      }
      catch(e) {
        throw new DishBadRequestException()
      }
    }
  );
};
