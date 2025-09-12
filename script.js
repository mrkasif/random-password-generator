// Character sets for password generation
const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

// DOM elements
const lengthSlider = document.getElementById('length');
const lengthValue = document.getElementById('lengthValue');
const uppercaseCheck = document.getElementById('uppercase');
const lowercaseCheck = document.getElementById('lowercase');
const numbersCheck = document.getElementById('numbers');
const symbolsCheck = document.getElementById('symbols');
const passwordInput = document.getElementById('password');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');
const notification = document.getElementById('notification');

// Update length value display
lengthSlider.addEventListener('input', function() {
    lengthValue.textContent = this.value;
    if (passwordInput.value) {
        generatePassword();
    }
});

// Generate password on checkbox change
[uppercaseCheck, lowercaseCheck, numbersCheck, symbolsCheck].forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        if (passwordInput.value) {
            generatePassword();
        }
    });
});

// Main password generation function
function generatePassword() {
    const length = parseInt(lengthSlider.value);
    let charset = '';
    let password = '';
    
    // Build character set based on selected options
    if (uppercaseCheck.checked) charset += charSets.uppercase;
    if (lowercaseCheck.checked) charset += charSets.lowercase;
    if (numbersCheck.checked) charset += charSets.numbers;
    if (symbolsCheck.checked) charset += charSets.symbols;
    
    // Check if at least one option is selected
    if (charset === '') {
        alert('Please select at least one character type!');
        return;
    }
    
    // Generate password ensuring at least one character from each selected type
    const selectedTypes = [];
    if (uppercaseCheck.checked) selectedTypes.push(charSets.uppercase);
    if (lowercaseCheck.checked) selectedTypes.push(charSets.lowercase);
    if (numbersCheck.checked) selectedTypes.push(charSets.numbers);
    if (symbolsCheck.checked) selectedTypes.push(charSets.symbols);
    
    // Add one character from each selected type
    selectedTypes.forEach(type => {
        password += type.charAt(Math.floor(Math.random() * type.length));
    });
    
    // Fill remaining length with random characters
    for (let i = password.length; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    // Shuffle the password
    password = shuffleString(password);
    
    // Display password and update strength
    passwordInput.value = password;
    updateStrengthIndicator(password);
}

// Shuffle string function
function shuffleString(str) {
    return str.split('').sort(() => Math.random() - 0.5).join('');
}

// Copy password to clipboard
function copyPassword() {
    if (!passwordInput.value) {
        alert('Generate a password first!');
        return;
    }
    
    passwordInput.select();
    passwordInput.setSelectionRange(0, 99999); // For mobile devices
    
    navigator.clipboard.writeText(passwordInput.value).then(() => {
        showNotification();
    }).catch(() => {
        // Fallback for older browsers
        document.execCommand('copy');
        showNotification();
    });
}

// Show notification
function showNotification() {
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// Reset all settings to default
function resetSettings() {
    lengthSlider.value = 12;
    lengthValue.textContent = '12';
    uppercaseCheck.checked = true;
    lowercaseCheck.checked = true;
    numbersCheck.checked = true;
    symbolsCheck.checked = true;
    passwordInput.value = '';
    strengthBar.className = 'strength-bar';
    strengthText.textContent = 'Medium';
}

// Update strength indicator
function updateStrengthIndicator(password) {
    let score = 0;
    
    // Length check
    if (password.length >= 12) score += 2;
    else if (password.length >= 8) score += 1;
    
    // Character variety check
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 2;
    
    // Update indicator based on score
    strengthBar.className = 'strength-bar';
    
    if (score < 3) {
        strengthBar.classList.add('weak');
        strengthText.textContent = 'Weak';
    } else if (score < 6) {
        strengthBar.classList.add('medium');
        strengthText.textContent = 'Medium';
    } else {
        strengthBar.classList.add('strong');
        strengthText.textContent = 'Strong';
    }
}

// Generate initial password on page load
window.addEventListener('load', generatePassword);
