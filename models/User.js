const db_connection = require('./Db-connection');
const escape = (require('mysql')).escape;
const TABLE_USER = 'user';
const COL_ID = 'userId';
const COL_NAME = 'name';
const COL_EMAIL = 'email';
const COL_PASSWORD = 'password';
const COL_PROFILE_PATH = 'profilePath';
const COL_IS_ACTIVE = 'isActive';

exports.props = {TABLE_USER, COL_ID, COL_NAME, COL_EMAIL, COL_PROFILE_PATH, COL_IS_ACTIVE};

exports.findByEmail = (email) => {
    return new Promise((resolve, reject) => {
        let query = `select * from "${TABLE_USER}" where "${COL_EMAIL}"='${email}'`;
        db_connection.query(query, (err, result) => {
            if(err) {
                reject(err);
            }
            else {
                result.rows.length === 0 ? resolve(null) : resolve(result.rows[0]);
            }
        })
    })
}

exports.findById = (id) => {
    return new Promise((resolve, reject) => {
        let query = `select * from "${TABLE_USER}" where "${COL_ID}"='${id}'`;
        db_connection.query(query, (err, result) => {
            if(err) {
                reject(err);
            }
            else {
                result.rows.length === 0 ? resolve(null) : resolve(result.rows[0]);
            }
        })
    })
}

exports.findByRegexName = (name) => {
    return new Promise((resolve, reject) => {
        let query = `select "${COL_ID}", "${COL_NAME}", "${COL_PROFILE_PATH}" from "${TABLE_USER}" 
            where LOWER(${COL_NAME}) LIKE '%${name}%'`;
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

exports.findByIdList = (list = []) => {
    return new Promise((resolve, reject) => {
        if(list.length == 0) {
            return resolve([]);
        }
        let query = `select "${COL_ID}", "${COL_NAME}", "${COL_PROFILE_PATH}" from "${TABLE_USER}" 
            where "${COL_ID}" in (`+list.map(item => `'${item}'`)+`)`;
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

exports.createUser = (name, email, password) => {
    return new Promise((resolve, reject) => {
        let id = (new Date()).getTime();
        let query = `insert into "${TABLE_USER}" ("${COL_ID}", "${COL_NAME}", "${COL_EMAIL}", 
            "${COL_PASSWORD}") values('${id}', '${name}', '${email}', '${password}')`;
        
        db_connection.query(query, (err) => {
            if(err) {
                reject(err);
            }
            else {
                resolve(id);
            }
        });
    })
}

exports.updateUser = (id, name, email, password, profilePath, isActive) => {
    return new Promise((resolve, reject) => {
        let q_name = name == null ? '' : `"${COL_NAME}" = '${name}',`;
        let q_email = email == null ? '' : `"${COL_EMAIL}" = '${email}',`;
        let q_password = password == null ? '' : `"${COL_PASSWORD}" = '${password}',`;
        let q_profilePath = profilePath == null ? '' : `"${COL_PROFILE_PATH}" = '${profilePath}',`;
        let q_isActive = isActive == null ? '' : `"${COL_IS_ACTIVE}"=true,`;
        
        let query = `update "${TABLE_USER}" set ${q_name} ${q_email} ${q_password} 
            ${q_profilePath} ${q_isActive}`;
        query = query.trim();
        query = query.substr(0, query.length-1);
        query += ` where "${COL_ID}" = '${id}'`;
        
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