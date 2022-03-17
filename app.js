// set global app root path
global.appRootPath = __dirname;

require('dotenv').config();
const config = require('./config');
const http = require('http');
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const Socket = require('./utils/Socket');
const app = express();

const PORT = process.env['SERVER_PORT'] || 3000;
const HOSTNAME = process.env['SERVER_HOSTNAME'];

const indexRouter = require("./routes/indexRouter");
const authRouter = require("./routes/authRouter");
const loginRouter = require("./routes/loginRouter");
const logoutRouter = require("./routes/logoutRouter");
const signupRouter = require("./routes/signupRouter");
const apiRouter = require("./routes/apiRouter");

// view engine
app.set("view engine", "ejs");

// Cross Origin Resource Sharing
app.use(cors(
    {origin: 'http://'+process.env.SERVER_HOSTNAME+":"+process.env.SERVER_PORT}
));

// cookie parser
app.use(cookieParser(process.env['COOKIE_KEY']));

// url body middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.text());
app.use(express.json());

// static middlewares
app.use("/public", express.static(__dirname+"/public"));
app.use(express.static(__dirname+'/public'));

// routers
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/signup", signupRouter);
app.use("/api", apiRouter);

// route exception
app.all("*", (req, res, next) => {
    res.render('404');
})

const server = http.createServer(app);
Socket.config(server);
server.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on ${HOSTNAME}`);
});
