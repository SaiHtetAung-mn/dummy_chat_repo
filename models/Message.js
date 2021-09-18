const UserProps = (require('./User')).props;
const db_connection = require('./Db-connection');
const TABLE_MESSAGE = 'message';
const COL_ID = 'msgId';
const COL_SENDER = 'sender';
const COL_RECEIVER = 'receiver';
const COL_TYPE = 'type';
const TYPE = ['text', 'image'];
const COL_MESSAGE = 'message';
const COL_TIMESTAMP = 'timestamp';

exports.props = {COL_ID, COL_SENDER, COL_RECEIVER, COL_TYPE, COL_MESSAGE, COL_TIMESTAMP};

exports.createMessage = (sender, receiver, message) => {
    return new Promise((resolve, reject) => {
        let id = Date.now();
        let type = message.type === "image" ? TYPE[1] : TYPE[0];
        let query = `insert into "${TABLE_MESSAGE}" ("${COL_ID}", "${COL_SENDER}", 
            "${COL_RECEIVER}", "${COL_TYPE}", "${COL_MESSAGE}", "${COL_TIMESTAMP}") 
            values('${id}', '${sender}', '${receiver}', '${type}', '${message.content}', 
            '${message.timestamp}')`;
        db_connection.query(query, (err) => {
            if(err) {
                reject(err);
            }
            else {
                resolve(id);
            }
        });
    });
}

exports.findChatList = (userId) => {
    return new Promise((resolve, reject) => {
        //find every message chatted with user descendent order

        let query = `select U."${UserProps.COL_ID}", U."${UserProps.COL_NAME}", 
        U."${UserProps.COL_PROFILE_PATH}", M."${COL_ID}", M."${COL_MESSAGE}", 
        M."${COL_TYPE}", M."${COL_TIMESTAMP}" from "${UserProps.TABLE_USER}" U,"${TABLE_MESSAGE}" 
        M where ((M."${COL_SENDER}"!='${userId}' and M."${COL_SENDER}"=U."${UserProps.COL_ID}") 
        or (M."${COL_RECEIVER}"!='${userId}' and M."${COL_RECEIVER}"=U."${UserProps.COL_ID}")) 
        and (M."${COL_SENDER}"='${userId}' or M."${COL_RECEIVER}"='${userId}') order by M."${COL_ID}" desc`;

        db_connection.query(query, (err, result) => {
            if(err) {
                reject(err);
            }
            else {
                let lastChatItem = [];
                // group by User Id
                let rs = result.rows.filter(msg => {
                    if(!lastChatItem.includes(msg[UserProps.COL_ID])) {
                        lastChatItem.push(msg[UserProps.COL_ID]);
                        return true;
                    }
                    return false;
                });
                resolve(rs);
            }
        });
    });
}

exports.findMessages = (userId, friendId) => {
    return new Promise((resolve, reject) => {
    let query = `select * from "${TABLE_MESSAGE}" where ("${COL_SENDER}"='${userId}' and 
        "${COL_RECEIVER}"='${friendId}') or ("${COL_SENDER}"='${friendId}' and 
        "${COL_RECEIVER}"='${userId}')`;
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