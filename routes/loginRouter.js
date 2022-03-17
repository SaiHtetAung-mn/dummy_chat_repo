let express = require("express");
let jwt = require("jsonwebtoken");
let config = require("../config");
let User = require('../models/User');
let Auth = require("../utils/Auth");

let loginRouter = express.Router();

loginRouter.route('/')

.get(Auth.isAlreadyAuth, (req, res, next) => {
    res.render('login');
})

.post(async (req, res, next) => {
    let email = req.body.email ?? null;
    let password = req.body.password ?? null;
    try {
        let user = await User.findByEmail(email);
        if(user) {
            if(user.password === password) {
                // check if not user account is already verified
                if(!user[User.props.COL_IS_ACTIVE]) {
                    res.json({isError: true, 
                        error_text: 'You need to verify your account first! check your email.'
                    });
                return;
                }

                // create token with user id
                let userId = {userId: user.userId};
                let token = jwt.sign(
                    userId, 
                    process.env['TOKEN_KEY'], 
                    {expiresIn: config.token_expiresIn}
                );

                // set cookie
                res.cookie(
                    process.env['AUTH_COOKIE_NAME'], 
                    token,
                    {
                        maxAge: config.cookie_expiresIn,
                        httpOnly: true
                    }
                )
                res.json({isError: false, error_text: null});
            }
            else {
                res.json({isError: true, error_text: 'Password incorrect'});
            }
        }
        else {
            res.json({isError: true, error_text: `No user with '${email}' exists`});
        }
    }
    catch(err) {
        console.log(err);
        res.json({isError: true, error_text: 'Server error!'});
    }

})

module.exports = loginRouter;