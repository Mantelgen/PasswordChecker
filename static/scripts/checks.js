//Password main checker
const DEFAULT_POLICIES={
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialCharacters: true
}

//function to do a basic password check
function basicChecker(password, policies=DEFAULT_POLICIES){
    var errors =[]
    const pass_lenght= password.length;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialCharacters = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if(pass_lenght<policies.minLength){
        errors.push(`Password must be at least ${policies.minLength} characters long.`);
    }
    if(pass_lenght>policies.maxLength){
        errors.push(`Password must be no more than ${policies.maxLength} characters long.`);
    }
    if(policies.requireUppercase && !hasUppercase){
        errors.push("Password must contain at least one uppercase letter.");
    }
    if(policies.requireLowercase && !hasLowercase){
        errors.push("Password must contain at least one lowercase letter.");
    }
    if(policies.requireNumbers && !hasNumbers){
        errors.push("Password must contain at least one number.");
    }
    if(policies.requireSpecialCharacters && !hasSpecialCharacters){
        errors.push("Password must contain at least one special character.");
    }
    return errors;
}


//function for loading the most common passwords
//this should get the most common passwords from the backend and load them here, and return all the entries as a list
async function loadCommonPasswords() {
    const response = await fetch('/common-passwords.txt');
    const text = await response.text();
    return text.split(/\r?\n/).map(p => p.trim()).filter(p => p.length > 0);
}

//function to check if password is in breach database
async function checkPasswordInBreachDatabase(password){
    const commonPasswords = await loadCommonPasswords();
    if (commonPasswords.includes(password)) {
        return ["Password has been compromised in a data breach."];
    }
    return [];
}

//function to main check the password
export async function mainChecker(password){
    const basicErrors = basicChecker(password);
    const breachErrors = await checkPasswordInBreachDatabase(password);
    const allErrors = [...basicErrors, ...breachErrors];
    return allErrors;
}