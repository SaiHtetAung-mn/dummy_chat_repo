let jwt = require("jsonwebtoken");
let User = require("../models/User");

exports.authenticate = async function (req, res, next) {
    if(req.cookies[process.env['AUTH_COOKIE_NAME']] === undefined) {
        res.redirect("/login");
    }
    else {
        try {
            let token = req.cookies[process.env['AUTH_COOKIE_NAME']];
            let userId = (jwt.verify(token, process.env['TOKEN_KEY'])).userId;
            let user = await User.findById(userId);
            if(user) {
                // login success
                req.user = user;
                next();
            }
            else {
                res.redirect("/login");
            }
        }
        catch(err) {
            console.log(err);
            res.json({isError: true, error_text: 'Server error'});
        }
    }
}

exports.isAlreadyAuth = async function (req, res, next) {
    if(req.cookies[process.env['AUTH_COOKIE_NAME']] === undefined) {
        next();
    }
    else {
        try {
            let token = req.cookies[process.env['AUTH_COOKIE_NAME']];
            let userId = (jwt.verify(token, process.env['TOKEN_KEY'])).userId;
            let user = await User.findById(userId);
            if(user) {
                res.redirect("/");
            }
            else {
                next();
            }
        }
        catch(err) {
            console.log(err);
            next();
        }
    }
}