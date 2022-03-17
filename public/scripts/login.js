let email = document.getElementById("login-email");
let password = document.getElementById("login-password");
let rm_checked = document.getElementById("remember-me");
let help_text = document.getElementById("login-help-text");
let submit_btn = document.getElementById("login-submit");

import {createHash} from '../lib/crypto.js';

submit_btn.addEventListener("click", async () => {
    console.log(email.value);
    const url = "/login";
    const formBody = {
        email: email.value,
        password: createHash(password.value)
    }
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formBody)
    }

    try {
        let response = await fetch(url, options);
        let resData = await response.json();
        if(resData.isError) {
            help_text.innerText = resData.error_text;
        }
        else {
            // login success and redirect to index
            location.href = "/";
            location.reload();
        }
    }
    catch(err) {
        help_text.innerText = 'Server error!';
    }
})

