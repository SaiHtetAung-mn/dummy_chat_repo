let express = require("express");
let Validator = require("../models/Validate");
let Crypto = require("../models/Crypto");
let User = require("../models/User");
let Mailer = require("../models/Mail");
let AccountVerify = require('../models/Account-Verification');
let authRouter = express.Router();

let VERIFICATION_CODES = {};

authRouter.get("/forget_password", (req, res, next) => {
    res.render('forget-password');
});

authRouter.post('/r_password_send_email', async (req, res, next) => {
    let email = req.body.email ?? null;
    let v_code = String(Math.random().toFixed(6)).substr(2); // verification code of 6 digit long
    try {
        let user = await User.findByEmail(email);
        if(!user) {
            res.json({isError: true, error_text: `No such user with ${email} exists`});
            return;
        }
        let mailInfo = await Mailer.sendMail(
            email,
            'Verification code',
            `${v_code} is your verification code to reset password`,
            null
        );
        VERIFICATION_CODES[user[User.props.COL_ID]] = v_code;
        res.json({isError: false, userId: user[User.props['COL_ID']]});
    }
    catch(err) {
        console.log(err);
        res.json({isError: true, error_text: 'Error sending email'});
    }
});

authRouter.post("/reset_password", async (req, res, next) => {
    let v_code = req.body['v_code'] ?? null;
    let new_password = req.body['new_password'] ?? null;
    let c_new_password = req.body['c_new_password'] ?? null;
    let userId = req.body.userId ?? null;

    try {
        if(!userId && !VERIFICATION_CODES[userId]) {
                res.json({isError: true, error_text: 'Verification code required'});
                return;
        }
        if(VERIFICATION_CODES[userId] !== v_code) {
            res.json({isError: true, error_text: 'Wrong verification code'});
            return;
        }
        if(new_password !== c_new_password) {
            res.json({isError: true, error_text: 'Password not match'});
            return;
        }
        if(!Validator.validatePassword(c_new_password)) {
            res.json({isError: true, error_text: Validator.PASSWORD_ERROR_TEXT});
            return;
        }
        // all ok
        let hashPassword = Crypto.createHashPassword(c_new_password);
        let isUpdated = await User.updateUser(userId, null, null, hashPassword, null, null);
        if(isUpdated) {
            res.json({isError: false, error_text: null}) 
        }
        else {
            res.json({isError: true, error_text: 'Server error'});
        }
    }
    catch(err) {
        res.json({isError: true, error_text: 'Server error'});
    }
})

authRouter.get("/pending/:userId", async (req, res, next) => {
    let userId = req.params.userId ?? null;
    try {   
        let user = await User.findById(String(userId));
        if(user && !(user[User.props.COL_IS_ACTIVE])) {
            res.render("account-pending");
        }
        else {
            res.redirect("/");
        }
    }
    catch(err) {
        console.log(err);
        res.redirect("/");
    }
});

authRouter.get("/verify/:code", async (req, res, next) => {
    try {
        let code = req.params.code ?? null;
        if(code) {
            let verifyUser = await AccountVerify.findByCode(code);
            if(verifyUser) {
                await User.updateUser(verifyUser[AccountVerify.props['COL_USER_ID']], 
                    null, null, null, null, 1
                );
                await AccountVerify.deleteById(verifyUser[AccountVerify.props['COL_ID']]);
                res.render('account-verify');
            }
            else {
                throw new Error();
            }
        }
        else {
            throw new Error();
        }
    }
    catch(err) {
        console.log(err.message);
        res.status(400).end("Bad request");
    }
})

module.exports = authRouter;