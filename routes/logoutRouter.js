let express = require('express');

let logoutRouter = express.Router();

logoutRouter.route("/")

.get((req, res, next) => {
    res.clearCookie(process.env['AUTH_COOKIE_NAME']);
    res.end("Logout successfully");
})

.post((req, res, next) => {
    res.clearCookie(process.env['AUTH_COOKIE_NAME']);
    res.json({isError: false, error_text: null});
})

module.exports = logoutRouter;