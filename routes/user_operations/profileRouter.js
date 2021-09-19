let express = require("express");
let User = require(`${global.appRootPath}/models/User`);
let Validatator = require(`${global.appRootPath}/models/Validate`);
let Crypto = require(`${global.appRootPath}/models/Crypto`);
let multerConfig = require(`${global.appRootPath}/models/MulterConfig`);

let profileRouter = express.Router();

profileRouter.post("/change_personal_info",
    async function(req, res, next) {
        multerConfig.profileImgUpload.single('profile_pic')(req, res, async (err) => {
            if(err) {
                res.json({isError: true, error_text: err.message});
                return;
            }
            else {
                let newData = {};
                newData.name = req.body.name === undefined ? null : req.body.name;
                newData.email = req.body.email === undefined ? null : req.body.email;
                if(req.file !== undefined) {
                    let path = "/public"+req.file.destination.split("public")[1]+req.file.filename;
                    newData.profilePath = path;
                }
                try {
                    let isUpdated = await User.updateUser(
                        req.user.userId,
                        newData.name, 
                        newData.email, 
                        null,
                        newData.profilePath ?? null,
                        null
                    );
                    if(isUpdated) {
                        res.json({isError: false, error_text: null, newData: newData});
                        return;
                    }
                }
                catch(err) {
                    console.log(err.message);
                    res.json({isError: true, error_text: 'Error image upload'});
                    return;
                }
            }
        });
    } 
)

profileRouter.post("/change_password", async (req, res, next) => {
    let oldPassword = req.body.oldPassword ?? null;
    let newPassword = req.body.newPassword ?? '';
    
    if(oldPassword !== req.user.password) {
        res.json({isError: true, error_text: 'Password incorrect'});
        return;
    }
    else if(!Validatator.validatePassword(newPassword)) {
        res.json({isError: true, error_text: `Password can contain alphabet, number, special characters
        no white space and must be 5 to 10 characters long`});
        return;
    }
    else {
        // Change user password
        try {
            let hashPassword = Crypto.createHashPassword(newPassword);
            let isUpdated = await User.updateUser(req.user.userId, null, null, hashPassword, null, null);
            if(isUpdated) {
                res.json({isError: false, error_text: null});
            }
        }
        catch(err) {
            res.json({isError: true, error_text: 'Server error'});
        }
    }
});

module.exports = profileRouter;