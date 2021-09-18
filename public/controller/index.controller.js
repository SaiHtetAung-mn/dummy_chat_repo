import * as Modal from '../model/modal.model.js';
import * as model from '../model/index.model.js';

let logout_btn = document.getElementById("logout-btn");
let mobile_logout_btn = document.getElementById("mobile-logout");
let chat_list_menu_btn = document.getElementById("chat-list-menu-btn");
let chat_list_menu = document.getElementById("chat-list-menu");

logout_btn.addEventListener("click", () => {
    let modal_text = "Are you sure log out?"
    Modal.openModal(modal_text, model.logout);
})

mobile_logout_btn.addEventListener("click", () => {
    let modal_text = "Are you sure log out?"
    Modal.openModal(modal_text, model.logout);
})

chat_list_menu_btn.addEventListener("click", () => {
    if(chat_list_menu.style.display === "none" || chat_list_menu.style.display === '')  {
        chat_list_menu.style.display = "block";
    }
    else {
        chat_list_menu.style.display = "none";
    }
})

