import * as Notification from './noti.model.js';
import * as PopupImage from './popup-image.lib.js';
import * as Crypto from './crypto.js';
const reqURL = '/api/chat';
const chat_list_container = document.getElementById('chat-list-container');
let conversation_container = document.getElementById('conversation-container');
let conversation_wrapper = document.getElementById("conversation-wrapper");
let conversation_body = document.getElementById("conversation-body");
let conv_avatar_img = document.getElementById("conv-avatar-img");
let conv_avatar_name = document.getElementById("conv-avatar-name");
let conv_avatar_status = document.getElementById("conv-avatar-status");
let chat_list = [];
let active_chat_friend = null;

let text_message = document.getElementById("text-message-input");

// init
loadChat();

export async function loadChat() {
    let url = `${reqURL}/chatlists`;
    let options = {
        method: 'POST'
    };

    try {
        let res = await (await fetch(url, options)).json();
        if(res.isError) {
            throw new Error(res.error_text || 'Server error loading chat list');
        }
        else {
            chat_list = res.chatList ?? [];
            if(chat_list.length > 0) {
                active_chat_friend = chat_list[0].userId;
            }
            renderChatList();
            loadConversation();
        }
    }
    catch(err) {
        console.log(err);
        Notification.openNoti("Error loading chats!");
    }
}

export async function loadConversation() {
    if(chat_list.length < 1) {
        document.getElementsByClassName('no-conversation')[0].style.display = "block";
        conversation_wrapper.style.display = "none";
        return;
    }
    document.getElementsByClassName('no-conversation')[0].style.display = "none";
    conversation_wrapper.style.display = "flex";
    let friendInfo = chat_list.find(item => {
        return item.userId === active_chat_friend;
    });
    if(friendInfo !== undefined) {
        conv_avatar_img.src = friendInfo.profilePath;
        conv_avatar_name.innerText = friendInfo.name;
        conv_avatar_status.innerText = "Online";
        text_message.value = "";
        try {
            let messages = await fetchMessages(friendInfo.userId);
            renderMessages(messages, friendInfo);
        }
        catch(err) {
            Notification.openNoti("Error loading messages");
            console.log(err);
        }
    }
}

async function fetchMessages(friendId) {
    let url = `${reqURL}/messages`;
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: String(friendId)
    };
    let res = await (await fetch(url, options)).json();
    if(res.isError) {
        throw new Error(res.error_text);
    }
    return res.messages;
}

function renderMessages(messages, friendInfo) { // load all messages to conversation
    let lastDate = null;
    conversation_body.innerHTML = "";
    messages.forEach(message => {
        let date = moment(Number(message.timestamp));
        // comparing date and render if not equal to lastDate
        if(date.format("l") != lastDate) {
            conversation_body.innerHTML += `
                <p class="conversation-date">${date.format("LL")}</p>`;
            lastDate = date.format("l");
        }
        let messageWrapper = document.createElement("div");
        messageWrapper.classList.add('message-wrapper');
        let messageContainer = document.createElement("div");
        messageContainer.classList.add('message-container');
        if(message.sender === friendInfo.userId) {
            messageWrapper.classList.add('rec-message-wrapper');
            messageWrapper.innerHTML = `
                <img 
                    src="${friendInfo.profilePath}" 
                    class="message-avatar"
                />`;
            if(message.type === "text") {
                let textMsg = document.createElement('p');
                textMsg.classList.add('message', 'rec-message');
                textMsg.innerText = Crypto.decryptMessage(message.message);
                messageContainer.appendChild(textMsg);
            }
            else {
                var image = renderImageMessage(message.message, ['send-message', 'img-message']);
                messageContainer.prepend(image);
            }
        }
        else {
            messageWrapper.classList.add('send-message-wrapper');
            if(message.type === "text") {
                let textMsg = document.createElement('p');
                textMsg.classList.add('message', 'send-message');
                textMsg.innerText = Crypto.decryptMessage(message.message);
                messageContainer.appendChild(textMsg);
            }
            else {
                var image = renderImageMessage(message.message, ['send-message', 'img-message']);
                messageContainer.prepend(image);
            }
        }
        messageContainer.innerHTML += `<span class="message-time">
                ${date.format("LT")}
            </span>`;
        messageWrapper.appendChild(messageContainer);
        conversation_body.appendChild(messageWrapper);
    });
    let img_messages = conversation_body.getElementsByClassName('img-message');
    for(let i=0; i<img_messages.length; i++) {
        img_messages[i].addEventListener("click", (event) => {
            PopupImage.viewImage(event.target.getAttribute('src'));
        })
    }
    conversation_body.scrollTo(0, conversation_body.scrollHeight);
}

