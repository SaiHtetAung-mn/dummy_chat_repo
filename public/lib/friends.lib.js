import socket from './socket.js';
import * as Crypto from '../model/crypto.js';
import * as Modal from './modal.model.js';
import * as Notification from './noti.lib.js';
const requestURL = '/api/friends';

export let friends_tabs = document.getElementsByClassName("friends-tab");
export let friends_tabs_contents = [
    document.getElementById("my-friends-tab-content"),
    document.getElementById("friends-request-tab-content"),
    document.getElementById("friends-search-tab-content")
];
let friendsCount = document.getElementById('friends-count'); // profile tab
let friendsTabCount = document.getElementById('friends-tab-count');
let requestsTabCount = document.getElementById('requests-tab-count');
let friendsRequestWrapper = document.getElementById("friends-request-wrapper");
let myFriendsWrapper = document.getElementById("my-friends-wrapper");
let CLASS_ACTIVE_TAB = "active-friends-tab";
let activeTab = friends_tabs[0];
let activeTabContent = friends_tabs_contents[0];

// socket events
socket.on('confirm-friendship', () => {
    loadMyFriends();
});

socket.on('add-friend', () => {
    loadFriendsRequest();
});

socket.on('unfriend', () => {
    loadMyFriends();
});

socket.on('cancel-friend-request', () => {
    loadFriendsRequest();
});

// initial
setTabClickEvent();
setActiveTab(activeTab);
setActiveTabContent(activeTabContent);
loadMyFriends();
loadFriendsRequest();

function setTabClickEvent() {
    for(let i=0; i<friends_tabs.length; i++) {
        friends_tabs[i].addEventListener("click", (event) => {
            setActiveTab(event.target);
            setActiveTabContent(friends_tabs_contents[i]);
        })
    }
    
}

export function setActiveTab(tab) {
    // remove current tab style and add to new tab
    if(activeTab.classList.contains(CLASS_ACTIVE_TAB)) {
        activeTab.classList.remove(CLASS_ACTIVE_TAB);
    }
    tab.classList.add(CLASS_ACTIVE_TAB);

    // set active tab
    activeTab = tab;
}

export function setActiveTabContent(tabContent) {
    activeTabContent.style.display = "none";
    tabContent.style.display = "initial";
    activeTabContent = tabContent;
}

export async function loadMyFriends() {
    let url = `${requestURL}/my_friends_list`;
    let options = {
        method: 'POST'
    };
    try {
        let res = await (await fetch(url, options)).json();
        if(res.isError) {
            throw new Error('Server error');
        }
        let friends = res.friends || [];
        if(friends.length === 0) {
            myFriendsWrapper.innerHTML = `<p class="no-result">No friends</p>`;
        }
        else {
            myFriendsWrapper.innerHTML = "";
            /* for rendering friends list append status as 1(already friend) and 
                isRequested  as null (no need)
            */
            friends.forEach(friend => {
                friend.status = true;
                friend.isRequested = null;
            });
            renderFriendsList(friends, myFriendsWrapper);
        }
        friendsCount.innerText = friends.length; // set num of friends on profile tab
        friendsTabCount.innerText = friends.length;
    }
    catch(err) {
        Notification.openNoti("Error loading friend list");
        console.log(err);
    } 
}

export async function loadFriendsRequest() {
    let url = `${requestURL}/friends_request_list`;
    let options = {
        method: "POST"
    };
    try {
        let res = await (await fetch(url, options)).json();
        if(res.isError) {
            throw new Error('Server error');
        }
        let friends = res.friends || [];
        if(friends.length === 0) {
            friendsRequestWrapper.innerHTML = `<p class="no-result">No friend requests</p>`;
        }
        else {
            friendsRequestWrapper.innerHTML = "";
            /* for rendering friends list append status as 0(pending) and 
                isRequested  as 1 (is requested)*/
            friends.forEach(friend => {
                friend.status = false;
                friend.isRequested = 1;
            });
            renderFriendsList(friends, friendsRequestWrapper);
        }
        requestsTabCount.innerText = friends.length;
    }
    catch(err) {
        console.log(err);
    }
}

export function renderFriendsList(friends, container) {
    container.innerHTML = "";
    friends.forEach(friend => {
        let element = 
            `<div class="friend">
                <div class="friend-avatar">
                    ${getFriendStatus(friend.status)}
                    <img src="${friend.profilePath}" class="friend-avatar-img"/>
                    <div>
                        <h4 class="friend-avatar-name">${friend.name}</h4>
                        <div class="friend-function-wrapper">
                            
                        </div>
                    </div>
                </div>
            </div>`;
        container.innerHTML += element;
    });
    friends.forEach((friend, index) => {
        container.getElementsByClassName('friend-function-wrapper')[index]
        .replaceWith(getFriendFunction(friend.status, friend.isRequested, friend.userId));
    })
}

// friend.status => 1=already friend, 0=pending(req, accept), null=no friend
// friend.isRequested => 0=self request, 1=is requested, null=nothing

