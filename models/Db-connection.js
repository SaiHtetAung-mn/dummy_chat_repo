// let mysql = require('mysql');
let pg = require("pg");

let connection = new pg.Client({
    user: process.env['DB_USERNAME'],
    port: process.env['DB_PORT'],
    host: process.env.DB_HOSTNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false
    }
});

connection.connect(err => {
    if(err) {
        console.log(err.message);
    }
    else {
        console.log('Connected to database successfully');
        // create table if not exists
        connection.query(getUserSchemaQuery(), (err) => {
            if(err) {
                console.log(err.message);
                console.log("User table not created");
            }
            else {
                console.log("User table created successfully");
            }
        });
        connection.query(getMessageSchemaQuery(), (err) => {
            if(err) {
                console.log(err.message);
                console.log("Message table not created");
            }
            else {
                console.log("Message table created successfully");
            }
        });
        connection.query(getFriendShipSchemaQuery(), (err) => {
            if(err) {
                console.log(err.message);
                console.log("Friendship table not created");
            }
            else {
                console.log("Friendship table created successfully");
            }
        });
        connection.query(getAccVerifySchemaQuery(), (err) => {
            if(err) {
                console.log(err.message);
                console.log("AccVerification table not created");
            }
            else {
                console.log("AccVerification table created successfully");
            }
        });
        connection.query(`delete from "account_verification";delete from "message";
            delete from "friendship";delete from "user"`, err => {
                if(err) {
                    console.log(err.message);
                }
            })
    }
});

// connection.connect(err => {
//     if(err) {
//         console.error('Error connecting to database :'+err.message);
//         return;
//     }
//     console.log('Connected to database successfully.');
// });

// let connection = mysql.createConnection({
//     host: process.env.DB_HOSTNAME,
//     user: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD ?? '',
//     database: process.env.DB_NAME
// });

function getUserSchemaQuery() {
    const TABLE_USER = 'user';
    const COL_ID = 'userId';
    const COL_NAME = 'name';
    const COL_EMAIL = 'email';
    const COL_PASSWORD = 'password';
    const COL_PROFILE_PATH = 'profilePath';
    const COL_IS_ACTIVE = 'isActive';

    let query = `create table if not exists "${TABLE_USER}" (
        "${COL_ID}" varchar(20) not null,
        "${COL_NAME}" varchar(20) not null,
        "${COL_EMAIL}" varchar(25) not null,
        "${COL_PASSWORD}" varchar(50) not null,
        "${COL_PROFILE_PATH}" varchar(200) default '/public/images/profile_images/user.png',
        "${COL_IS_ACTIVE}" boolean default false,
        primary key("${COL_ID}")
    )`;
    return query;
}

function getMessageSchemaQuery() {
    const TABLE_MESSAGE = 'message';
    const COL_ID = 'msgId';
    const COL_SENDER = 'sender';
    const COL_RECEIVER = 'receiver';
    const COL_TYPE = 'type';
    const COL_MESSAGE = 'message';
    const COL_TIMESTAMP = 'timestamp';

    let query = `create table if not exists "${TABLE_MESSAGE}" (
        "${COL_ID}" varchar(20) not null,
        "${COL_SENDER}" varchar(20) not null references "user"("userId") on delete no action on update no action,
        "${COL_RECEIVER}" varchar(20) not null references "user"("userId") on delete no action on update no action,
        "${COL_TYPE}" varchar(10) not null,
        "${COL_MESSAGE}" text not null,
        "${COL_TIMESTAMP}" varchar(30) not null,
        primary key("${COL_ID}")
    )`;
    return query;
}

function getFriendShipSchemaQuery() {
    const TABLE_FRIENDSHIP = 'friendship';
    const COL_ID = 'fsId';
    const COL_REQUESTER = 'requester';
    const COL_ACCEPTER = 'accepter';
    const COL_STATUS = 'status';
    
    let query = `create table if not exists "${TABLE_FRIENDSHIP}" (
        "${COL_ID}" varchar(20) not null,
        "${COL_REQUESTER}" varchar(20) not null references "user"("userId") on delete no action on update no action,
        "${COL_ACCEPTER}" varchar(20) not null references "user"("userId") on delete no action on update no action,
        "${COL_STATUS}" boolean default false,
        primary key("${COL_ID}")
    )`;
    return query;
}

function getAccVerifySchemaQuery() {
    const TABLE_VERIFICATION = 'account_verification';
    const COL_ID = 'accountId';
    const COL_USER_ID = 'userId';
    const COL_CODE = 'code';

    let query = `create table if not exists "${TABLE_VERIFICATION}" (
        "${COL_ID}" varchar(20) not null,
        "${COL_USER_ID}" varchar(20) not null references "user"("userId") on delete no action on update no action,
        "${COL_CODE}" varchar(40) not null,
        primary key("${COL_ID}")
    )`;
    return query;
}

module.exports = connection;