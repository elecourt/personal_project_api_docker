const { Router } = require("express");
const requireRoles = require("../middlewares/require-role");
const requireAuth = require("../middlewares/require-auth");
const Dish = require("../models/Dish");

class DishNotFoundException extends Error {
  constructor(message) {
    super(message);
    this.code = "DISH_NOT_FOUND";
    this.message = "This Dish does not exists";
    this.status = 404;
  }
}

class DishBadRequestException extends Error {
  constructor(message) {
    super(message);
    this.code = "BAD_REQUEST_FOR_DISH";
    this.message = "This Dish endpoint not exists";
    this.status = 400;
  }
}

/**
 * @param {Express.Application} app
 * @param {Router} router
 */
module.exports = function (app, router) {
  router.get(
    "/dishes",
    [requireAuth],
    async (req, res) => {
      try{
        if (req.query){
          const dishes = await Dish.find( req.query );
          if (!dishes){
            throw new DishNotFoundException();
          }
          res.send(dishes);
        }else{        
          const dishes = await Dish.find()
          if (!dishes){
            throw new DishNotFoundException();
          }
          res.send(dishes);
        }
      }catch(e) {
        throw new DishBadRequestException()
      }
      
    }
  );
  router.get(
    "/dishes/:id",
    [requireAuth],
    async (req, res) => {
      try {
        const dish = await Dish.findOne({_id : req.params.id})
        if(!dish) {
          throw new DishNotFoundException()
        }
        res.send(dish);
      }
      catch(e) {
        throw new DishBadRequestException()
      }
    }
  );
  router.post(
    "/dishes",
    [requireAuth, requireRoles(["RESTAURANT"])],
    async (req, res) => {
      try{
        console.log(req.user._id)
        req.body.user_id = req.user._id
        Dish.create(req.body);
        res.status(201);
        res.send({"status":"OK","message":"This dish has been successfully created"})

      }catch(e) {
        throw new DishBadRequestException();
      }
    }
  );
  router.put(
    "/dishes/:id",
    [requireAuth, requireRoles(["RESTAURANT"])],
    async (req, res) => {
      try {
        const dish = await Dish.findByIdAndUpdate( req.params.id,req.body,{new: true})
        if(!dish) {
          throw new DishNotFoundException()
        }
        res.send(dish);
      }
      catch(e) {
        throw new DishBadRequestException()
      }
    }
  );
  router.delete(
    "/dishes/:id",
    [requireAuth, requireRoles(["RESTAURANT"])],
    async (req, res) => {
      try {
        const dish = await Dish.findByIdAndDelete( req.params.id,req.body,{new: true})
        if(!dish) {
          throw new DishNotFoundException()
        }
        res.send(dish);
      }
      catch(e) {
        throw new DishBadRequestException()
      }
    }
  );
};
