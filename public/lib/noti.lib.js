let noti = document.getElementById("notification");
let noti_text = document.getElementById("notification-text");

export function openNoti (text) {
    noti_text.innerText = text;
    noti.style['animation-name'] = "slide-in";
    noti.style.display = "block";
    setTimeout(() => closeNoti(), 5000);
}

export function closeNoti () {
    noti.style['animation-name'] = "slide-out";
    noti.style.display = "none";
}