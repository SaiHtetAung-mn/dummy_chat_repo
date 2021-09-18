let express = require('express');
let config = require('../www/config');

let logoutRouter = express.Router();

logoutRouter.route("/")

.get((req, res, next) => {
    res.clearCookie(config.auth_cookie_name);
    res.end("Logout successfully");
})

.post((req, res, next) => {
    res.clearCookie(config.auth_cookie_name);
    res.json({isError: false, error_text: null});
})

module.exports = logoutRouter;