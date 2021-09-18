const PATTERN_EMAIL = /\w+\d*@(\w+.)+\w+/g;
const PATTERN_NAME = /([a-z]{2,}\s*)+/ig;
const PATTERN_PASSWORD = /^\S*[a-zA-z0-9!@#\$%\^\&*\)\(+=-_.]{5,10}\S*$/ig;

exports.PASSWORD_ERROR_TEXT = `Password can contain alphabet, number, special characters
    no white space and must be 5 to 10 characters long`;

// all function return null if not match

exports.validateEmail = (email) => {
    return String(email).match(PATTERN_EMAIL);
}

exports.validateName = (name) => {
    return String(name).match(PATTERN_NAME);
}

exports.validatePassword = (password) => {
    return String(password).match(PATTERN_PASSWORD);
}