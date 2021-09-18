let express = require("express");
let Friendship = require(`${global.appRootPath}/models/Friendship`);
let User = require(`${global.appRootPath}/models/User`);

let friendsRouter = express.Router();

friendsRouter.post("/search_friends", async (req, res, next) => {
    let searchName = String(req.body).toLowerCase();
    let resFriends = [];
    try {
        let searchFriends = await User.findByRegexName(searchName) || [];
        if(searchFriends.length === 0) {
            res.json({isError: false, friends: []});
            return;
        }
        let friendships = await Friendship.findById(req.user[User.props.COL_ID]);
        searchFriends.forEach(user => {
            // remove myself from array;
            if(user[User.props.COL_ID] === req.user[User.props.COL_ID]) {
                return;
            }

            let friend = {userId: user[User.props.COL_ID], name: user.name, profilePath: user.profilePath};
            let friendship = friendships.find(item => {
                return (item.requester === user[User.props.COL_ID] || item.accepter === user[User.props.COL_ID])
            });
            if(friendship === undefined) {
                friend.isRequested = null;
                friend.status = null;
            }
            else {
                friend.status = friendship.status;
                friend.isRequested = friendship.accepter === req.user[User.props.COL_ID] ? 1 : 0;
            }
            resFriends.push(friend);
        });
        res.json({isError: false, friends: resFriends});
    }
    catch(err) {
        console.log(err);
        res.json({isError: true, error_text: 'Server error'});
    }
});

friendsRouter.post("/my_friends_list", async (req, res, next) => {
    try {
        let myFriends = await Friendship.findMyFriends(req.user[User.props.COL_ID]);
        res.json({isError: false, friends: myFriends});
    }
    catch(err) {
        console.log(err);
        res.json({isError: true, error_text: 'Server error'});
    }
});

friendsRouter.post("/friends_request_list", async (req, res, next) => {
    try {
        let friendsRequests = await Friendship.findFriendsRequest(req.user[User.props.COL_ID]);
        res.json({isError: false, friends: friendsRequests});
    }
    catch(err) {
        console.log(err);
        res.json({isError: true, error_text: 'Server error'});
    }
});

friendsRouter.post("/add_friend", async (req, res, next) => {
    try {
        let friendId = req.body || '';
        let isDone = await Friendship.requestFriendship(req.user[User.props.COL_ID], friendId);
        if(isDone) {
            res.json({isError: false, error_text: null});
        }
        else {
            throw new Error('Error making friend request');
        }
    }
    catch(err) {
        console.log(err);
        res.json({isError: true, error_text: 'Server error making friend request'});
    }
});

friendsRouter.post("/delete_friendship", async (req, res, next) => {
    try {
        let friendId = req.body || '';
        let isDone = await Friendship.deleteFriendship(req.user[User.props.COL_ID], friendId);
        if(isDone) {
            res.json({isError: false, error_text: null});
        }
        else {
            throw new Error('Error deleting friendship');
        }
    }
    catch(err) {
        console.log(err);
        res.json({isError: true, error_text: 'Server error deleting friendship'});
    }
});

friendsRouter.post("/accept_friendship", async (req, res, next) => {
    try {
        let friendId = req.body || '';
        let isDone = await Friendship.acceptFriendship(req.user[User.props.COL_ID], friendId);
        if(isDone) {
            res.json({isError: false, error_text: null});
        }
        else {
            throw new Error('Error accepting friendship');
        }
    }
    catch(err) {
        console.log(err);
        res.json({isError: true, error_text: 'Server error accepting friendship'});
    }
})

module.exports = friendsRouter;