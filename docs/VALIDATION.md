# Validation Guide

Comprehensive guide to form validation using Noundry Elements, including built-in HTML5 validation, custom validation rules, and advanced validation patterns.

## Table of Contents

- [Built-in HTML5 Validation](#built-in-html5-validation)
- [Custom Validation Rules](#custom-validation-rules)
- [Cross-field Validation](#cross-field-validation)
- [Async Validation](#async-validation)
- [Error Message Customization](#error-message-customization)
- [Validation Timing](#validation-timing)
- [Common Validation Patterns](#common-validation-patterns)
- [Server-side Validation Integration](#server-side-validation-integration)
- [Accessibility Considerations](#accessibility-considerations)

## Built-in HTML5 Validation

Noundry Elements leverages native HTML5 validation for optimal performance and browser compatibility.

### Required Fields

```html
<input type="text" name="username" required
       data-error="Username is required">

<input type="email" name="email" required
       data-error="Email address is required">

<textarea name="message" required
          data-error="Please enter your message"></textarea>

<select name="country" required
        data-error="Please select your country">
    <option value="">Select country</option>
    <option value="US">United States</option>
</select>
```

### Length Constraints

```html
<!-- Minimum length -->
<input type="text" name="username" 
       required minlength="3"
       data-error="Username is required"
       data-error-tooshort="Username must be at least 3 characters">

<!-- Maximum length -->
<input type="text" name="bio" 
       maxlength="500"
       data-error-toolong="Bio cannot exceed 500 characters">

<!-- Combined constraints -->
<input type="password" name="password" 
       required minlength="8" maxlength="128"
       data-error="Password is required"
       data-error-tooshort="Password must be at least 8 characters"
       data-error-toolong="Password cannot exceed 128 characters">
```

### Numeric Constraints

```html
<!-- Range validation -->
<input type="number" name="age" 
       min="18" max="120" step="1"
       data-error-rangeunderflow="Must be at least 18 years old"
       data-error-rangeoverflow="Age cannot exceed 120"
       data-error-stepmismatch="Age must be a whole number">

<!-- Decimal precision -->
<input type="number" name="price" 
       min="0" step="0.01"
       data-error-rangeunderflow="Price cannot be negative"
       data-error-stepmismatch="Price must be in cents (e.g., 19.99)">
```

### Pattern Matching

```html
<!-- Phone number -->
<input type="tel" name="phone" 
       pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
       data-error-patternmismatch="Phone format: 123-456-7890">

<!-- Postal code -->
<input type="text" name="zipCode" 
       pattern="[0-9]{5}(-[0-9]{4})?"
       data-error-patternmismatch="ZIP code format: 12345 or 12345-6789">

<!-- Username (alphanumeric + underscore) -->
<input type="text" name="username" 
       pattern="[a-zA-Z0-9_]{3,20}"
       data-error-patternmismatch="Username: 3-20 chars, letters/numbers/underscore only">

<!-- Strong password -->
<input type="password" name="password" 
       pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
       data-error-patternmismatch="Password must contain uppercase, lowercase, number and special character">
```

### Input Type Validation

```html
<!-- Email validation -->
<input type="email" name="email" required
       data-error-typemismatch="Please enter a valid email address">

<!-- URL validation -->
<input type="url" name="website" 
       data-error-typemismatch="Please enter a valid URL (e.g., https://example.com)">

<!-- Date validation -->
<input type="date" name="birthDate" 
       min="1900-01-01" max="2005-12-31"
       data-error-rangeunderflow="Birth date cannot be before 1900"
       data-error-rangeoverflow="You must be at least 18 years old">
```

## Custom Validation Rules

Add sophisticated validation logic using JavaScript functions.

### Basic Custom Validation

```javascript
const formElement = document.querySelector('noundry-element');

// Simple validation rule
formElement.setValidationRule('username', (value) => {
    if (!value) return 'Username is required';
    if (value.length < 3) return 'Username must be at least 3 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
    return null; // Valid
});
```

### Advanced Password Validation

```javascript
formElement.setValidationRule('password', (value) => {
    if (!value) return 'Password is required';
    
    const checks = {
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /[0-9]/.test(value),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(value)
    };
    
    const failedChecks = [];
    if (!checks.length) failedChecks.push('at least 8 characters');
    if (!checks.uppercase) failedChecks.push('an uppercase letter');
    if (!checks.lowercase) failedChecks.push('a lowercase letter');
    if (!checks.number) failedChecks.push('a number');
    if (!checks.special) failedChecks.push('a special character');
    
    if (failedChecks.length > 0) {
        return `Password must contain ${failedChecks.join(', ')}`;
    }
    
    return null;
});
```

### Email Domain Validation

```javascript
formElement.setValidationRule('workEmail', (value) => {
    if (!value) return null; // Let HTML5 required handle empty values
    
    // Basic email format check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
        return 'Please enter a valid email address';
    }
    
    // Domain restriction
    const allowedDomains = ['company.com', 'partner.org'];
    const domain = value.split('@')[1].toLowerCase();
    
    if (!allowedDomains.includes(domain)) {
        return `Email must be from: ${allowedDomains.join(', ')}`;
    }
    
    return null;
});
```

### File Upload Validation

```javascript
formElement.setValidationRule('avatar', (value, allValues) => {
    const fileInput = document.querySelector('input[name="avatar"]');
    const file = fileInput.files[0];
    
    if (!file) return 'Please select a profile picture';
    
    // File size check (2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
        return 'File size must be less than 2MB';
    }
    
    // File type check
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
        return 'Please select a JPEG, PNG, or GIF image';
    }
    
    // Image dimensions check (optional)
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            if (img.width < 100 || img.height < 100) {
                resolve('Image must be at least 100x100 pixels');
            } else if (img.width > 2000 || img.height > 2000) {
                resolve('Image cannot exceed 2000x2000 pixels');
            } else {
                resolve(null); // Valid
            }
        };
        img.onerror = () => resolve('Invalid image file');
        img.src = URL.createObjectURL(file);
    });
});
```

### Credit Card Validation

```javascript
// Luhn algorithm for credit card validation
function validateCreditCard(number) {
    const digits = number.replace(/\s+/g, '').split('').map(Number);
    let sum = 0;
    let isEven = false;
    
    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = digits[i];
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return sum % 10 === 0;
}

formElement.setValidationRule('creditCard', (value) => {
    if (!value) return 'Credit card number is required';
    
    // Remove spaces and dashes
    const cleanNumber = value.replace(/[\s-]/g, '');
    
    // Length check
    if (cleanNumber.length < 13 || cleanNumber.length > 19) {
        return 'Credit card number must be 13-19 digits';
    }
    
    // Numeric check
    if (!/^\d+$/.test(cleanNumber)) {
        return 'Credit card number can only contain digits';
    }
    
    // Luhn algorithm check
    if (!validateCreditCard(cleanNumber)) {
        return 'Invalid credit card number';
    }
    
    return null;
});
```

## Cross-field Validation

Validate fields based on the values of other fields.

### Password Confirmation

```javascript
formElement.setValidationRule('confirmPassword', (value, allValues) => {
    if (!value) return 'Please confirm your password';
    
    if (value !== allValues.password) {
        return 'Passwords do not match';
    }
    
    return null;
});
```

### Date Range Validation

```javascript
formElement.setValidationRule('endDate', (value, allValues) => {
    if (!value) return null; // Optional field
    
    const startDate = allValues.startDate;
    if (!startDate) return null; // Can't validate without start date
    
    const start = new Date(startDate);
    const end = new Date(value);
    
    if (end <= start) {
        return 'End date must be after start date';
    }
    
    // Maximum range check (e.g., 1 year)
    const maxRange = 365 * 24 * 60 * 60 * 1000; // 1 year in milliseconds
    if (end - start > maxRange) {
        return 'Date range cannot exceed 1 year';
    }
    
    return null;
});
```

### Conditional Required Fields

```javascript
formElement.setValidationRule('phone', (value, allValues) => {
    const contactMethod = allValues.contactMethod;
    
    // Phone required if "phone" is selected as contact method
    if (contactMethod === 'phone' && !value) {
        return 'Phone number is required for phone contact';
    }
    
    // Validate format if provided
    if (value && !/^\d{3}-\d{3}-\d{4}$/.test(value)) {
        return 'Phone format: 123-456-7890';
    }
    
    return null;
});

formElement.setValidationRule('email', (value, allValues) => {
    const contactMethod = allValues.contactMethod;
    
    // Email required if "email" is selected as contact method
    if (contactMethod === 'email' && !value) {
        return 'Email address is required for email contact';
    }
    
    return null;
});
```

### Age and Birth Date Consistency

```javascript
formElement.setValidationRule('age', (value, allValues) => {
    if (!value) return null;
    
    const birthDate = allValues.birthDate;
    if (!birthDate) return null;
    
    // Calculate age from birth date
    const today = new Date();
    const birth = new Date(birthDate);
    const calculatedAge = today.getFullYear() - birth.getFullYear() - 
        (today < new Date(birth.setFullYear(today.getFullYear())) ? 1 : 0);
    
    const enteredAge = parseInt(value);
    
    if (Math.abs(calculatedAge - enteredAge) > 1) {
        return 'Age does not match birth date';
    }
    
    return null;
});
```

## Async Validation

Handle validation that requires server communication.

### Username Availability

```javascript
let usernameCheckTimeout;

formElement.setValidationRule('username', (value) => {
    return new Promise((resolve) => {
        if (!value || value.length < 3) {
            resolve('Username must be at least 3 characters');
            return;
        }
        
        // Clear previous timeout
        clearTimeout(usernameCheckTimeout);
        
        // Debounce server requests
        usernameCheckTimeout = setTimeout(async () => {
            try {
                const response = await fetch('/api/check-username', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: value })
                });
                
                const result = await response.json();
                
                if (!result.available) {
                    resolve('Username is already taken');
                } else {
                    resolve(null); // Available
                }
            } catch (error) {
                resolve('Unable to check username availability');
            }
        }, 500); // 500ms delay
    });
});
```

### Email Verification

```javascript
formElement.setValidationRule('email', (value) => {
    return new Promise(async (resolve) => {
        if (!value) {
            resolve('Email is required');
            return;
        }
        
        // Basic format check first
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
            resolve('Please enter a valid email address');
            return;
        }
        
        try {
            const response = await fetch('/api/validate-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: value })
            });
            
            const result = await response.json();
            
            if (!result.valid) {
                resolve(result.message || 'Email address is invalid');
            } else {
                resolve(null); // Valid
            }
        } catch (error) {
            // Don't fail validation on network errors
            resolve(null);
        }
    });
});
```

### Postal Code / Address Validation

```javascript
formElement.setValidationRule('zipCode', (value, allValues) => {
    return new Promise(async (resolve) => {
        if (!value) {
            resolve('ZIP code is required');
            return;
        }
        
        const country = allValues.country || 'US';
        
        try {
            const response = await fetch(`/api/validate-postal-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    postalCode: value, 
                    country: country 
                })
            });
            
            const result = await response.json();
            
            if (!result.valid) {
                resolve(`Invalid ${country} postal code format`);
            } else {
                resolve(null);
            }
        } catch (error) {
            // Fallback to basic format validation
            if (country === 'US' && !/^\d{5}(-\d{4})?$/.test(value)) {
                resolve('US ZIP code format: 12345 or 12345-6789');
            } else {
                resolve(null);
            }
        }
    });
});
```

## Error Message Customization

### Dynamic Error Messages

```javascript
formElement.setValidationRule('password', (value) => {
    if (!value) return 'Password is required';
    
    const strength = calculatePasswordStrength(value);
    
    switch (strength) {
        case 'weak':
            return 'Password is too weak. Try adding numbers and symbols.';
        case 'medium':
            return 'Password strength is medium. Consider adding more variety.';
        case 'strong':
            return null; // Valid
        default:
            return 'Password does not meet security requirements.';
    }
});

function calculatePasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score < 3) return 'weak';
    if (score < 5) return 'medium';
    return 'strong';
}
```

### Contextual Error Messages

```javascript
formElement.setValidationRule('age', (value, allValues) => {
    if (!value) return 'Age is required';
    
    const age = parseInt(value);
    const serviceType = allValues.serviceType;
    
    if (serviceType === 'senior-discount' && age < 65) {
        return 'Senior discount is available for ages 65 and above';
    }
    
    if (serviceType === 'youth-program' && (age < 16 || age > 24)) {
        return 'Youth program is for ages 16-24';
    }
    
    if (age < 18) {
        return 'You must be 18 or older to register';
    }
    
    return null;
});
```

### Multiple Error Display

```html
<!-- Multiple error containers for the same field -->
<input type="password" name="password" required>

<!-- Primary error (next to field) -->
<div data-error-for="password" class="field-error"></div>

<!-- Summary error (at top of form) -->
<div data-error-for="password" class="summary-error"></div>

<!-- Help text error (in sidebar) -->
<div data-error-for="password" class="help-error"></div>
```

## Validation Timing

### Real-time Validation

```javascript
// Validate on every keystroke (use sparingly)
formElement.addEventListener('noundry-input', (event) => {
    const field = event.detail.field;
    const value = event.detail.value;
    
    // Only for certain fields
    if (field === 'username') {
        validateUsernameAvailability(value);
    }
});
```

### Delayed Validation

```javascript
let validationTimeouts = {};

