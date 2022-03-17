import socket from '../lib/socket.js';
import * as chat from '../lib/chat.lib.js';

const chat_list_search_box = document.getElementById("chat-list-search");
const conversation_back_btn = document.getElementById('conversation-back-btn');
const text_message_send_btn = document.getElementById("text-message-send-btn");
const media_message_btn = document.getElementById('media-message-btn');
const media_message_input = document.getElementById('media-message-input');

// for conversation to be responsive
window.addEventListener("resize", () => {
    chat.changeConversationView();
})

// send message to self
socket.on('send_message', (data) => {
    data.msgStatus = 'receive';
    chat.newMessageIn(data);
});

// incoming message from friend
socket.on('message', (data) => {
    data.msgStatus = 'receive';
    chat.newMessageIn(data);
});

// chat list search event
chat_list_search_box.addEventListener("change", () => {
    let friend_name = chat_list_search_box.value;
    if(friend_name === '') {
        chat.renderChatList();
        return;
    }
    chat.renderChatListSearch(friend_name);
})

// message send button click event
text_message_send_btn.addEventListener("click", () => {
    chat.sendTextMessage();
});

// photo message button click event
media_message_btn.addEventListener("click", () => {
    media_message_input.click();
});

// when select image and click select button
media_message_input.addEventListener("change", () => {
    let file = media_message_input.files[0];
    chat.sendMediaMessage(file);
})

// for mobile view
conversation_back_btn.addEventListener("click", () => {
    chat.toggleConversation();
});