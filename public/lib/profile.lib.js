let personal_status = document.getElementById("profile-personal-status");
let password_status = document.getElementById("profile-password-status");
let personal_loading = document.getElementById("personal-loading");
let password_loading = document.getElementById("password-loading");
let personal_help_text = document.getElementById("profile-personal-help-text");
let password_help_text = document.getElementById("profile-password-help-text");

export function showPersonalLoading () {
    personal_loading.style.display = "block";
    personal_help_text.style.color = "var(--status-success-color)";
    personal_help_text.innerText = "Updating personal information...";
    personal_status.style.visibility = "visible";

    setTimeout(hidePersonalStatus, 2000);
}

export function showPasswordLoading () {
    password_loading.style.display = "block";
    password_help_text.style.color = "var(--status-success-color)";
    password_help_text.innerText = "Reseting password...";
    password_status.style.visibility = "visible";

    setTimeout(hidePasswordStatus, 2000);
}

export function showPersonalStatusText (text) {
    personal_loading.style.display = "none";
    personal_help_text.style.color = "var(--error-color)";
    personal_help_text.innerText = text;
    personal_status.style.visibility = "visible";
}

export function showPasswordStatusText (text) {
    password_loading.style.display = "none";
    password_help_text.style.color = "var(--error-color)";
    password_help_text.innerText = text;
    password_status.style.visibility = "visible";
}

export function showSuccessPasswordStatusText (text) {
    password_loading.style.display = "none";
    password_help_text.style.color = "var(--status-success-color)";
    password_help_text.innerText = text;
    password_status.style.visibility = "visible";

    setTimeout(hidePasswordStatus, 3000);
}

export function hidePersonalStatus () {
    personal_status.style.visibility = "hidden";
}

export function hidePasswordStatus () {
    password_status.style.visibility = "hidden";
}