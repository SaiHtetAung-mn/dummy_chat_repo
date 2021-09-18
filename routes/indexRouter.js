let express = require("express");
let Auth = require("../models/Auth");

let indexRouter = express.Router();

indexRouter.route("/")
.get(Auth.authenticate, (req, res, next) => {
    // remove password, isActive
    let {password, isActive, ...rest} = req.user;
    delete [password, isActive];
    res.locals.user = rest;
    res.render("index");
})

module.exports = indexRouter;