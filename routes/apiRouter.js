let express = require("express");
let Auth = require("../utils/Auth");

let profileRouter = require('./api/profileRouter');
let friendsRouter = require('./api/friendsRouter');
let chatRouter = require("./api/chatRouter");

let userOprRouter = express.Router();

// Auth
userOprRouter.use(Auth.authenticate);

// Sub router
userOprRouter.use("/profile", profileRouter);
userOprRouter.use("/friends", friendsRouter);
userOprRouter.use("/chat", chatRouter);

module.exports = userOprRouter;