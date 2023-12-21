const { Router } = require("express");
const requireRoles = require("../middlewares/require-role");
const requireAuth = require("../middlewares/require-auth");
const User = require("../models/User");
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
    "/users",
    [requireAuth, requireRoles(["ADMIN"])],
    async (req, res) => {
      try{
        if (req.query){
          const users = await User.find( req.query );
          if (!users){
            throw new UserNotFoundException();
          }
          res.send(users);
        }else{        
          const users = await User.find()
          if (!users){
            throw new UserNotFoundException();
          }
          res.send(users);
        }
      }catch(e) {
        throw new UserBadRequestException();
      } 
    }
  );
  router.get(
    "/users/@me",
    [requireAuth],
    async (req, res) => {
      res.send(req.user);
    }
  );
  router.get(
    "/users/:id",
    [requireAuth],
    async (req, res) => {
      try {
        const user = await User.findOne({_id : req.params.id});
        if(!user) {
          throw new UserNotFoundException();
        }
        res.send(user);
      }
      catch(e) {
        throw new UserBadRequestException();
      }
    }
  );
  router.post(
    "/users",
    [requireAuth, requireRoles(["USER"])],
    async (req, res) => {
      try{
        authenticator.create(req.body);
        res.status(201);
        res.send({"status":"OK","message":"This user has been successfully created"})

      }catch(e) {
        throw new UserBadRequestException();
      }
    }
  );
  router.put(
    "/users/:id",
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
    "/users/:id",
    [requireAuth, requireRoles(["ADMIN", "USER"])],
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
