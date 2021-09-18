let express = require("express");
let multerConfig = require(`${global.appRootPath}/models/MulterConfig`);
let Message = require(`${global.appRootPath}/models/Message`);
let User = require(`${global.appRootPath}/models/User`);
let Socket = require(`${global.appRootPath}/models/Socket`);
let chatRouter = express.Router();

chatRouter.post("/send_message", async (req, res, next) => {
    if(req.body.to === undefined) {
        res.json({isError: true, error_text: 'Unknown friend to send message'});
    }
    else {
        try {
            let newMessageId = await Message.createMessage(
                req.user[User.props.COL_ID], // sender
                req.body.to, // receiver
                req.body.message
            );
            if(newMessageId) {
                let friendInfo = await User.findById(req.body.to);
                // emit to receiver
                Socket.sendMessage(
                    'message', // event name
                    {
                        from: {
                            userId: req.user[User.props.COL_ID],
                            name: req.user[User.props.COL_NAME],
                            profilePath: req.user[User.props.COL_PROFILE_PATH]
                        },
                        message: {
                            msgId: newMessageId,
                            type: req.body.message.type,
                            content: req.body.message.content,
                            timestamp: req.body.message.timestamp
                        }
                    }, // data
                    req.body.to // userId to send
                );
                // emit to self 
                Socket.sendMessage(
                    'send_message',
                    {
                        to: {
                            userId: friendInfo[User.props.COL_ID],
                            name: friendInfo[User.props.COL_NAME],
                            profilePath: friendInfo[User.props.COL_PROFILE_PATH]
                        },
                        message: {
                            msgId: newMessageId,
                            type: req.body.message.type,
                            content: req.body.message.content,
                            timestamp: req.body.message.timestamp
                        }
                    },
                    req.user[User.props.COL_ID]
                )
                // response to self success of msg send
                res.json({isError: false, error_text: null});
            }
        }
        catch(err) {
            res.json({isError: true, error_text: 'Server error! Message was not sent'});
            console.log(err);
        }
    }
});

chatRouter.post('/send_media_message', 
    (req, res, next) => {
        multerConfig.sendMediaUpload.single('media')(req, res, err => {
            if(err) {
                res.json({isError: true, error_text: err.message});
                return;
            }
            next();
        });
    },
    async (req, res, next) => {
        // first check if friend Id to send is valid
        if(!req.body.to || req.body.to === undefined) {
            res.json({isError: true, error_text: 'Unknown friend to send'});
            return;
        }
        try {
            let newMessage = {};
            if(req.file !== undefined) {
                let path = `/public`+req.file.destination.split("public")[1]+req.file.filename;
                newMessage.content = path;
                newMessage.type = "image";
                newMessage.timestamp = req.body.timestamp;

                let  newMessageId= await Message.createMessage(
                    req.user[User.props.COL_ID], //sender
                    req.body.to, // receiver
                    newMessage
                );

                if(newMessageId) {
                    let friendInfo = await User.findById(req.body.to);
                    // emit to receiver
                    Socket.sendMessage(
                        'message', // event name
                        {
                            from: {
                                userId: req.user[User.props.COL_ID],
                                name: req.user[User.props.COL_NAME],
                                profilePath: req.user[User.props.COL_PROFILE_PATH]
                            },
                            message: {
                                msgId: newMessageId,
                                type: newMessage.type,
                                content: newMessage.content,
                                timestamp: newMessage.timestamp
                            }
                        }, // data
                        req.body.to // userId to send
                    );
                    // emit to self 
                    Socket.sendMessage(
                        'send_message',
                        {
                            to: {
                                userId: friendInfo[User.props.COL_ID],
                                name: friendInfo[User.props.COL_NAME],
                                profilePath: friendInfo[User.props.COL_PROFILE_PATH]
                            },
                            message: {
                                msgId: newMessageId,
                                type: newMessage.type,
                                content: newMessage.content,
                                timestamp: newMessage.timestamp
                            }
                        },
                        req.user[User.props.COL_ID]
                    )
                    // response to self success of msg send
                    res.json({isError: false, error_text: null});
                }
            }
            else {
                throw new Error('Multer error');
            }
        }
        catch(err) {
            console.log(err);
            res.json({isError: true, error_text: 'Error uploading image file'});
        }
})

chatRouter.post('/chatlists', async (req, res, next) => {
    try {
        let lastMsgLists = await Message.findChatList(req.user[User.props.COL_ID]) || [];
        res.json({isError: false, chatList: lastMsgLists});
    }
    catch(err) {
        console.log(err);
        res.json({isError: true, error_text: 'Server error loading chat list'});
    }
});

chatRouter.post('/messages', async (req, res, next) => {
    let friendId = req.body || null;
    try {
        if(!friendId) {
            throw new Error('Unknown friend Id to get messages');
        }
        let messages = await Message.findMessages(req.user[User.props.COL_ID], friendId);
        res.json({isError: false, messages: messages});
    }
    catch(err) {
        console.log(err);
        res.json({isError: true, error_text: 'Server error loading messages'});
    }
})

module.exports = chatRouter;