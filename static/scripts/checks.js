//Password main checker
const DEFAULT_POLICIES={
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialCharacters: true
}
let COMMON_PASSWORDS_CACHE = null;


function calculateEntropy(password) {
    let poolSize = 0;
    if (/[a-z]/.test(password)) poolSize += 26;
    if (/[A-Z]/.test(password)) poolSize += 26;
    if (/[0-9]/.test(password)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32; // Approximate for symbols
    if (poolSize === 0) return 0;
    return Number((password.length * Math.log2(poolSize)).toFixed(2));
}

function basicChecker(password, policies=DEFAULT_POLICIES){
    let errors = [];
    let suggestions = [];
    const pass_length = password.length;
    const hasSpaces = /\s/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialCharacters = /[^a-zA-Z0-9]/.test(password);

    if(hasSpaces){
        errors.push("Your password should not contain spaces.");
    }
    if(pass_length < policies.minLength){
        errors.push(`Your password should be at least ${policies.minLength} characters long.`);
    } else if (pass_length < 12) {
        suggestions.push("Consider using at least 12 characters for better security.");
    }
    if(pass_length > policies.maxLength){
        errors.push(`Your password must have no more than ${policies.maxLength} characters.`);
    }
    if(policies.requireUppercase && !hasUppercase){
        errors.push("Your password should contain at least one uppercase letter.");
    } else if (!hasUppercase) {
        suggestions.push("Add uppercase letters for extra strength.");
    }
    if(policies.requireLowercase && !hasLowercase){
        errors.push("Your password should contain at least one lowercase letter.");
    } else if (!hasLowercase) {
        suggestions.push("Add lowercase letters for extra strength.");
    }
    if(policies.requireNumbers && !hasNumbers){
        errors.push("Your password should contain at least one number.");
    } else if (!hasNumbers) {
        suggestions.push("Add numbers for extra strength.");
    }
    if(policies.requireSpecialCharacters && !hasSpecialCharacters){
        errors.push("Your password should contain at least one special character.");
    } else if (!hasSpecialCharacters) {
        suggestions.push("Add special characters for extra strength.");
    }
    return { errors, suggestions };
}

async function loadCommonPasswords() {
    if (COMMON_PASSWORDS_CACHE) return COMMON_PASSWORDS_CACHE;
    try {
        const response = await fetch('/common-passwords.txt', { cache: 'force-cache' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const text = await response.text();
        COMMON_PASSWORDS_CACHE = text
            .split(/\r?\n/)
            .map(p => p.trim())
            .filter(p => p.length > 0);
        return COMMON_PASSWORDS_CACHE;
    } catch (e) {
        console.warn('Could not load common-passwords list:', e);
        COMMON_PASSWORDS_CACHE = [];
        return COMMON_PASSWORDS_CACHE;
    }
}

//function to check if password is in breach database
async function checkPasswordInBreachDatabase(password){
    const commonPasswords = await loadCommonPasswords();
    if (commonPasswords.includes(password)) {
        return { errors: ["Password has been compromised in a data breach."], suggestions: [] };
    }
    return { errors: [], suggestions: [] };
}

// Policy: Password should not contain breakable sequences (e.g., repeated characters like '1111', 'aaaa', etc.)
export function hasBreakableSequence(password, minLength = 3) {
    // Checks for any character repeated minLength or more times in a row
    const regex = new RegExp(`(.)\\1{${minLength - 1},}`);
    return regex.test(password);
}

//function to main check the password
export async function mainChecker(password) {
    const { errors: basicErrors, suggestions: basicSuggestions } = basicChecker(password);
    const { errors: breachErrors, suggestions: breachSuggestions } = await checkPasswordInBreachDatabase(password);
    const entropy = calculateEntropy(password);
    let errors = [...basicErrors, ...breachErrors];
    let suggestions = [...basicSuggestions, ...breachSuggestions];

    // Error: breakable sequence
    if (hasBreakableSequence(password, 3)) {
        errors.push("Password contains breakable sequence (e.g., repeated characters like '1111', 'aaaa').");
    }

    // Suggestions (only if no errors)
    if (errors.length === 0) {
        if (entropy < 40) {
            suggestions.push("Increase password length and add more character types for better security.");
        } else if (entropy < 60) {
            suggestions.push("Add more symbols or increase length for a stronger password.");
        }
    }

    return { errors, suggestions, entropy };
}