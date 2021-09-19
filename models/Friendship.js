const db_connection = require("./Db-connection");
const UserProps = (require("./User")).props;
const escape = (require('mysql')).escape;

const TABLE_FRIENDSHIP = 'friendship';
const COL_ID = 'fsId';
const COL_REQUESTER = 'requester';
const COL_ACCEPTER = 'accepter';
const COL_STATUS = 'status';

exports.findById = (id) => {
    return new Promise ((resolve, reject) => {
        let query = `select * from "${TABLE_FRIENDSHIP}" where "${COL_REQUESTER}"='${id}' or 
            "${COL_ACCEPTER}"='${id}'`;
        db_connection.query(query, (err, result) => {
            if(err) {
                reject(err);
            }
            else {
                resolve(result.rows);
            }
        })
    })
}

exports.findMyFriends = (id) => {
    return new Promise((resolve, reject) => {
        let query = `select U."${UserProps.COL_ID}", U."${UserProps.COL_NAME}", 
            U."${UserProps.COL_PROFILE_PATH}" from "${UserProps.TABLE_USER}" U, 
            "${TABLE_FRIENDSHIP}" F where ((F."${COL_REQUESTER}"!='${id}' and 
            F."${COL_REQUESTER}"=U."${UserProps.COL_ID}") or (F."${COL_ACCEPTER}"!='${id}' and 
            F."${COL_ACCEPTER}"=U."${UserProps.COL_ID}")) and (F."${COL_REQUESTER}"='${id}' or 
            F."${COL_ACCEPTER}"='${id}') and F."${COL_STATUS}"=true`;
        db_connection.query(query, (err, result) => {
            if(err) {
                reject(err);
            }
            else {
                resolve(result.rows);
            }
        })
    })
}

exports.findFriendsRequest = (id) => {
    return new Promise((resolve, reject) => {
        let query = `select U."${UserProps.COL_ID}", U."${UserProps.COL_NAME}", 
            U."${UserProps.COL_PROFILE_PATH}" from "${UserProps.TABLE_USER}" U, 
            "${TABLE_FRIENDSHIP}" F where ((F."${COL_REQUESTER}"!='${id}' and 
            F."${COL_REQUESTER}"=U."${UserProps.COL_ID}") or (F."${COL_ACCEPTER}"!='${id}' and 
            F."${COL_ACCEPTER}"=U."${UserProps.COL_ID}")) and (F."${COL_ACCEPTER}"='${id}') 
            and F."${COL_STATUS}"=false`;
        db_connection.query(query, (err, result) => {
            if(err) {
                reject(err);
            }
            else {
                resolve(result.rows);
            }
        })
    })
}

exports.requestFriendship = (requester, accepter) => {
    return new Promise((resolve, reject) => {
        let id = String(Date.now());
        let query = `insert into "${TABLE_FRIENDSHIP}" 
            ("${COL_ID}", "${COL_REQUESTER}", "${COL_ACCEPTER}", "${COL_STATUS}") 
            values('${id}', '${requester}', '${accepter}', false)`;
        db_connection.query(query, (err) => {
            if(err) {
                reject(err);
            }
            else {
                resolve(true);
            }
        })
    })
}

exports.deleteFriendship = (userId, friendId) => {
    return new Promise((resolve, reject) => {
        let query = `delete from "${TABLE_FRIENDSHIP}" where 
            ("${COL_REQUESTER}"='${userId}' and "${COL_ACCEPTER}"='${friendId}') or 
            ("${COL_REQUESTER}"='${friendId}' and "${COL_ACCEPTER}"='${userId}')`;
        db_connection.query(query, (err) => {
            if(err) {
                reject(err);
            }
            else {
                resolve(true);
            }
        });
    });
}

exports.acceptFriendship = (userId, friendId) => {
    return new Promise((resolve, reject) => {
        let query = `update "${TABLE_FRIENDSHIP}" set "${COL_STATUS}"=true where 
            "${COL_REQUESTER}"='${friendId}' and "${COL_ACCEPTER}"='${userId}'`;
        db_connection.query(query, (err) => {
            if(err) {
                reject(err);
            }
            else {
                resolve(true);
            }
        });
    });
}