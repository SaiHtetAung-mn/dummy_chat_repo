const db_connection = require("./Db-connection");

const escape = (require('mysql')).escape;

const TABLE_VERIFICATION = 'account_verification';
const COL_ID = 'accountId';
const COL_USER_ID = 'userId';
const COL_CODE = 'code';

exports.props = {TABLE_VERIFICATION, COL_ID, COL_USER_ID, COL_CODE};

exports.createVerification = (userId, code) => {
    return new Promise((resolve, reject) => {
        let newId = Date.now().toString();
        let query = `insert into "${TABLE_VERIFICATION}" ("${COL_ID}", "${COL_USER_ID}", 
            "${COL_CODE}") values('${newId}', '${userId}', '${code}')`;
        db_connection.query(query, (err) => {
            if(err) {
                reject(err);
            }
            else {
                resolve(newId);
            }
        })
    })
}

exports.findByCode = (code) => {
    return new Promise((resolve, reject) => {
        let query = `select * from "${TABLE_VERIFICATION}" where "${COL_CODE}"='${code}'`;
        db_connection.query(query, (err, result) => {
            if(err) {
                reject(err);
            }
            else {
                let vUser = result.rows.length > 0 ? result.rows[0] : null;
                resolve(vUser);
            }
        })
    })
}

exports.deleteById = (id) => {
    return new Promise((resolve, reject) => {
        let query = `delete from "${TABLE_VERIFICATION}" where "${COL_ID}"='${id}'`;
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