let popup_image_container = document.getElementById("image-popup-container");
let popup_image = document.getElementById('image-popup-img');
let popup_image_close = document.getElementById("popup-image-close");

popup_image_close.addEventListener("click", () => {
    closeImageView();
})

export function viewImage(image_path) {
    console.log(image_path);
    popup_image.src = `${image_path}`;
    popup_image_container.style.display = "block";
}

export function closeImageView() {
    popup_image_container.style.display = "none";
}