// functions
import * as profileModel from '../model/profile.model.js';
import * as Crypto from '../model/crypto.js';

const requestURL = '/userOpr/profile';

// navbar avatar img to change if profile info change
let nav_avatar_img = document.getElementById("nav-avatar-img");

// profile avatar variables
let profile_avatar_img = document.getElementById("profile-avatar-img");
let profile_avatar_name = document.getElementById("profile-avatar-name");
let profile_avatar_email = document.getElementById("profile-avatar-email");

// profile personal information variables
let profile_name = document.getElementById("profile-name");
let profile_email = document.getElementById("profile-email");
let profile_img = document.getElementById("profile-img");
let profile_personal_save_btn = document.getElementById("profile-personal-save-btn");

// profile security change password variables
let profile_old_password = document.getElementById("profile-old-password");
let profile_new_password = document.getElementById("profile-new-password");
let profile_password_change_btn = document.getElementById("profile-password-change-btn");

// controllers
profile_personal_save_btn.addEventListener("click", async () => {
    let name = profile_name.value;
    let email = profile_email.value;
    let profile_pic = profile_img.files[0];

    // if user change no value and click save button
    if(name === window.user.name && email === window.user.email && profile_pic === undefined) {
        return;
    }

    // show loading status
    profileModel.showPersonalLoading();

    let url = `${requestURL}/change_personal_info`;
    let data = new FormData();
    if(name !== window.user.name) {
        data.append("name", name);
    }

    if(email !== window.user.email) {
        data.append("email", email);
    }

    if(profile_pic !== undefined) {
        data.append("profile_pic", profile_pic);
    }

    let options = {
        method: "POST", 
        body: data
    }

    try {
        let res = await (await fetch(url, options)).json();
        if(res.isError) {
            profileModel.showPersonalStatusText(res.error_text);
        }
        else {
            // upload success
            let newData = res.newData ?? {};
            console.log(newData);
            if("name" in newData) {
                profile_avatar_name.innerText = newData.name;
                profile_name.innerText = newData.name;
                window.user.name = newData.name;
            }
            if("email" in newData) {
                profile_avatar_email.innerText = newData.email;  
                profile_email.innerText = newData.email;
                window.user.email = newData.email;
            }
            if("profilePath" in newData) {
                profile_avatar_img.src = newData.profilePath;
                nav_avatar_img.src = newData.profilePath;
                window.user.profilePath = newData.profilePath;
            }

            // hide status text
            profileModel.hidePersonalStatus;
        }
    }
    catch(err) {
        console.log(err);
        profileModel.showPersonalStatusText("Server error updating personal information");
    }
    
});

profile_password_change_btn.addEventListener("click", async () => {
    // show loading status
    profileModel.showPasswordStatusText("Reseting new password");
    let old_password = Crypto.createHash(profile_old_password.value);
    let new_password = profile_new_password.value;

    let url = `${requestURL}/change_password`;
    let data = {
        'oldPassword': old_password,
        'newPassword': new_password
    }
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    try {
        let res = await (await fetch(url, options)).json();
        if(res.isError) {
            profileModel.showPasswordStatusText(res.error_text);
        }
        else {
            // success
            profileModel.showSuccessPasswordStatusText('Reseted password successfully');
        }
    }
    catch(err) {
        console.log(err);
        profileModel.showPasswordStatusText('Server error reseting password');
    }
})
