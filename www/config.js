const all_expiresIn = (7*24*3600*1000); // 7 days

module.exports = {
    token_expiresIn: all_expiresIn,
    cookie_expiresIn: all_expiresIn,
    cookie_key: process.env['COOKIE_KEY'],
    token_key: process.env['TOKEN_KEY'],
    auth_cookie_name: process.env['AUTH_COOKIE_NAME']
}