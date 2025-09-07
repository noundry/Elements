# Form Elements Reference

Complete guide to all supported form elements and input types in Noundry Elements.

## Table of Contents

- [Text Input Types](#text-input-types)
- [Date and Time Inputs](#date-and-time-inputs)
- [Selection Inputs](#selection-inputs)
- [File Inputs](#file-inputs)
- [Text Areas](#text-areas)
- [Specialized Inputs](#specialized-inputs)
- [Custom Error Placement](#custom-error-placement)
- [Advanced Field Configuration](#advanced-field-configuration)
- [Complete Example](#complete-example)

## Text Input Types

### Basic Text Input

```html
<input type="text" name="username" required minlength="3" maxlength="20"
       data-error="Username is required"
       data-error-tooshort="Username must be at least 3 characters"
       data-error-toolong="Username cannot exceed 20 characters">
```

**Supported Validation:**
- `required` - Field is mandatory
- `minlength` - Minimum character length
- `maxlength` - Maximum character length
- `pattern` - Regular expression pattern

### Email Input

```html
<input type="email" name="email" required
       data-error="Please enter your email address"
       data-error-typemismatch="Please enter a valid email address">
```

**Built-in Features:**
- Automatic email format validation
- Mobile keyboard optimization
- Browser autocomplete support

### Password Input

```html
<input type="password" name="password" required minlength="8"
       pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]"
       data-error="Password is required"
       data-error-tooshort="Password must be at least 8 characters"
       data-error-patternmismatch="Password must contain uppercase, lowercase, number and special character">
```

**Common Patterns:**
```html
<!-- At least 8 characters -->
<input type="password" name="password" minlength="8">

<!-- Strong password pattern -->
<input type="password" name="password" 
       pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$">

<!-- Custom validation via JavaScript -->
<script>
formElement.setValidationRule('password', (value) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(value)) return 'Password must contain uppercase letter';
    if (!/[a-z]/.test(value)) return 'Password must contain lowercase letter';
    if (!/[0-9]/.test(value)) return 'Password must contain number';
    if (!/[!@#$%^&*]/.test(value)) return 'Password must contain special character';
    return null;
});
</script>
```

### URL Input

```html
<input type="url" name="website" 
       placeholder="https://example.com"
       data-error-typemismatch="Please enter a valid URL (e.g., https://example.com)">
```

### Telephone Input

```html
<input type="tel" name="phone" 
       pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" 
       placeholder="123-456-7890"
       data-error-patternmismatch="Phone format: 123-456-7890">
```

**International Phone Example:**
```html
<div class="phone-input">
    <select name="countryCode">
        <option value="+1">🇺🇸 +1</option>
        <option value="+44">🇬🇧 +44</option>
        <option value="+33">🇫🇷 +33</option>
        <option value="+49">🇩🇪 +49</option>
    </select>
    <input type="tel" name="phone" 
           pattern="[0-9]{10}" 
           placeholder="1234567890">
</div>
```

### Search Input

```html
<input type="search" name="query" 
       placeholder="Search products..."
       autocomplete="off">
```

### Number Input

```html
<input type="number" name="age" 
       min="18" max="120" step="1"
       data-error-rangeunderflow="Age must be at least 18"
       data-error-rangeoverflow="Age cannot exceed 120"
       data-error-stepmismatch="Age must be a whole number">
```

**Decimal Numbers:**
```html
<input type="number" name="price" 
       min="0" step="0.01" 
       placeholder="0.00"
       data-error="Please enter a valid price">
```

### Range Input

```html
<input type="range" name="volume" 
       min="0" max="100" value="50" step="1">
<output for="volume">50</output>

<script>
document.querySelector('input[name="volume"]').addEventListener('input', (e) => {
    document.querySelector('output[for="volume"]').textContent = e.target.value;
});
</script>
```

## Date and Time Inputs

### Date Input

```html
<input type="date" name="birthDate" 
       min="1900-01-01" 
       max="2010-12-31"
       data-error="Please enter your birth date"
       data-error-rangeunderflow="Birth date cannot be before 1900"
       data-error-rangeoverflow="You must be at least 13 years old">
```

**Dynamic Date Constraints:**
```html
<input type="date" name="startDate" id="startDate">
<input type="date" name="endDate" id="endDate">

<script>
document.getElementById('startDate').addEventListener('change', (e) => {
    document.getElementById('endDate').min = e.target.value;
});
</script>
```

### Time Input

```html
<input type="time" name="appointmentTime" 
       min="09:00" max="17:00" step="900"
       data-error="Please select an appointment time"
       data-error-rangeunderflow="Appointments start at 9:00 AM"
       data-error-rangeoverflow="Appointments end at 5:00 PM">
```

### DateTime Local Input

```html
<input type="datetime-local" name="eventDateTime" 
       data-error="Please select event date and time">
```

### Month Input

```html
<input type="month" name="startMonth" 
       min="2024-01" 
       data-error="Please select start month">
```

### Week Input

```html
<input type="week" name="vacationWeek" 
       data-error="Please select vacation week">
```

## Selection Inputs

### Radio Buttons

```html
<fieldset>
    <legend>Payment Method</legend>
    
    <label>
        <input type="radio" name="paymentMethod" value="credit" required
               data-error="Please select a payment method">
        Credit Card
    </label>
    
    <label>
        <input type="radio" name="paymentMethod" value="debit">
        Debit Card
    </label>
    
    <label>
        <input type="radio" name="paymentMethod" value="paypal">
        PayPal
    </label>
</fieldset>
```

**Custom Radio Styling:**
```html
<div class="radio-group" role="radiogroup" aria-labelledby="size-label">
    <label class="radio-card">
        <input type="radio" name="size" value="small" required>
        <span class="radio-content">
            <strong>Small</strong>
            <span>Perfect for 1-2 people</span>
        </span>
    </label>
    
    <label class="radio-card">
        <input type="radio" name="size" value="medium">
        <span class="radio-content">
            <strong>Medium</strong>
            <span>Great for 3-4 people</span>
        </span>
    </label>
    
    <label class="radio-card">
        <input type="radio" name="size" value="large">
        <span class="radio-content">
            <strong>Large</strong>
            <span>Ideal for 5+ people</span>
        </span>
    </label>
</div>
```

### Checkboxes

```html
<!-- Single Checkbox -->
<label>
    <input type="checkbox" name="agree" value="yes" required
           data-error="You must agree to the terms">
    I agree to the terms and conditions
</label>

<!-- Multiple Checkboxes -->
<fieldset>
    <legend>Interests (select all that apply)</legend>
    
    <label>
        <input type="checkbox" name="interests" value="technology">
        Technology
    </label>
    
    <label>
        <input type="checkbox" name="interests" value="sports">
        Sports
    </label>
    
    <label>
        <input type="checkbox" name="interests" value="music">
        Music
    </label>
</fieldset>
```

**Custom Validation for Checkboxes:**
```javascript
// Require at least one checkbox to be selected
formElement.setValidationRule('interests', (value, allValues) => {
    const checkboxes = document.querySelectorAll('input[name="interests"]:checked');
    if (checkboxes.length === 0) {
        return 'Please select at least one interest';
    }
    return null;
});

// Limit number of selections
formElement.setValidationRule('skills', (value, allValues) => {
    const checkboxes = document.querySelectorAll('input[name="skills"]:checked');
    if (checkboxes.length > 5) {
        return 'Please select no more than 5 skills';
    }
    return null;
});
```

### Select Dropdowns

```html
<!-- Single Select -->
<select name="country" required
        data-error="Please select your country">
    <option value="">Select a country</option>
    <option value="US">United States</option>
    <option value="CA">Canada</option>
    <option value="UK">United Kingdom</option>
    <option value="AU">Australia</option>
</select>

<!-- Multiple Select -->
<select name="languages" multiple size="4"
        data-error="Please select at least one language">
    <option value="en">English</option>
    <option value="es">Spanish</option>
    <option value="fr">French</option>
    <option value="de">German</option>
    <option value="it">Italian</option>
</select>
```

**Grouped Options:**
```html
<select name="product" required>
    <option value="">Select a product</option>
    
    <optgroup label="Laptops">
        <option value="laptop-basic">Basic Laptop</option>
        <option value="laptop-pro">Pro Laptop</option>
        <option value="laptop-gaming">Gaming Laptop</option>
    </optgroup>
    
    <optgroup label="Desktops">
        <option value="desktop-office">Office Desktop</option>
        <option value="desktop-workstation">Workstation</option>
    </optgroup>
</select>
```

### Datalist (Autocomplete)

```html
<input type="text" name="browser" list="browsers"
       placeholder="Start typing browser name..."
       data-error="Please enter a browser name">

<datalist id="browsers">
    <option value="Chrome">
    <option value="Firefox">
    <option value="Safari">
    <option value="Edge">
    <option value="Opera">
</datalist>
```

## File Inputs

### Single File Upload

```html
<input type="file" name="avatar" 
       accept="image/*"
       data-error="Please select an image file">
```

### Multiple File Upload

```html
<input type="file" name="documents" multiple
       accept=".pdf,.doc,.docx"
       data-error="Please select at least one document">
```

**Custom File Validation:**
```javascript
formElement.setValidationRule('avatar', (value, allValues) => {
    const fileInput = document.querySelector('input[name="avatar"]');
    const file = fileInput.files[0];
    
    if (!file) return 'Please select a file';
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
        return 'File size must be less than 5MB';
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
        return 'Please select an image file';
    }
    
    return null;
});
```

**Drag and Drop File Upload:**
```html
<div class="file-drop-zone" 
     ondragover="event.preventDefault()" 
     ondrop="handleFileDrop(event)">
    <input type="file" name="files" multiple style="display: none;">
    <p>Drag files here or click to select</p>
</div>

<script>
function handleFileDrop(event) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    const input = document.querySelector('input[name="files"]');
    input.files = files;
    
    // Trigger change event for validation
    input.dispatchEvent(new Event('change', { bubbles: true }));
}
</script>
```

## Text Areas

### Basic Textarea

```html
<textarea name="message" required 
          minlength="10" maxlength="500"
          rows="4" cols="50"
          placeholder="Enter your message..."
          data-error="Please enter a message"
          data-error-tooshort="Message must be at least 10 characters"
          data-error-toolong="Message cannot exceed 500 characters"></textarea>
```

### Character Counter

```html
<div class="textarea-wrapper">
    <textarea name="description" maxlength="200" 
              oninput="updateCharCount(this)"></textarea>
    <div class="char-count">
        <span id="char-current">0</span>/<span id="char-max">200</span>
    </div>
</div>

<script>
function updateCharCount(textarea) {
    const current = textarea.value.length;
    const max = textarea.maxLength;
    
    document.getElementById('char-current').textContent = current;
    document.getElementById('char-max').textContent = max;
    
    // Visual feedback
    const counter = textarea.nextElementSibling;
    if (current > max * 0.8) {
        counter.style.color = 'red';
    } else if (current > max * 0.6) {
        counter.style.color = 'orange';
    } else {
        counter.style.color = 'green';
    }
}
</script>
```

### Auto-resize Textarea

```html
<textarea name="comments" 
          rows="3" 
          style="min-height: 60px; resize: vertical;"
          oninput="autoResize(this)"></textarea>

<script>
function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}
</script>
```

## Specialized Inputs

### Color Input

```html
<input type="color" name="themeColor" value="#3366cc"
       data-error="Please select a theme color">
```

### Hidden Input

```html
<input type="hidden" name="formToken" value="abc123">
<input type="hidden" name="userId" value="12345">
```

**Note:** Hidden inputs are included in form data but don't participate in validation UI.

### Submit and Reset Buttons

```html
<button type="submit">Submit Form</button>
<button type="reset">Reset Form</button>
<button type="button" onclick="customAction()">Custom Action</button>

<!-- Input buttons (less recommended) -->
<input type="submit" value="Submit">
<input type="reset" value="Reset">
<input type="button" value="Custom" onclick="customAction()">
```

## Custom Error Placement

### Default Error Placement

By default, Noundry Elements creates error elements after each field:

```html
<input type="email" name="email" required>
<!-- Error element automatically created here -->
```

### Custom Error Element

```html
<input type="email" name="email" required>
<div data-error-for="email" class="custom-error-style"></div>
```

### Multiple Error Containers

```html
<input type="password" name="password" required>

<!-- Summary error at top of form -->
<div data-error-for="password" class="error-summary"></div>

<!-- Inline error next to field -->
<div data-error-for="password" class="error-inline"></div>
```

### Error Styling Examples

```css
/* Default error styling */
.noundry-error {
    color: #e53e3e;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    display: block;
}

/* Custom error styles */
.error-tooltip {
    position: relative;
    color: #e53e3e;
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    background: #fed7d7;
    border-radius: 0.25rem;
    border: 1px solid #e53e3e;
}

.error-tooltip::before {
    content: '';
    position: absolute;
    top: -5px;
    left: 10px;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid #e53e3e;
}

/* Error icon */
.error-with-icon::before {
    content: '⚠️';
    margin-right: 0.5rem;
}
```

## Advanced Field Configuration

### Fieldset and Legend

```html
<fieldset>
    <legend>Personal Information</legend>
    
    <input type="text" name="firstName" required>
    <input type="text" name="lastName" required>
    <input type="email" name="email" required>
</fieldset>
```

### Form Sections with Validation

```html
<div class="form-section" data-section="contact">
    <h3>Contact Information</h3>
    
    <input type="text" name="name" required
           data-section-required="contact">
    
    <input type="email" name="email" required
           data-section-required="contact">
</div>

<script>
// Validate entire section
function validateSection(sectionName) {
    const fields = document.querySelectorAll(`[data-section-required="${sectionName}"]`);
    let isValid = true;
    
    fields.forEach(field => {
        if (!field.checkValidity()) {
            isValid = false;
        }
    });
    
    return isValid;
}
</script>
```

### Conditional Fields

```html
<select name="contactMethod" onchange="toggleContactField(this.value)">
    <option value="">Select contact method</option>
    <option value="email">Email</option>
    <option value="phone">Phone</option>
</select>

<div id="emailField" style="display: none;">
    <input type="email" name="email" 
           data-conditional-required="email">
</div>

<div id="phoneField" style="display: none;">
    <input type="tel" name="phone" 
           pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
           data-conditional-required="phone">
</div>

<script>
function toggleContactField(method) {
    // Hide all conditional fields
    document.getElementById('emailField').style.display = 'none';
    document.getElementById('phoneField').style.display = 'none';
    
    // Remove required attribute from hidden fields
    document.querySelectorAll('[data-conditional-required]').forEach(field => {
        field.removeAttribute('required');
    });
    
    // Show and require selected field
    if (method) {
        document.getElementById(method + 'Field').style.display = 'block';
        document.querySelector(`[data-conditional-required="${method}"]`).setAttribute('required', '');
    }
}
</script>
```

### Dynamic Field Arrays

```html
<div id="skillsContainer">
    <div class="skill-entry">
        <input type="text" name="skills[]" placeholder="Skill name">
        <input type="number" name="skillYears[]" min="0" max="50" placeholder="Years">
        <button type="button" onclick="removeSkill(this)">Remove</button>
    </div>
</div>

<button type="button" onclick="addSkill()">Add Skill</button>

<script>
function addSkill() {
    const container = document.getElementById('skillsContainer');
    const skillEntry = container.querySelector('.skill-entry').cloneNode(true);
    
    // Clear values in cloned inputs
    skillEntry.querySelectorAll('input').forEach(input => {
        input.value = '';
    });
    
    container.appendChild(skillEntry);
}

function removeSkill(button) {
    const container = document.getElementById('skillsContainer');
    if (container.children.length > 1) {
        button.parentElement.remove();
    }
}
</script>
```

## Complete Example

Here's a comprehensive form showcasing all element types:

```html
<noundry-element error-disable-submit>
    <form action="/api/profile" method="POST" enctype="multipart/form-data">
        
        <!-- Text Inputs -->
        <fieldset>
            <legend>Basic Information</legend>
            
            <input type="text" name="firstName" required minlength="2"
                   data-error="First name is required">
            
            <input type="email" name="email" required
                   data-error="Please enter a valid email address">
            
            <input type="tel" name="phone" 
                   pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                   data-error-patternmismatch="Phone format: 123-456-7890">
            
            <input type="url" name="website" 
                   placeholder="https://your-website.com">
        </fieldset>
        
        <!-- Date/Time Inputs -->
        <fieldset>
            <legend>Dates and Times</legend>
            
            <input type="date" name="birthDate" required
                   max="2005-12-31"
                   data-error="Please enter your birth date">
            
            <input type="time" name="availableFrom" 
                   min="09:00" max="17:00">
            
            <input type="datetime-local" name="interviewTime">
        </fieldset>
        
        <!-- Numbers and Ranges -->
        <fieldset>
            <legend>Numeric Values</legend>
            
            <input type="number" name="age" 
                   min="18" max="120" 
                   data-error-rangeunderflow="Must be at least 18">
            
            <input type="range" name="experience" 
                   min="0" max="20" value="5">
            
            <input type="number" name="salary" 
                   min="0" step="1000" 
                   placeholder="Expected salary">
        </fieldset>
        
        <!-- Selection Inputs -->
        <fieldset>
            <legend>Preferences</legend>
            
            <!-- Radio buttons -->
            <div role="radiogroup" aria-labelledby="work-type">
                <legend id="work-type">Work Type</legend>
                <label><input type="radio" name="workType" value="full-time" required> Full-time</label>
                <label><input type="radio" name="workType" value="part-time"> Part-time</label>
                <label><input type="radio" name="workType" value="contract"> Contract</label>
            </div>
            
            <!-- Checkboxes -->
            <div>
                <legend>Skills</legend>
                <label><input type="checkbox" name="skills" value="javascript"> JavaScript</label>
                <label><input type="checkbox" name="skills" value="python"> Python</label>
                <label><input type="checkbox" name="skills" value="java"> Java</label>
            </div>
            
            <!-- Select dropdown -->
            <select name="location" required>
                <option value="">Select location</option>
                <option value="remote">Remote</option>
                <option value="office">Office</option>
                <option value="hybrid">Hybrid</option>
            </select>
        </fieldset>
        
        <!-- File Upload -->
        <fieldset>
            <legend>Documents</legend>
            
            <input type="file" name="resume" 
                   accept=".pdf,.doc,.docx" required
                   data-error="Please upload your resume">
            
            <input type="file" name="portfolio" multiple
                   accept=".pdf,.jpg,.png">
        </fieldset>
        
        <!-- Text Area -->
        <fieldset>
            <legend>Additional Information</legend>
            
            <textarea name="coverLetter" 
                      rows="6" 
                      minlength="100" maxlength="1000"
                      placeholder="Tell us about yourself..."
                      data-error-tooshort="Cover letter must be at least 100 characters"></textarea>
        </fieldset>
        
        <!-- Specialized -->
        <fieldset>
            <legend>Preferences</legend>
            
            <input type="color" name="favoriteColor" value="#3366cc">
            
            <input type="search" name="interests" 
                   list="interest-suggestions"
                   placeholder="Search interests...">
            
            <datalist id="interest-suggestions">
                <option value="Technology">
                <option value="Design">
                <option value="Marketing">
                <option value="Sales">
            </datalist>
        </fieldset>
        
        <!-- Hidden fields -->
        <input type="hidden" name="formVersion" value="1.2">
        <input type="hidden" name="source" value="website">
        
        <!-- Submit -->
        <button type="submit">Submit Profile</button>
        <button type="reset">Reset Form</button>
        
    </form>
</noundry-element>
```

This comprehensive example demonstrates all major form element types and validation patterns supported by Noundry Elements. Each element includes appropriate validation rules and error messages for a complete user experience.