function renderSingleChatList(item) {
    let message = item.type === "text" ? Crypto.decryptMessage(item.message) : "Photo message";
    let chatListItem = document.createElement('div');
    chatListItem.classList.add('chat-list-item');
    if(active_chat_friend === item.userId) {
        chatListItem.classList.add('active-chat-item');
    }
    chatListItem.innerHTML = `
        <div class="chat-list-avatar">
            <img src="${item.profilePath}" class="chat-list-avatar-img"/>
            <div class="chat-list-avatar-content">
                <p class="chat-list-avatar-name">${item.name}</p>
                <p class="chat-list-avatar-text"></p>
            </div>
        </div>
        <span class="chat-list-time">
            ${moment(Number(item.timestamp)).calendar()}
        </span>`;
    chatListItem.getElementsByClassName('chat-list-avatar-text')[0]
        .innerText = message;
    chatListItem.addEventListener("click", () => {
        // remove active chat list style from current chat list item if exists
        let activeList = document.getElementsByClassName('active-chat-item');
        if(activeList.length > 0) {
            activeList[0].classList.remove('active-chat-item');
        }
        // set active style to clicked chat list item
        chatListItem.classList.add('active-chat-item');
        changeConversation(item.userId);
        // for mobile popup conversation
        toggleConversation();
    })
    chat_list_container.appendChild(chatListItem);
}

export function renderChatList() {
    chat_list_container.innerHTML = "";
    if(chat_list.length < 1) {
        chat_list_container.innerHTML = `<p class="no-chat-list"> No chats</p>`;
        return;
    }
    chat_list.forEach(item => {
        renderSingleChatList(item);
    })
}

export function renderChatListSearch(friend_name) {
    chat_list_container.innerHTML = "";
    chat_list_container.innerHTML += `
        <p class="chat-list-search-text">Search result:</p>`;
    chat_list.forEach(item => {
        if(String(item.name).toLowerCase().includes(String(friend_name).toLowerCase())) {
            renderSingleChatList(item);
        }
    })
}

function renderSingleMessage(msgInfo) {
    let friendInfo = msgInfo.from ?? msgInfo.to;
    let message = msgInfo.message;
    // append new message to conversation only to active conversation
    if(friendInfo.userId !== active_chat_friend) {
        return;
    }
    let messageWrapper = document.createElement("div");
    messageWrapper.classList.add('message-wrapper');
    let messageContainer = document.createElement("div");
    messageContainer.classList.add('message-container');
    if(msgInfo.from) {
        messageWrapper.classList.add('rec-message-wrapper');
        messageWrapper.innerHTML = `
            <img 
                src="${friendInfo.profilePath}" 
                class="message-avatar"
            />`;
        if(message.type === "text") {
            let textMsg = document.createElement('p');
            textMsg.classList.add('message', 'rec-message');
            textMsg.innerText = Crypto.decryptMessage(message.content);
            messageContainer.appendChild(textMsg);
        }
        else {
            let image = renderImageMessage(message.content, ['rec-message', 'img-message']);
            messageContainer.appendChild(image);
        }
    }
    else {
        messageWrapper.classList.add('send-message-wrapper');
        if(message.type === "text") {
            let textMsg = document.createElement('p');
            textMsg.classList.add('message', 'send-message');
            textMsg.innerText = Crypto.decryptMessage(message.content);
            messageContainer.appendChild(textMsg);
        }
        else {
            let image = renderImageMessage(message.content, ['send-message', 'img-message']);
            messageContainer.appendChild(image);
        }
    }
    messageContainer.innerHTML += `<span class="message-time">
            ${moment(Number(message.timestamp)).calendar()}
        </span>`;
    if(message.type === "image") {
        messageContainer.getElementsByClassName('img-message')[0]
        .addEventListener('click', (event) => {
            PopupImage.viewImage(event.target.getAttribute("src"));
        });
    }
    messageWrapper.appendChild(messageContainer);
    conversation_body.appendChild(messageWrapper);
    conversation_body.scrollTo(0, conversation_body.scrollHeight);
    
}

