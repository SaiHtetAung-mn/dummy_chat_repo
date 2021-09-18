let express = require("express");
let Auth = require("../models/Auth");
let Mailer = require("../models/Mail");
let Crypto = require('../models/Crypto');
let Validate = require("../models/Validate");
let User = require("../models/User");
let AccountVerify = require('../models/Account-Verification');

let signupRouter = express.Router();

signupRouter.get('/', Auth.isAlreadyAuth, (req, res, next) => {
    res.render('signup');
});

signupRouter.post('/', async (req, res, next) => {
    let name = req.body.name ?? '';
    let email = req.body.email ?? '';
    let password = req.body.password ?? '';
    let c_password = req.body.c_password ?? '';

    // check if user fill all fields
    if(name === '' || email === '' || password === '') {
        res.json({isError: true, error_text: 'All information are required'});
        return;
    }

    // check if two password match
    if(password !== c_password) {
        res.json({isError: true, error_text: 'Password not match'});
        return;
    }

    // check name is valid
    if(!Validate.validateName(name)) {
        res.json({isError: true, error_text: 'Name must be at least 3 characters long'});
        return;
    }

    // check email is valid
    if(!Validate.validateEmail(email)) {
        res.json({isError: true, error_text: 'Invalid email address'});
        return;
    }

    // check password is valid
    if(!Validate.validatePassword(password)) {
        res.json({isError: true, error_text: `Password can contain alphabet, number, special characters
        no white space and must be 5 to 10 characters long`});
        return;
    }

    // if all are valid
    try {
        // check if user with email already exists
        let user = await User.findByEmail(email);
        if(user !== null){
            let err_text = `'${email}' is already taken`;
            res.json({isError: true, error_text: err_text});
            return;
        }

        // create new user if all ok
        let hashPassword = Crypto.createHashPassword(password);
        let newUserId = await User.createUser(name, email, hashPassword);
        if(newUserId) {
            console.log("New user created successfully");
            let longHash = Crypto.createLongHash();
            let newVerifyId = await AccountVerify.createVerification(newUserId, longHash);
            let mailHtml = `<p>Click below link to verify your account<br>
                <a 
                href="https://chatdummy.herokuapp.com/auth/verify/${longHash}"
                >Click here</a></p>`;
            let mailSend = await Mailer.sendMail(email, 'Account verification',null, mailHtml);
            console.log(mailSend.response);
            res.json({isError: false, error_text: null, userId: newUserId});
        }
        else {
            res.json({isError: true, error_text: 'Server error!'});
        }
    }
    catch(err) {
        console.log(err);
        res.json({isError: true, error_text: 'Server error!'});
    }
})

module.exports = signupRouter;