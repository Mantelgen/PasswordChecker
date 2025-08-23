export function getGuessesPerSecond() {
    const select = document.getElementById("attacker-profile");
    if (select && select.value) {
        switch (select.value) {
            case "online":     return 1e2;   // rate-limited online
            case "slow-kdf":   return 1e5;   // bcrypt/scrypt/Argon2 (typical costs)
            case "fast-hash":  return 1e10;  // MD5/SHA1/NTLM on good GPU
            case "aggressive": return 1e12;  // multi-GPU small cluster
            case "worst":      return 1e15;  // extreme/worst-case
        }
    }
    if (typeof window !== "undefined" && window.GUESSES_PER_SECOND) {
        const v = Number(window.GUESSES_PER_SECOND);
        if (!Number.isNaN(v) && v > 0) return v;
    }
    return 1e10;
}

export function getGuessesPerSecondLabel(gps) {
    const select = document.getElementById("attacker-profile");
    if (select && select.options && select.selectedIndex >= 0) {
        return select.options[select.selectedIndex].text;
    }
    
    return `~${gps.toExponential()} guesses/sec`;
}

export function estimateSeconds(entropy, guessesPerSecond) {
    return 0.5 * Math.pow(2, Number(entropy)) / guessesPerSecond;
}

export function formatDuration(seconds) {
    if (seconds < 60) return `${seconds.toFixed(2)} seconds`;
    if (seconds < 3600) return `${(seconds/60).toFixed(2)} minutes`;
    if (seconds < 86400) return `${(seconds/3600).toFixed(2)} hours`;
    if (seconds < 31536000) return `${(seconds/86400).toFixed(2)} days`;
    if (seconds < 3153600000) return `${(seconds/31536000).toFixed(2)} years`;
    return `${(seconds/3153600000).toFixed(2)} centuries`;
}

export function estimateCrackTime(entropy, guessesPerSecond) {
    return formatDuration(estimateSeconds(entropy, guessesPerSecond));
}