import { mainChecker } from "./checks.js";
import {getGuessesPerSecond, getGuessesPerSecondLabel, formatDuration,estimateSeconds} from "./crackingCheck.js"
var firstBar = document.getElementById("bar-section-1");
var secondBar = document.getElementById("bar-section-2");
var thirdBar = document.getElementById("bar-section-3");

var strengthMessage = document.getElementById("strength-message");
var strengthText = document.getElementById("strength-text");
var passwordInput = document.getElementById("password");
const togglePasswordBtn = document.getElementById("toggle-password");

var crackTime = document.getElementById("crack-time");

if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener("click", function() {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
        } else {
            passwordInput.type = "password";
        }
    });
}


function resetBar() {
    firstBar.style.background = "#e0e6ed";
    secondBar.style.background = "#e0e6ed";
    thirdBar.style.background = "#e0e6ed";
    strengthText.innerText = "";
    strengthMessage.innerText = "";
    crackTime.innerText = "";
}

function displayErrors(errors, entropy, suggestions = []) {
    resetBar();
    strengthMessage.innerHTML = "";
    let feedback = "";
    const colorWeak = "#cb0c0cff";
    const colorModerate = "#efc701ff";
    const colorStrong = "#058f0eff";
    const colorError = "#cb0c0cff";
    const colorSuggestion = "#0074d9";

    const gps = getGuessesPerSecond();
    const crackSeconds = estimateSeconds(entropy, gps);
    const crackLabel  = getGuessesPerSecondLabel(gps);

    crackTime.innerText = `Estimated crack time (${crackLabel}): ${formatDuration(crackSeconds)}`;

    if (errors.length > 0) {
        // Show errors and mark as weak
        firstBar.style.background = colorWeak;
        strengthText.innerText = "Weak password!";
        strengthText.style.color = colorWeak;
        strengthMessage.innerHTML = errors.map(e => `<div style='color:${colorError}'>${e}</div>`).join("");
        if (suggestions.length > 0) {
            const sugHtml = `<div style='margin-top:0.5em;color:${colorSuggestion}'><b>Suggestions:</b><ul>` +
                suggestions.map(s => `<li>${s}</li>`).join("") + "</ul></div>";
            strengthMessage.innerHTML += sugHtml;
        }
    } else {
        // Classify by crackSeconds (no hardcoded 1e15)
        if (crackSeconds < 3600) { // < 1 hour
            firstBar.style.background = colorWeak;
            strengthText.innerText = "Weak password!";
            strengthText.style.color = colorWeak;
            feedback = "Try adding more character types and increasing length.";
        } else if (crackSeconds < 31536000) { // < 1 year
            firstBar.style.background = colorModerate;
            secondBar.style.background = colorModerate;
            strengthText.innerText = "Moderate password!";
            strengthText.style.color = colorModerate;
            feedback = "Add more symbols or increase length for a stronger password.";
        } else {
            firstBar.style.background = colorStrong;
            secondBar.style.background = colorStrong;
            thirdBar.style.background = colorStrong;
            strengthText.innerText = "Strong password!";
            strengthText.style.color = colorStrong;
            feedback = "Great job! Your password is strong.";
        }
        strengthMessage.innerHTML = `<div style='color:${colorSuggestion}'>${feedback}</div>`;
        if (suggestions.length > 0) {
            strengthMessage.innerHTML += `<div style='margin-top:0.5em;color:${colorSuggestion}'><b>Suggestions:</b><ul>` +
                suggestions.map(s => `<li>${s}</li>`).join("") + "</ul></div>";
        }
    }
}





passwordInput.addEventListener("input", async () => {
    const password = passwordInput.value;
    if (password.length === 0) {
        resetBar();
        return;
    }
    const result = await mainChecker(password);
    displayErrors(result.errors, result.entropy, result.suggestions);
});


