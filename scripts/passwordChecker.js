let commonPasswords = new Set();

const passwordInput = document.getElementById("password");

function verifyPassword(password){
    const checks=[]
    if(password.length < 8){
        checks.push("Password must be at least 8 characters long.");
    }
    if(!/[A-Z]/.test(password)){
        checks.push("Password must contain at least one uppercase letter.");
    }
    if(!/[a-z]/.test(password)){
        checks.push("Password must contain at least one lowercase letter.");
    }
    if(!/\d/.test(password)){
        checks.push("Password must contain at least one number.");
    }
    if(!/[@$!%*?&]/.test(password)){
        checks.push("Password must contain at least one special character.");
    }
    return checks;
}

function clearPasswordStrengthIndicators() {
    document.getElementById("bar-section-3").style.background = "#e0e6ed";
    document.getElementById("bar-section-2").style.background = "#e0e6ed";
    document.getElementById("bar-section-1").style.background = "#e0e6ed";
}

passwordInput.addEventListener("input", function() {
    const current_password = passwordInput.value;
    const strengthMessage = document.getElementById("strength-message");
    const checks = verifyPassword(current_password);
    const password_power = checks.length;
    const strength_text = document.getElementById("strength-text");
    const submitBtn = document.getElementById("submit-btn");

    if (checks.length === 0 && current_password.length > 0) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }

    if(current_password.length === 0){
        clearPasswordStrengthIndicators();
        strength_text.textContent = "";
        strength_text.style.color = "";
    }else if(password_power>=4){
        clearPasswordStrengthIndicators()
        document.getElementById("bar-section-3").style.background = "#eb7474ff";
        strength_text.textContent = "Weak password";
        strength_text.style.color = "#eb7474ff";
    }else if(password_power>=2){
        clearPasswordStrengthIndicators()
        document.getElementById("bar-section-3").style.background = "#f7ca00ff";
        document.getElementById("bar-section-2").style.background = "#f7ca00ff";
        strength_text.textContent = "Moderate password";
        strength_text.style.color = "#f7ca00ff";
    }else {
        clearPasswordStrengthIndicators()
        document.getElementById("bar-section-3").style.background = "#00932cff";
        document.getElementById("bar-section-2").style.background = "#00932cff";
        document.getElementById("bar-section-1").style.background = "#00932cff";
        strength_text.textContent = "Strong password";
        strength_text.style.color = "#00932cff";
    }

    if (current_password.length === 0) {
        strengthMessage.textContent = "";
    } else if (checks.length === 0) {
        strengthMessage.textContent = "Password is strong!";
        strengthMessage.style.color = "green";
    } else {
        strengthMessage.innerHTML = checks.map(msg => `<div>${msg}</div>`).join("");
        strengthMessage.style.color = "red";
    }

});