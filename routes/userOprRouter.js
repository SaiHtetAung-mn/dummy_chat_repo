let express = require("express");
let Auth = require("../models/Auth");

let profileRouter = require('./user_operations/profileRouter');
let friendsRouter = require('./user_operations/friendsRouter');
let chatRouter = require("./user_operations/chatRouter");

let userOprRouter = express.Router();

// Auth
userOprRouter.use(Auth.authenticate);

// Sub router
userOprRouter.use("/profile", profileRouter);
userOprRouter.use("/friends", friendsRouter);
userOprRouter.use("/chat", chatRouter);

module.exports = userOprRouter;