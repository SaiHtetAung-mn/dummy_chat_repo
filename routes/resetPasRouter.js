let express = require("express");

let resetPasRouter = express.Router();

resetPasRouter.get('/', (req, res, next) => {
    res.render('reset-password');
});

module.exports = resetPasRouter;