let socketIO = require('socket.io');
let io = null;
let userSocket = require('./socket_config/User-socket');
let socketClients = []; // store [userId, userSockedId] on connect

exports.config = (server) => {
    io = socketIO(server); 
    io.on('connection', (socket) => {
        socket.on('disconnect', () => {
            // remove client id
            let clientIndex = getClientIndex(null, socket.id);
            if(clientIndex !== -1) {
                socketClients.splice(clientIndex, 1);
            }
        });
        socket.on('set-user-id', (userId) => {
            // add client id
            if(userId) {
                socketClients.push([userId, socket.id]);
            }
        });
        
        userSocket.config(socket, 
            (event, userId) => notify(event, userId)
        ); // socket functions for user operations
    });
}

function getClientIndex(userId, socketId) {
    
    let index = socketClients.findIndex(client => {
        return ((client[0] === userId) || client[1] === socketId);
    });
    return index;
}

function notify(event, userId) {
    let index = getClientIndex(userId, null);
    if(index !== -1 && io !== null) {
        io.sockets.to(socketClients[index][1]).emit(event, null);
    }
}

exports.sendMessage = function(event, message, to) {
    let userIndex = getClientIndex(to, null);
    if(userIndex !== -1 && io !== null) {
        io.sockets.to(socketClients[userIndex][1]).emit(event, message);
    }
}