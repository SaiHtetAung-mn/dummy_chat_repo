let config = require("../www/config");
let jwt = require("jsonwebtoken");
let User = require("./User");

exports.authenticate = async function (req, res, next) {
    if(req.cookies[config.auth_cookie_name] === undefined) {
        res.redirect("/login");
    }
    else {
        try {
            let token = req.cookies[config.auth_cookie_name];
            let userId = (jwt.verify(token, config.token_key)).userId;
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
    if(req.cookies[config.auth_cookie_name] === undefined) {
        next();
    }
    else {
        try {
            let token = req.cookies[config.auth_cookie_name];
            let userId = (jwt.verify(token, config.token_key)).userId;
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