export let getFriendFunction = (status, isRequested, id) => {
    let parent = document.createElement('div');
    parent.classList.add("friend-function-wrapper");
    // No friendship at all
    if (status === null) {
        let element = document.createElement("p");
        element.classList.add('friend-function', 'success-function');
        element.innerText = "Add friend";
        element.addEventListener("click", (event) => {
            addFriend(event.target, id);
        });
        parent.appendChild(element);
    }
    // already friend
    else if (status === true) {
        let element_1 = document.createElement("p");
        element_1.classList.add('friend-function', 'success-function');
        element_1.innerHTML = `<i class="la la-hand-paper"></i> Say Hi`;
        element_1.addEventListener("click", () => {
            sayHi(id);
        })

        let element_2 = document.createElement("p");
        element_2.classList.add('friend-function', 'danger-function');
        element_2.innerText = "Unfriend";
        element_2.addEventListener("click", (event) => {
            unfriend(id);
        });

        parent.appendChild(element_1);
        parent.appendChild(element_2);
    }
    // friend request pending
    else if (status === false) {
        // is requested or self request
        if(isRequested === 1) {
            let element_1 = document.createElement("p");
            element_1.classList.add('friend-function', 'success-function');
            element_1.innerText = "Confirm";
            element_1.addEventListener("click", () => {
                acceptFriendship(id);
            });

            let element_2 = document.createElement("p");
            element_2.classList.add('friend-function', 'danger-function');
            element_2.innerText = "Delete";
            element_2.addEventListener("click", () => {
                deleteFriendship(id, () => {
                    loadFriendsRequest();
                });
            })
            
            parent.appendChild(element_1);
            parent.appendChild(element_2);
        }
        else {
            let element = document.createElement('p');
            element.classList.add('friend-function', ('danger-function'));
            element.innerText = "Cancel request";
            element.addEventListener("click", (event) => {
                cancelRequest(event.target, id);
            })
            
            parent.appendChild(element);
        }
    }

    return parent;
}

export function getFriendStatus (status) {
    let element = '';
    if(status === true) {
        element += '<i class="la la-user-check friend-status"></i>';
    }
    else if(status === null) {
        element += '<i class="la la-user-plus friend-status add-friend-status"></i>';
    } 
    return element;
}

export function changeFriendFunction(element, status, isRequested, id) {
    let parentNode = element.parentElement;
    parentNode.replaceWith(getFriendFunction(status, isRequested, id));
}

export function unfriend(id) {
    let modal_text = `Are you sure unfriend`;
    Modal.openModal(modal_text, () => {
        deleteFriendship(id, () => {
            loadMyFriends();
            socket.emit('unfriend', id);
        })
    });
}

export function cancelRequest(element, id) {
    let modal_text = `Are you sure cancel friend request`;
    Modal.openModal(modal_text, async () => {
        //status as null (no friend or pending), isRequested as null (no request)
        deleteFriendship(id, () => {
            changeFriendFunction(element, null, null, id);
            socket.emit('cancel-friend-request', id);
        });
    });
}

export async function addFriend(element, id) {
    let url = `${requestURL}/add_friend`;
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: String(id)
    };

    try {
        let res = await (await fetch(url, options)).json();
        if(res.isError) {
            throw new Error(res.error_text || 'Server error making friend request');
        }
        else {
            // pass status as 0 (pending) and isRequested as 0(self request)
            changeFriendFunction(element, 0, 0, id);
            socket.emit('add-friend', id);
        }
    }
    catch(err) {
        Notification.openNoti("Fail to send friend request");
        console.log(err);
    }
}

export async function deleteFriendship(id, cb) {
    let url = `${requestURL}/delete_friendship`;
    let options = {
        method: "POST",
        headers: {
            'Content-Type': 'text/plain'
        },
        body: String(id)
    }

    try {
        let res = await (await fetch(url, options)).json();
        if(res.isError) {
            throw new Error(res.error_text);
        }
        else {
            cb();
        }
    }
    catch(err) {
        console.log(err);
    }

}

export async function acceptFriendship(id) {
    let url = `${requestURL}/accept_friendship`;
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: String(id || '')
    }

    try {
        let res = await (await fetch(url, options)).json();
        if(res.isError) {
            throw new Error(res.error_text);
        }
        else {
            loadFriendsRequest();
            loadMyFriends();
            socket.emit('confirm-friendship', id);
        }
    }
    catch(err) {
        Notification.openNoti('Fail to accept friend');
        console.log(err);
    }
}

async function sayHi(to) {
    let url = `api/chat/send_message`;
    let message = {
        type: 'text',
        content: Crypto.encryptMessage('Hi'),
        timestamp: moment().unix()*1000
    }
    let data = {
        to: to,
        message: message
    }
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    try {
        let res = await (await fetch(url, options)).json();
        if(res.isError) {
            throw new Error("Server error! Message was not sent");
        }
    }
    catch(err) {
        Notification.openNoti('Fail to send message');
        console.log(err);
    }
} 

