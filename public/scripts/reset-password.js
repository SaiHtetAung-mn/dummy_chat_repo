let reqURL = '/auth';
let email = document.getElementById("r-password-email");
let email_send_btn = document.getElementById("r-password-email-send");
let v_code = document.getElementById("r-password-v-code"); // verification code
let new_password = document.getElementById("r-password-new-password");
let c_new_password = document.getElementById("r-password-c-new-password");
let help_text = document.getElementById("r-password-help-text");
let submit = document.getElementById("r-password-submit");

let userId = null; // set from fetch response when verification code is sent to email

email_send_btn.addEventListener("click", async () => {
    let url = `${reqURL}/r_password_send_email`;
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: email.value})
    };

    try {
        let res = await (await fetch(url, options)).json();
        if(res.isError) {
            help_text.innerText = res.error_text;
            return;
        }
        else {
            userId = res.userId ?? null;
            email_send_btn.innerText = "Resent code";
        }
    }
    catch(err) {
        help_text.innerText = 'Server error';
    }
    
});

submit.addEventListener("click", async () => {
    let data = {
        userId: userId,
        v_code: v_code.value,
        new_password: new_password.value,
        c_new_password: c_new_password.value
    };
    let url = `${reqURL}/reset_password`;
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    try {
        let resData = await (await fetch(url, options)).json();
        if(resData.isError) {
            help_text.innerText = resData.error_text;
            return;
        }
        else {
            help_text.style.color = "green";
            help_text.innerHTML = 'Password reset successfully. <a href="/login">Login</a>';
        }
    }
    catch(err) {
        help_text.innerText = 'Server error';
    }
    
})