const socket = io();
socket.on("connect", () => {
    socket.emit('set-user-id', (window.user.userId || null));
});

export default socket;