export function newMessageIn(msgInfo) {
    let user = msgInfo.from ?? msgInfo.to;
    let newMsgItem = {
        msgId: msgInfo.message.msgId,
        msgStatus: msgInfo.msgStatus,
        type: msgInfo.message.type,
        message: msgInfo.message.content,
        timestamp: msgInfo.message.timestamp,
        userId: user.userId,
        name: user.name,
        profilePath: user.profilePath
    }
    let isInList = chat_list.find(item => {
        return user.userId === item.userId;
    });
    if(isInList !== undefined) {
        chat_list = chat_list.filter(item => {
            return item.userId !== user.userId;
        });
    }
    chat_list.unshift(newMsgItem);
    renderChatList();
    renderSingleMessage(msgInfo);
}

// render a new image message in conversation 
function renderImageMessage (src_path, classArray=[]) {
    let image = document.createElement("img");
    image.src = src_path;
    image.classList.add(...classArray);
    return image;
}

export async function sendTextMessage() {
    if(String(text_message.value).trim() === '') {
        return;
    }
    let message = Crypto.encryptMessage(text_message.value);
    let url = `${reqURL}/send_message`;
    let data = {
        to: active_chat_friend,
        message: {
            type: 'text',
            content: message,
            timestamp: moment().unix()*1000
        }
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
            throw new Error(res.error_text);
        }
        else {
            text_message.value = "";
        }
    }
    catch(err) {
        Notification.openNoti("Fail to send message");
        console.log(err);
    } 
}

export async function sendMediaMessage(file) {
    if(String(file.type).match('image.*') || String(file.type).match('video.*')) {
        try {
            if(!active_chat_friend) {
                throw new Error('Unknown friend to send');
            }
            let url = `${reqURL}/send_media_message`;
            let data = new FormData();
            data.append('to', active_chat_friend);
            data.append('media', file);
            data.append('timestamp', String(moment().unix()*1000));
            let options = {
                method: 'POST',
                body: data
            }
            let res = await (await fetch(url, options)).json();
            if(res.isError) {
                throw new Error(res.error_text);
            }
            else {
            }
        }
        catch(err) {
            Notification.openNoti(err.message);
        }
    }
    else {
        Notification.openNoti('Not an image file');
    }
}

function changeConversation(friendId) {
    // no change on clicking on already active conversation
    if(active_chat_friend !== friendId) {
        active_chat_friend = friendId; // !important set before loadConversation()
        loadConversation();
    }
}

// for only mobile
export function toggleConversation() {
    if(window.screen.width < 600) {
        let displayValue = conversation_container.style.display;
        if(displayValue === "none" || displayValue =="") {
            conversation_container.style.display = "block";
        }
        else {
            conversation_container.style.display = "none";
        }
    }
}

export function changeConversationView() {
    if(window.screen.width > 600) { 
        // set display value to block anyway
        conversation_container.style.display = "block";
    }
    else {
        // set display value to original value
        let displayValue = conversation_container.style.display;
        if(displayValue === "none" || displayValue === "") {
            conversation_container.style.display = "none";
        }
        else {
            conversation_container.style.display = "block";
        }
    }
}