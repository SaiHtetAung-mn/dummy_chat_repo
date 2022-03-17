exports.config = (socket, notify) => {
    socket
    .on ('confirm-friendship', userId => {
        notify('confirm-friendship', userId);
    })
    .on('add-friend', userId => {
        notify('add-friend', userId);
    })
    .on('unfriend', userId => {
        notify('unfriend', userId);
    })
    .on('cancel-friend-request', userId => {
        notify('cancel-friend-request', userId);
    });
}