    let cancel_btn = document.getElementById("modal-cancel");
    let ok_btn = document.getElementById("modal-ok");
    let modal = document.getElementById("modal");
    // let modal_heading = document.getElementById("modal-heading");
    let modal_text = document.getElementById("modal-text");
    
    cancel_btn.addEventListener("click", () => {
        closeModal();
    });

    function openModal(modal_body_text, onAction) {
        // modal_heading.innerText = modal_heading;
        modal_text.innerText = modal_body_text;
        ok_btn.addEventListener("click", async () => {
            if(typeof(onAction) == "function") {
                onAction();
            }
            closeModal();
        })
        modal.style.display = "flex";
    }

    function closeModal() {
        modal.style.display = "none";
    }

    export {openModal, closeModal};