let multer = require("multer");
let maxSize = (5*1024*1024); // 5MB

let multerProfileImgStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        if(file === undefined || req.file === undefined) {
            cb(new Error('No file', null));
            return;
        }
        cb(null, global.appRootPath+"/public/images/profile_images");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `/profile_${Date.now()}.${ext}`);
    }
});

let multerSendMediaStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, global.appRootPath+"/public/images/user_images");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `/image_${Date.now()}.${ext}`);
    }
})

let multerProfileImgFilter = (req, file, cb) => {
    if(req.file === undefined || file === undefined) {
        return cb(new Error('No file', false));
    }
    let img_ext = ["png", "jpg", "jpeg"];
    let ext = file.mimetype.split("/")[1];
    if(img_ext.indexOf(ext) === -1) {
        cb(new Error('Error! Invalid image file', false));
    }
    else {
        cb(null, true);
    }
}

let multerSendMediaFilter = (req, file, cb) => {
    let fileType = String(file.mimetype);
    if(!fileType.match('image/*')) {
        cb(new Error('Invalid image file', false));
    }
    else {
        cb(null, true);
    }
}

exports.profileImgUpload = multer({
    storage: multerProfileImgStorage,
    fileFilter: multerProfileImgFilter,
    limits: {
        files: 1,
        fileSize: maxSize
    }
});

exports.sendMediaUpload = multer({
    storage: multerSendMediaStorage,
    fileFilter: multerSendMediaFilter,
    limits: {
        file: 1,
        fileSize: maxSize
    }
});