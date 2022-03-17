let crypto = require("crypto");

exports.createHashPassword = (data) => {
    let md5 = crypto.createHash('md5');
    return String(md5.update(data).digest('hex'));
}

exports.createLongHash = () => {
    let hash = crypto.randomBytes(10).toString('hex');
    return hash;
}