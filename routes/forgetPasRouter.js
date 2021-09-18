let express = require("express");

let forgetPasRouter = express.Router();

forgetPasRouter.get('/', (req, res, next) => {
    res.render('forget-password');
});

module.exports = forgetPasRouter;