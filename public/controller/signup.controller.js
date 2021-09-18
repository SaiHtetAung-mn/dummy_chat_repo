let email = document.getElementById("signup-email");
let name = document.getElementById("signup-name");
let password = document.getElementById("signup-password");
let c_password = document.getElementById("signup-c-password");
let submit_btn = document.getElementById("signup-submit");
let help_text = document.getElementById("signup-help-text");

submit_btn.addEventListener("click", async () => {
    const url = '/signup';
    const formBody = {
        email: email.value, 
        name: name.value, 
        password: password.value, 
        c_password: c_password.value
    };
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formBody)
    }

    try {
        help_text.style.color = "green";
        help_text.innerText = "Singing up ...";
        let response = await fetch(url, options);
        let resData = await response.json();
        if(resData.isError) {
            help_text.style.color = "red";
            help_text.innerText = resData.error_text;
        }
        else {
            // signup successfull
            location.href = `/auth/pending/${resData.userId}`;
            // history.pushState(null, '', '/auth/pending?id='+resData.userId);
            // location.reload();
        }
    }
    catch(err) {
        help_text.style.color = "red";
        help_text.innerText = 'Server error!';
    }
    
})