formElement.addEventListener('noundry-input', (event) => {
    const field = event.detail.field;
    const value = event.detail.value;
    
    // Clear previous timeout
    if (validationTimeouts[field]) {
        clearTimeout(validationTimeouts[field]);
    }
    
    // Set new timeout
    validationTimeouts[field] = setTimeout(() => {
        // Perform validation after delay
        validateField(field, value);
    }, 1000); // 1 second delay
});
```

### Submit-time Only Validation

```javascript
formElement.setValidationRule('expensiveValidation', (value) => {
    // Only validate on form submission
    if (!formElement.querySelector('[type="submit"]').matches(':focus')) {
        return null; // Skip validation during input
    }
    
    // Perform expensive validation
    return performComplexValidation(value);
});
```

## Common Validation Patterns

### Credit Card Expiry

```javascript
formElement.setValidationRule('cardExpiry', (value) => {
    if (!value) return 'Expiry date is required';
    
    const pattern = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!pattern.test(value)) {
        return 'Expiry format: MM/YY';
    }
    
    const [month, year] = value.split('/');
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const now = new Date();
    
    if (expiry < now) {
        return 'Card has expired';
    }
    
    return null;
});
```

### Social Security Number

```javascript
formElement.setValidationRule('ssn', (value) => {
    if (!value) return 'SSN is required';
    
    const cleanSSN = value.replace(/[\s-]/g, '');
    
    if (!/^\d{9}$/.test(cleanSSN)) {
        return 'SSN format: 123-45-6789';
    }
    
    // Check for invalid patterns
    const invalidPatterns = [
        /^000/, /^666/, /^9[0-9][0-9]/,  // Invalid area numbers
        /^.{3}00/, /^.{5}0000/          // Invalid group/serial numbers
    ];
    
    for (const pattern of invalidPatterns) {
        if (pattern.test(cleanSSN)) {
            return 'Invalid SSN format';
        }
    }
    
    return null;
});
```

### International Phone Numbers

```javascript
formElement.setValidationRule('internationalPhone', (value, allValues) => {
    if (!value) return null; // Optional field
    
    const countryCode = allValues.countryCode || '+1';
    
    const patterns = {
        '+1': /^\+1[2-9][0-9]{2}[2-9][0-9]{2}[0-9]{4}$/, // US/Canada
        '+44': /^\+44[1-9][0-9]{8,9}$/,                   // UK
        '+49': /^\+49[1-9][0-9]{10,11}$/,                 // Germany
        '+33': /^\+33[1-9][0-9]{8}$/                      // France
    };
    
    const pattern = patterns[countryCode];
    if (!pattern) {
        return `Phone validation not available for ${countryCode}`;
    }
    
    if (!pattern.test(value.replace(/[\s-()]/g, ''))) {
        return `Invalid phone number for ${countryCode}`;
    }
    
    return null;
});
```

## Server-side Validation Integration

### Handling Server Errors

```javascript
formElement.addEventListener('noundry-submit', async (event) => {
    event.preventDefault();
    
    try {
        const response = await fetch('/api/submit', {
            method: 'POST',
            body: event.detail.formData
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            
            if (errorData.validationErrors) {
                // Display server validation errors
                displayServerErrors(errorData.validationErrors);
            } else {
                throw new Error('Submission failed');
            }
        } else {
            // Success
            showSuccessMessage('Form submitted successfully!');
        }
    } catch (error) {
        showErrorMessage('An error occurred. Please try again.');
    }
});

function displayServerErrors(errors) {
    // Clear existing errors
    document.querySelectorAll('.server-error').forEach(el => el.remove());
    
    // Display each server error
    Object.keys(errors).forEach(fieldName => {
        const errorMessage = errors[fieldName];
        const field = document.querySelector(`[name="${fieldName}"]`);
        
        if (field) {
            const errorElement = document.createElement('div');
            errorElement.className = 'noundry-error server-error';
            errorElement.textContent = errorMessage;
            field.parentNode.insertBefore(errorElement, field.nextSibling);
        }
    });
}
```

### Pre-submission Validation

```javascript
formElement.setValidationRule('email', (value) => {
    return new Promise(async (resolve) => {
        // Client-side validation first
        if (!value || !value.includes('@')) {
            resolve('Please enter a valid email');
            return;
        }
        
        // Server-side validation
        try {
            const response = await fetch('/api/pre-validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ field: 'email', value })
            });
            
            const result = await response.json();
            resolve(result.valid ? null : result.message);
        } catch (error) {
            // Don't fail on network errors during input
            resolve(null);
        }
    });
});
```

## Accessibility Considerations

### ARIA Labels and Descriptions

```html
<input type="password" name="password" 
       required
       aria-describedby="password-help password-error"
       data-error="Password is required">

