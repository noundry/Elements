# Alpine.js Integration Guide

Complete guide to integrating Noundry Elements with Alpine.js for reactive form handling.

## Table of Contents

- [Basic Integration](#basic-integration)
- [Reactive Data Binding](#reactive-data-binding)
- [Event Handling](#event-handling)
- [State Management](#state-management)
- [Form Patterns](#form-patterns)
- [Advanced Examples](#advanced-examples)
- [Best Practices](#best-practices)
- [Performance Tips](#performance-tips)

## Basic Integration

### Setup

```html
<!DOCTYPE html>
<html>
<head>
    <title>Alpine.js + Noundry Elements</title>
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>
<body>
    <div x-data="contactForm()">
        <noundry-element x-ref="form" @noundry-submit="handleSubmit">
            <form>
                <input type="text" name="name" x-model="formData.name">
                <input type="email" name="email" x-model="formData.email">
                <button type="submit" :disabled="!formState.isValid">Submit</button>
            </form>
        </noundry-element>
    </div>

    <script src="noundry-elements.js"></script>
    <script>
        function contactForm() {
            return {
                formData: { name: '', email: '' },
                formState: { isValid: false },
                
                handleSubmit(event) {
                    console.log('Form submitted:', event.detail.values);
                }
            };
        }
    </script>
</body>
</html>
```

### The `$noundry` Property

Noundry Elements provides a special `$noundry` property that integrates seamlessly with Alpine.js:

```html
<div x-data="{ formState: {} }">
    <noundry-element x-ref="form">
        <form>
            <input type="text" name="username" required>
            <button type="submit" :disabled="!$refs.form.$noundry?.isValid">Submit</button>
        </form>
    </noundry-element>
    
    <!-- Display form state -->
    <div x-text="`Valid: ${$refs.form.$noundry?.isValid}`"></div>
    <div x-text="`Dirty: ${$refs.form.$noundry?.isDirty}`"></div>
</div>
```

## Reactive Data Binding

### Two-way Data Binding

```html
<div x-data="userProfile()">
    <noundry-element 
        x-ref="profileForm"
        @noundry-input="syncFormData"
        @noundry-change="syncFormData"
    >
        <form>
            <input type="text" name="firstName" x-model="profile.firstName" required>
            <input type="text" name="lastName" x-model="profile.lastName" required>
            <input type="email" name="email" x-model="profile.email" required>
            <select name="country" x-model="profile.country">
                <option value="">Select country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
            </select>
        </form>
    </noundry-element>
    
    <!-- Live preview -->
    <div class="preview">
        <h3>Profile Preview</h3>
        <p x-text="`${profile.firstName} ${profile.lastName}`"></p>
        <p x-text="profile.email"></p>
        <p x-text="profile.country"></p>
    </div>
</div>

<script>
function userProfile() {
    return {
        profile: {
            firstName: '',
            lastName: '',
            email: '',
            country: ''
        },
        
        syncFormData(event) {
            // Sync Alpine data with form changes
            this.profile = { ...this.profile, ...event.detail.values };
        },
        
        updateForm() {
            // Update form when Alpine data changes
            this.$refs.profileForm.setValues(this.profile);
        }
    };
}
</script>
```

### Computed Properties

```html
<div x-data="orderForm()">
    <noundry-element x-ref="form" @noundry-input="updateOrder">
        <form>
            <input type="number" name="quantity" min="1" x-model.number="order.quantity">
            <input type="number" name="price" step="0.01" x-model.number="order.price">
            <select name="tax" x-model="order.taxRate">
                <option value="0.08">8% Tax</option>
                <option value="0.10">10% Tax</option>
            </select>
        </form>
    </noundry-element>
    
    <!-- Computed totals -->
    <div class="totals">
        <p>Subtotal: <span x-text="formatCurrency(subtotal)"></span></p>
        <p>Tax: <span x-text="formatCurrency(tax)"></span></p>
        <p>Total: <span x-text="formatCurrency(total)"></span></p>
    </div>
</div>

<script>
function orderForm() {
    return {
        order: {
            quantity: 1,
            price: 0,
            taxRate: 0.08
        },
        
        get subtotal() {
            return this.order.quantity * this.order.price;
        },
        
        get tax() {
            return this.subtotal * this.order.taxRate;
        },
        
        get total() {
            return this.subtotal + this.tax;
        },
        
        updateOrder(event) {
            this.order = { ...this.order, ...event.detail.values };
        },
        
        formatCurrency(amount) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(amount);
        }
    };
}
</script>
```

## Event Handling

### Form Lifecycle Events

```html
<div x-data="formHandler()">
    <noundry-element 
        x-ref="form"
        @noundry-input="handleInput"
        @noundry-change="handleChange"
        @noundry-submit="handleSubmit"
        @noundry-invalid="handleInvalid"
        @noundry-reset="handleReset"
    >
        <form>
            <input type="text" name="username" required>
            <input type="email" name="email" required>
            <button type="submit">Submit</button>
            <button type="reset">Reset</button>
        </form>
    </noundry-element>
    
    <!-- Event log -->
    <div class="event-log">
        <h3>Event Log</h3>
        <ul>
            <template x-for="event in eventLog" :key="event.id">
                <li x-text="`${event.time}: ${event.message}`"></li>
            </template>
        </ul>
    </div>
</div>

<script>
function formHandler() {
    return {
        eventLog: [],
        eventCounter: 0,
        
        logEvent(message) {
            this.eventLog.unshift({
                id: ++this.eventCounter,
                time: new Date().toLocaleTimeString(),
                message
            });
            
            // Keep only last 10 events
            if (this.eventLog.length > 10) {
                this.eventLog.pop();
            }
        },
        
        handleInput(event) {
            this.logEvent(`Input: ${event.detail.field} = "${event.detail.value}"`);
        },
        
        handleChange(event) {
            this.logEvent(`Changed: ${event.detail.field} = "${event.detail.value}"`);
        },
        
        handleSubmit(event) {
            this.logEvent('Form submitted successfully');
        },
        
        handleInvalid(event) {
            const errors = Object.keys(event.detail.errors);
            this.logEvent(`Validation failed: ${errors.join(', ')}`);
        },
        
        handleReset(event) {
            this.logEvent('Form reset');
        }
    };
}
</script>
```

### AJAX Request Events

```html
<div x-data="ajaxForm()">
    <noundry-element 
        x-ref="form"
        @noundry-request-start="requestStart"
        @noundry-request-success="requestSuccess"
        @noundry-request-error="requestError"
        @noundry-submit="handleSubmit"
    >
        <form action="/api/contact" method="POST">
            <input type="text" name="name" required>
            <input type="email" name="email" required>
            <textarea name="message" required></textarea>
            
            <button type="submit" :disabled="isSubmitting">
                <span x-show="!isSubmitting">Send Message</span>
                <span x-show="isSubmitting">Sending...</span>
            </button>
        </form>
    </noundry-element>
    
    <!-- Status messages -->
    <div x-show="message" 
         :class="messageType === 'success' ? 'success' : 'error'"
         x-text="message"></div>
</div>

<script>
function ajaxForm() {
    return {
        isSubmitting: false,
        message: '',
        messageType: 'success',
        
        requestStart() {
            this.isSubmitting = true;
            this.message = '';
        },
        
        requestSuccess(event) {
            this.isSubmitting = false;
            this.message = 'Message sent successfully!';
            this.messageType = 'success';
            
            // Reset form after success
            this.$refs.form.reset();
        },
        
        requestError(event) {
            this.isSubmitting = false;
            this.message = 'Failed to send message. Please try again.';
            this.messageType = 'error';
        },
        
        handleSubmit(event) {
            // Custom submission logic if needed
            console.log('Form data:', event.detail.values);
        }
    };
}
</script>
```

## State Management

### Form State Tracking

```html
<div x-data="formStateTracker()">
    <noundry-element 
        x-ref="form"
        @noundry-input="updateFormState"
        @noundry-change="updateFormState"
    >
        <form>
            <input type="text" name="firstName" required>
            <input type="text" name="lastName" required>
            <input type="email" name="email" required>
            <input type="tel" name="phone">
        </form>
    </noundry-element>
    
    <!-- Form state indicators -->
    <div class="form-status">
        <div class="status-item" :class="{ active: formState.isDirty }">
            <span class="indicator"></span>
            <span>Modified</span>
        </div>
        <div class="status-item" :class="{ active: formState.isValid }">
            <span class="indicator"></span>
            <span>Valid</span>
        </div>
        <div class="status-item" :class="{ active: completeness > 0.8 }">
            <span class="indicator"></span>
            <span>Nearly Complete</span>
        </div>
    </div>
    
    <!-- Progress bar -->
    <div class="progress-bar">
        <div class="progress-fill" :style="`width: ${completeness * 100}%`"></div>
        <span class="progress-text" x-text="`${Math.round(completeness * 100)}% Complete`"></span>
    </div>
    
    <!-- Field-by-field status -->
    <div class="field-status">
        <template x-for="(status, field) in fieldStatus" :key="field">
            <div class="field-item">
                <span x-text="field"></span>
                <span :class="status.valid ? 'valid' : 'invalid'" x-text="status.valid ? '✓' : '✗'"></span>
                <span x-show="status.error" class="error" x-text="status.error"></span>
            </div>
        </template>
    </div>
</div>

<script>
function formStateTracker() {
    return {
        formState: {
            isDirty: false,
            isValid: false,
            isSubmitting: false,
            values: {},
            errors: {}
        },
        
        get completeness() {
            const values = this.formState.values || {};
            const requiredFields = ['firstName', 'lastName', 'email'];
            const completedFields = requiredFields.filter(field => values[field]?.trim());
            return completedFields.length / requiredFields.length;
        },
        
        get fieldStatus() {
            const values = this.formState.values || {};
            const errors = this.formState.errors || {};
            const status = {};
            
            Object.keys(values).forEach(field => {
                status[field] = {
                    valid: !errors[field] && values[field]?.trim(),
                    error: errors[field]
                };
            });
            
            return status;
        },
        
        updateFormState() {
            if (this.$refs.form && this.$refs.form.$noundry) {
                this.formState = { ...this.$refs.form.$noundry };
            }
        }
    };
}
</script>
```

### Multi-step Forms

```html
<div x-data="multiStepForm()">
    <div class="step-indicator">
        <template x-for="(step, index) in steps" :key="index">
            <div class="step" :class="getStepClass(index)">
                <span x-text="index + 1"></span>
                <span x-text="step.title"></span>
            </div>
        </template>
    </div>
    
    <noundry-element x-ref="form" @noundry-input="updateFormState">
        <form>
            <!-- Step 1: Personal Info -->
            <div x-show="currentStep === 0" x-transition>
                <h2>Personal Information</h2>
                <input type="text" name="firstName" required x-model="formData.firstName">
                <input type="text" name="lastName" required x-model="formData.lastName">
                <input type="email" name="email" required x-model="formData.email">
            </div>
            
            <!-- Step 2: Address -->
            <div x-show="currentStep === 1" x-transition>
                <h2>Address Information</h2>
                <input type="text" name="street" required x-model="formData.street">
                <input type="text" name="city" required x-model="formData.city">
                <input type="text" name="zipCode" required x-model="formData.zipCode">
            </div>
            
            <!-- Step 3: Preferences -->
            <div x-show="currentStep === 2" x-transition>
                <h2>Preferences</h2>
                <select name="newsletter" x-model="formData.newsletter">
                    <option value="yes">Yes, send me updates</option>
                    <option value="no">No, thank you</option>
                </select>
                <textarea name="comments" x-model="formData.comments"></textarea>
            </div>
        </form>
    </noundry-element>
    
    <!-- Navigation buttons -->
    <div class="form-navigation">
        <button type="button" @click="previousStep" :disabled="currentStep === 0">
            Previous
        </button>
        
        <button type="button" @click="nextStep" 
                x-show="currentStep < steps.length - 1"
                :disabled="!isStepValid(currentStep)">
            Next
        </button>
        
        <button type="submit" @click="submitForm" 
                x-show="currentStep === steps.length - 1"
                :disabled="!allStepsValid">
            Submit
        </button>
    </div>
</div>

<script>
function multiStepForm() {
    return {
        currentStep: 0,
        steps: [
            { title: 'Personal Info', fields: ['firstName', 'lastName', 'email'] },
            { title: 'Address', fields: ['street', 'city', 'zipCode'] },
            { title: 'Preferences', fields: [] }
        ],
        formData: {
            firstName: '', lastName: '', email: '',
            street: '', city: '', zipCode: '',
            newsletter: 'yes', comments: ''
        },
        formState: { isValid: false, errors: {} },
        
        getStepClass(index) {
            if (index < this.currentStep) return 'completed';
            if (index === this.currentStep) return 'active';
            return 'upcoming';
        },
        
        isStepValid(stepIndex) {
            const step = this.steps[stepIndex];
            return step.fields.every(field => {
                return this.formData[field]?.trim() && !this.formState.errors[field];
            });
        },
        
        get allStepsValid() {
            return this.steps.every((_, index) => this.isStepValid(index));
        },
        
        nextStep() {
            if (this.currentStep < this.steps.length - 1 && this.isStepValid(this.currentStep)) {
                this.currentStep++;
            }
        },
        
        previousStep() {
            if (this.currentStep > 0) {
                this.currentStep--;
            }
        },
        
        updateFormState() {
            if (this.$refs.form && this.$refs.form.$noundry) {
                this.formState = { ...this.$refs.form.$noundry };
                this.formData = { ...this.formData, ...this.formState.values };
            }
        },
        
        submitForm() {
            if (this.allStepsValid) {
                this.$refs.form.requestSubmit();
            }
        }
    };
}
</script>
```

## Form Patterns

### Dynamic Form Fields

```html
<div x-data="dynamicForm()">
    <noundry-element x-ref="form">
        <form>
            <!-- Basic info -->
            <input type="text" name="name" required>
            <input type="email" name="email" required>
            
            <!-- Dynamic skills -->
            <div class="dynamic-section">
                <h3>Skills</h3>
                <template x-for="(skill, index) in skills" :key="skill.id">
                    <div class="skill-entry">
                        <input type="text" :name="`skills[${index}][name]`" 
                               x-model="skill.name" placeholder="Skill name" required>
                        <select :name="`skills[${index}][level]`" x-model="skill.level">
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                        <button type="button" @click="removeSkill(index)">Remove</button>
                    </div>
                </template>
                <button type="button" @click="addSkill">Add Skill</button>
            </div>
            
            <!-- Conditional fields -->
            <div x-show="showExperienceSection">
                <h3>Experience</h3>
                <textarea name="experience" x-model="experience" 
                          placeholder="Describe your experience..."></textarea>
            </div>
            
            <button type="submit">Submit</button>
        </form>
    </noundry-element>
</div>

<script>
function dynamicForm() {
    return {
        skills: [
            { id: 1, name: '', level: 'beginner' }
        ],
        experience: '',
        nextSkillId: 2,
        
        get showExperienceSection() {
            return this.skills.some(skill => skill.level === 'advanced');
        },
        
        addSkill() {
            this.skills.push({
                id: this.nextSkillId++,
                name: '',
                level: 'beginner'
            });
        },
        
        removeSkill(index) {
            if (this.skills.length > 1) {
                this.skills.splice(index, 1);
            }
        }
    };
}
</script>
```

### Real-time Validation Feedback

```html
<div x-data="validationFeedback()">
    <noundry-element 
        x-ref="form"
        @noundry-input="handleInput"
        @noundry-change="handleChange"
    >
        <form>
            <div class="form-field">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" 
                       x-model="username" 
                       @input.debounce.500ms="checkUsername"
                       required minlength="3">
                
                <div class="field-feedback">
                    <div x-show="usernameStatus.checking" class="checking">
                        Checking availability...
                    </div>
                    <div x-show="usernameStatus.available === true" class="success">
                        ✓ Username is available
                    </div>
                    <div x-show="usernameStatus.available === false" class="error">
                        ✗ Username is already taken
                    </div>
                </div>
            </div>
            
            <div class="form-field">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" 
                       x-model="password" required>
                
                <!-- Password strength indicator -->
                <div class="password-strength">
                    <div class="strength-bar">
                        <div class="strength-fill" 
                             :class="passwordStrength.class"
                             :style="`width: ${passwordStrength.percentage}%`"></div>
                    </div>
                    <div class="strength-text" x-text="passwordStrength.text"></div>
                </div>
                
                <!-- Password requirements -->
                <ul class="password-requirements">
                    <li :class="passwordChecks.length ? 'valid' : 'invalid'">
                        At least 8 characters
                    </li>
                    <li :class="passwordChecks.uppercase ? 'valid' : 'invalid'">
                        One uppercase letter
                    </li>
                    <li :class="passwordChecks.lowercase ? 'valid' : 'invalid'">
                        One lowercase letter
                    </li>
                    <li :class="passwordChecks.number ? 'valid' : 'invalid'">
                        One number
                    </li>
                </ul>
            </div>
            
            <button type="submit" :disabled="!canSubmit">Create Account</button>
        </form>
    </noundry-element>
</div>

<script>
function validationFeedback() {
    return {
        username: '',
        password: '',
        usernameStatus: {
            checking: false,
            available: null
        },
        
        get passwordChecks() {
            return {
                length: this.password.length >= 8,
                uppercase: /[A-Z]/.test(this.password),
                lowercase: /[a-z]/.test(this.password),
                number: /[0-9]/.test(this.password)
            };
        },
        
        get passwordStrength() {
            const checks = Object.values(this.passwordChecks);
            const score = checks.filter(Boolean).length;
            
            const levels = [
                { percentage: 0, class: 'weak', text: 'Very Weak' },
                { percentage: 25, class: 'weak', text: 'Weak' },
                { percentage: 50, class: 'fair', text: 'Fair' },
                { percentage: 75, class: 'good', text: 'Good' },
                { percentage: 100, class: 'strong', text: 'Strong' }
            ];
            
            return levels[score] || levels[0];
        },
        
        get canSubmit() {
            return this.username.length >= 3 && 
                   this.usernameStatus.available === true &&
                   Object.values(this.passwordChecks).every(Boolean);
        },
        
        async checkUsername() {
            if (this.username.length < 3) return;
            
            this.usernameStatus.checking = true;
            this.usernameStatus.available = null;
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Mock availability check
                const taken = ['admin', 'user', 'test'];
                this.usernameStatus.available = !taken.includes(this.username.toLowerCase());
            } catch (error) {
                this.usernameStatus.available = null;
            } finally {
                this.usernameStatus.checking = false;
            }
        },
        
        handleInput(event) {
            // Handle other input events
        },
        
        handleChange(event) {
            // Handle change events
        }
    };
}
</script>
```

## Advanced Examples

### File Upload with Preview

```html
<div x-data="fileUploadForm()">
    <noundry-element x-ref="form">
        <form>
            <div class="file-upload">
                <input type="file" name="images" multiple accept="image/*" 
                       @change="handleFileSelect" style="display: none;">
                
                <div class="upload-area" 
                     @click="$event.target.previousElementSibling.click()"
                     @dragover.prevent 
                     @drop.prevent="handleFileDrop">
                    <div x-show="files.length === 0">
                        <p>Click to select images or drag and drop</p>
                    </div>
                    
                    <div x-show="files.length > 0" class="file-previews">
                        <template x-for="(file, index) in files" :key="index">
                            <div class="file-preview">
                                <img :src="file.preview" :alt="file.name">
                                <div class="file-info">
                                    <span x-text="file.name"></span>
                                    <span x-text="formatFileSize(file.size)"></span>
                                    <button type="button" @click="removeFile(index)">Remove</button>
                                </div>
                                
                                <!-- Upload progress -->
                                <div x-show="file.uploading" class="upload-progress">
                                    <div class="progress-bar">
                                        <div class="progress-fill" :style="`width: ${file.progress}%`"></div>
                                    </div>
                                    <span x-text="`${file.progress}%`"></span>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
            
            <button type="submit" :disabled="!canSubmit">Upload Images</button>
        </form>
    </noundry-element>
</div>

<script>
function fileUploadForm() {
    return {
        files: [],
        
        get canSubmit() {
            return this.files.length > 0 && 
                   this.files.every(file => !file.uploading);
        },
        
        handleFileSelect(event) {
            this.addFiles(Array.from(event.target.files));
        },
        
        handleFileDrop(event) {
            this.addFiles(Array.from(event.dataTransfer.files));
        },
        
        addFiles(newFiles) {
            newFiles.forEach(file => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.files.push({
                            name: file.name,
                            size: file.size,
                            preview: e.target.result,
                            file: file,
                            uploading: false,
                            progress: 0
                        });
                    };
                    reader.readAsDataURL(file);
                }
            });
        },
        
        removeFile(index) {
            this.files.splice(index, 1);
        },
        
        formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
    };
}
</script>
```

### Search with Autocomplete

```html
<div x-data="searchForm()">
    <noundry-element x-ref="form">
        <form>
            <div class="search-field">
                <label for="location">Location</label>
                <div class="autocomplete-wrapper">
                    <input type="text" id="location" name="location" 
                           x-model="searchQuery"
                           @input.debounce.300ms="searchLocations"
                           @keydown.arrow-down.prevent="selectNext"
                           @keydown.arrow-up.prevent="selectPrevious"
                           @keydown.enter.prevent="selectCurrent"
                           @keydown.escape="clearSuggestions"
                           autocomplete="off"
                           placeholder="Search for a location...">
                    
                    <div x-show="suggestions.length > 0" class="suggestions">
                        <template x-for="(suggestion, index) in suggestions" :key="suggestion.id">
                            <div class="suggestion-item" 
                                 :class="{ active: index === selectedIndex }"
                                 @click="selectSuggestion(suggestion)">
                                <div class="suggestion-main" x-text="suggestion.name"></div>
                                <div class="suggestion-sub" x-text="suggestion.region"></div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
            
            <!-- Show selected location -->
            <div x-show="selectedLocation" class="selected-location">
                <h3>Selected Location:</h3>
                <p x-text="selectedLocation?.name"></p>
                <p x-text="selectedLocation?.region"></p>
                <button type="button" @click="clearSelection">Clear</button>
            </div>
            
            <button type="submit" :disabled="!selectedLocation">Search</button>
        </form>
    </noundry-element>
</div>

<script>
function searchForm() {
    return {
        searchQuery: '',
        suggestions: [],
        selectedIndex: -1,
        selectedLocation: null,
        searchTimeout: null,
        
        async searchLocations() {
            if (this.searchQuery.length < 2) {
                this.suggestions = [];
                return;
            }
            
            clearTimeout(this.searchTimeout);
            
            this.searchTimeout = setTimeout(async () => {
                try {
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 300));
                    
                    // Mock suggestions
                    this.suggestions = [
                        { id: 1, name: 'New York, NY', region: 'United States' },
                        { id: 2, name: 'New Orleans, LA', region: 'United States' },
                        { id: 3, name: 'Newcastle, UK', region: 'United Kingdom' }
                    ].filter(item => 
                        item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
                    );
                    
                    this.selectedIndex = -1;
                } catch (error) {
                    this.suggestions = [];
                }
            }, 300);
        },
        
        selectNext() {
            if (this.selectedIndex < this.suggestions.length - 1) {
                this.selectedIndex++;
            }
        },
        
        selectPrevious() {
            if (this.selectedIndex > 0) {
                this.selectedIndex--;
            }
        },
        
        selectCurrent() {
            if (this.selectedIndex >= 0 && this.suggestions[this.selectedIndex]) {
                this.selectSuggestion(this.suggestions[this.selectedIndex]);
            }
        },
        
        selectSuggestion(suggestion) {
            this.selectedLocation = suggestion;
            this.searchQuery = suggestion.name;
            this.suggestions = [];
            this.selectedIndex = -1;
            
            // Update the form
            this.$refs.form.setValues({ location: suggestion.name });
        },
        
        clearSuggestions() {
            this.suggestions = [];
            this.selectedIndex = -1;
        },
        
        clearSelection() {
            this.selectedLocation = null;
            this.searchQuery = '';
            this.$refs.form.setValues({ location: '' });
        }
    };
}
</script>
```

## Best Practices

### 1. Initialize Form State

```javascript
function myForm() {
    return {
        // Initialize data structure
        formData: {
            name: '',
            email: '',
            preferences: []
        },
        
        init() {
            // Set up form after Alpine initializes
            this.$nextTick(() => {
                this.syncWithForm();
            });
        },
        
        syncWithForm() {
            if (this.$refs.form && this.$refs.form.$noundry) {
                // Sync Alpine data with form state
                this.formData = { ...this.$refs.form.$noundry.values };
            }
        }
    };
}
```

### 2. Handle Form State Updates

```javascript
function formComponent() {
    return {
        formState: {
            isDirty: false,
            isValid: false,
            errors: {}
        },
        
        updateFormState(event) {
            // Always update from the form's state
            this.formState = { ...this.$refs.form.$noundry };
        },
        
        // Use computed properties for derived state
        get hasErrors() {
            return Object.keys(this.formState.errors).length > 0;
        },
        
        get canSubmit() {
            return this.formState.isValid && !this.formState.isSubmitting;
        }
    };
}
```

### 3. Debounce Expensive Operations

```javascript
function searchForm() {
    return {
        searchQuery: '',
        
        init() {
            // Set up debounced functions
            this.debouncedSearch = this.debounce(this.performSearch, 300);
        },
        
        handleInput() {
            this.debouncedSearch();
        },
        
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        performSearch() {
            // Expensive search operation
        }
    };
}
```

### 4. Clean Up Resources

```javascript
function formWithCleanup() {
    return {
        intervals: [],
        timeouts: [],
        
        startPeriodicTask() {
            const interval = setInterval(() => {
                // Periodic task
            }, 1000);
            
            this.intervals.push(interval);
        },
        
        destroy() {
            // Clean up when component is destroyed
            this.intervals.forEach(clearInterval);
            this.timeouts.forEach(clearTimeout);
        }
    };
}
```

## Performance Tips

### 1. Minimize Reactive Updates

```html
<!-- Good: Update on blur/change -->
<input x-model.lazy="formData.description">

<!-- Good: Debounced updates -->
<input x-model.debounce.500ms="formData.search">

<!-- Avoid: Updates on every keystroke -->
<input x-model="formData.realTimeField">
```

### 2. Use Event Delegation

```javascript
// Instead of multiple individual listeners
function efficientForm() {
    return {
        handleFormEvent(event) {
            // Handle all form events in one place
            const { field, value } = event.detail;
            
            switch (field) {
                case 'username':
                    this.handleUsername(value);
                    break;
                case 'email':
                    this.handleEmail(value);
                    break;
            }
        }
    };
}
```

### 3. Lazy Load Heavy Components

```html
<div x-data="{ showAdvanced: false }">
    <button @click="showAdvanced = true">Show Advanced Options</button>
    
    <!-- Only initialize when needed -->
    <template x-if="showAdvanced">
        <div x-data="advancedForm()">
            <!-- Heavy form component -->
        </div>
    </template>
</div>
```

This comprehensive guide covers all aspects of integrating Noundry Elements with Alpine.js, from basic setup to advanced patterns, ensuring you can build reactive, performant forms with minimal code.