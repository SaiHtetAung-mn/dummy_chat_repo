import socket from '../model/socket.js';
import * as model from '../model/chat.model.js';

const chat_list_search_box = document.getElementById("chat-list-search");
const conversation_back_btn = document.getElementById('conversation-back-btn');
const text_message_send_btn = document.getElementById("text-message-send-btn");
const media_message_btn = document.getElementById('media-message-btn');
const media_message_input = document.getElementById('media-message-input');

// for conversation to be responsive
window.addEventListener("resize", () => {
    model.changeConversationView();
})

// send message to self
socket.on('send_message', (data) => {
    data.msgStatus = 'receive';
    model.newMessageIn(data);
});

// incoming message from friend
socket.on('message', (data) => {
    data.msgStatus = 'receive';
    model.newMessageIn(data);
});

// chat list search event
chat_list_search_box.addEventListener("change", () => {
    let friend_name = chat_list_search_box.value;
    if(friend_name === '') {
        model.renderChatList();
        return;
    }
    model.renderChatListSearch(friend_name);
})

// message send button click event
text_message_send_btn.addEventListener("click", () => {
    model.sendTextMessage();
});

// photo message button click event
media_message_btn.addEventListener("click", () => {
    media_message_input.click();
});

// when select image and click select button
media_message_input.addEventListener("change", () => {
    let file = media_message_input.files[0];
    model.sendMediaMessage(file);
})

// for mobile view
conversation_back_btn.addEventListener("click", () => {
    model.toggleConversation();
});