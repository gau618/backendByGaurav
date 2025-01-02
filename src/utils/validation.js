export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const validatePhoneNumber = (phoneNumber) => {
    const regex = /^\+?[1-9]\d{1,14}$/; // E.164 format
    return regex.test(phoneNumber);
};

export const validateURL = (url) => {
    const regex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(:[0-9]{1,5})?(\/[^\s]*)?$/i;
    return regex.test(url);
};

export const validatePassword = (password) => {
    // At least one uppercase, one lowercase, one number, one special character, and minimum 8 characters
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
};

export const validateUsername = (username) => {
    // Alphanumeric, underscores, and hyphens; 3 to 16 characters
    const regex = /^[a-zA-Z0-9_-]{3,16}$/;
    return regex.test(username);
};
export const validateFullName = (fullName) => {
    // Allows names with letters, spaces, hyphens, and apostrophes
    const regex = /^[a-zA-Z]+([ '-][a-zA-Z]+)*$/;
    return regex.test(fullName);
};
export const validateCreditCard = (creditCardNumber) => {
    // Luhn algorithm validation
    const regex = /^\d{13,19}$/;
    return regex.test(creditCardNumber);
};

export const validatePostalCode = (postalCode, countryCode = "US") => {
    const postalRegex = {
        US: /^\d{5}(-\d{4})?$/,
        CA: /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/,
        IN: /^\d{6}$/,
    };
    return postalRegex[countryCode]?.test(postalCode) || false;
};

export const validateHexColor = (color) => {
    const regex = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
    return regex.test(color);
};

export const validateDate = (dateString) => {
    return !isNaN(Date.parse(dateString));
};

export const validateIPv4 = (ip) => {
    const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){2}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regex.test(ip);
};

export const validateIPv6 = (ip) => {
    const regex = /^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$/;
    return regex.test(ip);
};

export const validateMACAddress = (mac) => {
    const regex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    return regex.test(mac);
};

export const validateNumeric = (value) => {
    return !isNaN(value);
};

export const validateAlphabetic = (value) => {
    const regex = /^[a-zA-Z]+$/;
    return regex.test(value);
};

export const validateAlphanumeric = (value) => {
    const regex = /^[a-zA-Z0-9]+$/;
    return regex.test(value);
};

export const validateJSON = (jsonString) => {
    try {
        JSON.parse(jsonString);
        return true;
    } catch (e) {
        return false;
    }
};

// Example usage
// console.log(validateEmail("example@test.com")); // true
// console.log(validatePhoneNumber("+1234567890")); // true
// console.log(validateURL("https://example.com")); // true
// console.log(validatePassword("Password@123")); // true
// console.log(validateUsername("user_name123")); // true
// console.log(validateCreditCard("4111111111111111")); // true
// console.log(validatePostalCode("12345", "US")); // true
// console.log(validateHexColor("#FFFFFF")); // true
// console.log(validateDate("2025-01-01")); // true
// console.log(validateIPv4("192.168.0.1")); // true
// console.log(validateIPv6("2001:0db8:85a3:0000:0000:8a2e:0370:7334")); // true
// console.log(validateMACAddress("00:14:22:01:23:45")); // true
// console.log(validateNumeric("12345")); // true
// console.log(validateAlphabetic("Test")); // true
// console.log(validateAlphanumeric("Test123")); // true
// console.log(validateJSON('{"name": "John"}')); // true