<div id="password-help" class="help-text">
    Password must be at least 8 characters with uppercase, lowercase, number, and symbol.
</div>

<div id="password-error" data-error-for="password" 
     role="alert" aria-live="polite" class="noundry-error"></div>
```

### Screen Reader Friendly Validation

```javascript
formElement.setValidationRule('creditCard', (value) => {
    if (!value) return 'Credit card number is required';
    
    const cleanNumber = value.replace(/[\s-]/g, '');
    
    if (!validateCreditCard(cleanNumber)) {
        // Provide helpful feedback for screen readers
        return 'Invalid credit card number. Please check the number and try again.';
    }
    
    return null;
});
```

### Focus Management

```javascript
formElement.addEventListener('noundry-invalid', (event) => {
    // Focus first invalid field
    const firstErrorField = Object.keys(event.detail.errors)[0];
    const field = document.querySelector(`[name="${firstErrorField}"]`);
    
    if (field) {
        field.focus();
        
        // Announce error to screen readers
        const errorMessage = event.detail.errors[firstErrorField];
        announceToScreenReader(`Validation error: ${errorMessage}`);
    }
});

function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only'; // Screen reader only
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}
```

This comprehensive validation guide covers all aspects of form validation with Noundry Elements, from basic HTML5 validation to complex async validation patterns, ensuring robust and accessible form validation for all use cases.