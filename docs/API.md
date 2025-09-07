# Noundry Elements API Reference

Complete API documentation for Noundry Elements form validation library.

## Table of Contents

- [NoundryElement Class](#noundryelement-class)
- [Properties](#properties)
- [Methods](#methods)
- [Events](#events)
- [Attributes](#attributes)
- [NoundryUtils Class](#noundryutils-class)
- [TypeScript Definitions](#typescript-definitions)

## NoundryElement Class

The main class that extends `HTMLElement` to provide form validation functionality.

### Constructor

```javascript
new NoundryElement()
```

Creates a new Noundry Element instance. This is automatically called when using the `<noundry-element>` tag.

## Properties

### State Properties

#### `$noundry`
**Type**: `Object`  
**Read-only**: Yes

Returns the current form state object with the following properties:

```javascript
const state = formElement.$noundry;

// State properties
state.values        // Current form values (Object)
state.errors        // Validation errors (Object)
state.isDirty       // Form has been modified (Boolean)
state.isValid       // Form is currently valid (Boolean)  
state.isSubmitting  // Form is being submitted (Boolean)
```

**Example:**
```javascript
const form = document.querySelector('noundry-element');
const { values, errors, isDirty, isValid, isSubmitting } = form.$noundry;

console.log('Form Values:', values);
console.log('Validation Errors:', errors);
console.log('Is Form Dirty:', isDirty);
console.log('Is Form Valid:', isValid);
console.log('Is Submitting:', isSubmitting);
```

### Internal Properties

#### `initialValues`
**Type**: `Object`  
**Read-only**: Yes

The original form values captured when the form was first initialized.

#### `currentValues`
**Type**: `Object`  
**Read-only**: Yes

Current form values as extracted from form fields.

#### `errors`
**Type**: `Object`  
**Read-only**: Yes

Object containing current validation errors, keyed by field name.

#### `validationRules`
**Type**: `Object`  
**Read-only**: Yes

Object containing custom validation rules added via `setValidationRule()`.

## Methods

### Form Control Methods

#### `reset()`
**Returns**: `void`

Resets the form to its initial state, clearing all values and errors.

```javascript
formElement.reset();
```

**Behavior:**
- Calls native `form.reset()`
- Clears all validation errors
- Resets form state flags
- Fires `noundry-reset` event

#### `setValues(values)`
**Parameters**: 
- `values` (Object): Key-value pairs of field values to set

**Returns**: `void`

Programmatically sets form field values.

```javascript
formElement.setValues({
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
});
```

**Behavior:**
- Sets values on corresponding form fields
- Updates form state
- Triggers validation
- Updates dirty state

#### `getValues()`
**Returns**: `Object`

Returns current form values as a plain object.

```javascript
const values = formElement.getValues();
console.log(values); // { name: 'John Doe', email: 'john@example.com' }
```

#### `requestSubmit()`
**Returns**: `void`

Triggers form submission programmatically.

```javascript
formElement.requestSubmit();
```

**Behavior:**
- Validates the form
- Fires submission events
- Handles AJAX submission if configured

### Validation Methods

#### `setValidationRule(fieldName, validator)`
**Parameters**:
- `fieldName` (String): Name of the field to validate
- `validator` (Function): Validation function

**Returns**: `void`

Adds a custom validation rule for a specific field.

```javascript
formElement.setValidationRule('password', (value, allValues) => {
    if (!value || value.length < 8) {
        return 'Password must be at least 8 characters long';
    }
    
    if (!/[A-Z]/.test(value)) {
        return 'Password must contain at least one uppercase letter';
    }
    
    if (!/[0-9]/.test(value)) {
        return 'Password must contain at least one number';
    }
    
    return null; // Valid - return null for no error
});

// Cross-field validation
formElement.setValidationRule('confirmPassword', (value, allValues) => {
    if (value !== allValues.password) {
        return 'Passwords do not match';
    }
    return null;
});
```

**Validator Function Signature:**
```javascript
(value: any, allValues: Object) => string | null
```

- `value`: Current value of the field being validated
- `allValues`: Object containing all current form values
- **Returns**: Error message string if invalid, `null` if valid

### Internal Methods

#### `validateField(field)`
**Parameters**: 
- `field` (HTMLElement): Form field element to validate

**Returns**: `void`

Validates a single form field and updates error display.

#### `validateAll()`
**Returns**: `void`

Validates all form fields.

#### `updateState()`
**Returns**: `void`

Updates the form's data attributes and state properties.

## Events

All events are dispatched on the `<noundry-element>` and bubble up the DOM tree.

### Form Interaction Events

#### `noundry-input`
Fired when any form field receives input.

**Event Detail:**
```javascript
{
    field: string,    // Field name
    value: any,       // Field value  
    values: Object    // All form values
}
```

**Example:**
```javascript
formElement.addEventListener('noundry-input', (event) => {
    console.log('Field changed:', event.detail.field);
    console.log('New value:', event.detail.value);
    console.log('All values:', event.detail.values);
});
```

#### `noundry-change`
Fired when any form field value changes (on blur/change events).

**Event Detail:**
```javascript
{
    field: string,    // Field name
    value: any,       // Field value
    values: Object    // All form values
}
```

### Form Submission Events

#### `noundry-submit`
Fired when the form is submitted and validation passes.

**Event Detail:**
```javascript
{
    values: Object,      // Form values as object
    formData: FormData,  // FormData instance
    preventDefault: Function // Call to prevent default submission
}
```

**Example:**
```javascript
formElement.addEventListener('noundry-submit', (event) => {
    console.log('Form submitted with values:', event.detail.values);
    
    // Custom submission handling
    event.preventDefault();
    
    // Your custom submission logic here
    submitToAPI(event.detail.values);
});
```

#### `noundry-invalid`
Fired when form submission fails validation.

**Event Detail:**
```javascript
{
    errors: Object    // Validation errors by field name
}
```

**Example:**
```javascript
formElement.addEventListener('noundry-invalid', (event) => {
    console.log('Validation errors:', event.detail.errors);
    
    // Show user-friendly error message
    showErrorToast('Please fix the form errors before submitting');
});
```

#### `noundry-reset`
Fired when the form is reset.

**Event Detail:** None

### AJAX Request Events

#### `noundry-request-start`
Fired when an AJAX form submission begins.

**Event Detail:** None

#### `noundry-request-success`
Fired when an AJAX form submission succeeds.

**Event Detail:**
```javascript
{
    response: Response    // Fetch Response object
}
```

#### `noundry-request-error`
Fired when an AJAX form submission fails.

**Event Detail:**
```javascript
{
    error: Error    // Error object
}
```

**Example:**
```javascript
formElement.addEventListener('noundry-request-error', (event) => {
    console.error('Form submission failed:', event.detail.error);
    showErrorMessage('Failed to submit form. Please try again.');
});
```

## Attributes

Configure form behavior using HTML attributes on the `<noundry-element>`.

### `error-disable-submit`
**Type**: Boolean attribute  
**Default**: `false`

When present, disables the submit button when the form has validation errors.

```html
<noundry-element error-disable-submit>
    <form>
        <input type="email" name="email" required>
        <button type="submit">Submit</button>
    </form>
</noundry-element>
```

### `reset-on-submit`
**Type**: Boolean attribute  
**Default**: `false`

When present, automatically resets the form after successful submission.

```html
<noundry-element reset-on-submit>
    <form>
        <input type="text" name="message" required>
        <button type="submit">Send</button>
    </form>
</noundry-element>
```

### `default-submit`
**Type**: String attribute  
**Default**: `"false"`

Controls whether to allow default browser form submission behavior.

```html
<!-- Disable AJAX, use traditional form submission -->
<noundry-element default-submit="true">
    <form action="/contact" method="POST">
        <input type="text" name="name" required>
        <button type="submit">Submit</button>
    </form>
</noundry-element>
```

### Data Attributes (Read-only)

These attributes are automatically set by Noundry Elements to reflect form state:

#### `data-dirty`
**Type**: String (`"true"` | `"false"`)

Indicates if the form has been modified from its initial state.

#### `data-valid`
**Type**: String (`"true"` | `"false"`)

Indicates if the form currently passes all validation rules.

#### `data-submitting`
**Type**: String (`"true"` | `"false"`)

Indicates if the form is currently being submitted.

**CSS Usage:**
```css
/* Style based on form state */
noundry-element[data-dirty="true"] {
    border-left: 4px solid orange;
}

noundry-element[data-valid="false"] {
    border-left: 4px solid red;
}

noundry-element[data-submitting="true"] {
    opacity: 0.7;
    pointer-events: none;
}
```

## Input Field Attributes

### Error Message Attributes

#### `data-error`
**Type**: String

Default error message for the field.

```html
<input type="email" name="email" required data-error="Please enter your email address">
```

#### `data-error-{validityKey}`
**Type**: String

Specific error messages for different validation states.

```html
<input 
    type="email" 
    name="email" 
    required
    data-error-valuemissing="Email is required"
    data-error-typemismatch="Please enter a valid email address"
>
```

**Supported Validity Keys:**
- `valuemissing` - Required field is empty
- `typemismatch` - Value doesn't match input type
- `patternmismatch` - Value doesn't match pattern
- `toolong` - Value exceeds maxlength  
- `tooshort` - Value is shorter than minlength
- `rangeunderflow` - Value is less than min
- `rangeoverflow` - Value is greater than max
- `stepmismatch` - Value doesn't match step
- `badinput` - Browser can't convert input
- `customerror` - Custom validation error

### Error Display Control

#### `data-error-for`
**Type**: String  
**Usage**: On error display elements

Specifies which field an error element is for.

```html
<input type="email" name="email" required>
<div data-error-for="email" class="custom-error-display"></div>
```

If no element with `data-error-for` is found, Noundry Elements automatically creates one.

## NoundryUtils Class

Utility functions used internally by Noundry Elements, also available for external use.

### `NoundryUtils.getValidityKey(element)`
**Parameters**: 
- `element` (HTMLElement): Form field element

**Returns**: `string | null`

Returns the first validity state key that is true, or null if valid.

```javascript
const input = document.querySelector('input[type="email"]');
const validityKey = NoundryUtils.getValidityKey(input);
console.log(validityKey); // 'typemismatch' if invalid email
```

### `NoundryUtils.getFieldError(element)`
**Parameters**:
- `element` (HTMLElement): Form field element

**Returns**: `string`

Returns the appropriate error message for the field's current validity state.

```javascript
const input = document.querySelector('input[name="email"]');
const errorMessage = NoundryUtils.getFieldError(input);
```

### `NoundryUtils.flattenObject(obj, prefix, result)`
**Parameters**:
- `obj` (Object): Object to flatten
- `prefix` (String): Key prefix (optional)
- `result` (Object): Result object (optional)

**Returns**: `Object`

Flattens nested objects into dot-notation keys.

```javascript
const nested = {
    user: {
        profile: {
            name: 'John'
        }
    }
};

const flattened = NoundryUtils.flattenObject(nested);
// Result: { 'user.profile.name': 'John' }
```

### `NoundryUtils.getAtPath(obj, path)`
**Parameters**:
- `obj` (Object): Source object
- `path` (String): Dot-notation path

**Returns**: `any`

Gets a value from an object using dot notation.

```javascript
const obj = { user: { profile: { name: 'John' } } };
const name = NoundryUtils.getAtPath(obj, 'user.profile.name');
// Result: 'John'
```

### `NoundryUtils.setAtPath(obj, path, value)`
**Parameters**:
- `obj` (Object): Target object
- `path` (String): Dot-notation path
- `value` (any): Value to set

**Returns**: `void`

Sets a value in an object using dot notation.

```javascript
const obj = {};
NoundryUtils.setAtPath(obj, 'user.profile.name', 'John');
// Result: { user: { profile: { name: 'John' } } }
```

### `NoundryUtils.valuesToFormData(values)`
**Parameters**:
- `values` (Object): Values object

**Returns**: `FormData`

Converts a values object to FormData, handling nested objects and files.

```javascript
const values = {
    name: 'John',
    profile: { age: 30 },
    avatar: fileObject
};

const formData = NoundryUtils.valuesToFormData(values);
```

### `NoundryUtils.deepCompare(a, b)`
**Parameters**:
- `a` (any): First value
- `b` (any): Second value

**Returns**: `boolean`

Performs deep comparison of two values.

```javascript
const isEqual = NoundryUtils.deepCompare(
    { a: 1, b: { c: 2 } },
    { a: 1, b: { c: 2 } }
);
// Result: true
```

## TypeScript Definitions

Noundry Elements includes complete TypeScript definitions.

### Types

```typescript
interface NoundryState {
    values: Record<string, any>;
    errors: Record<string, string>;
    isDirty: boolean;
    isValid: boolean;
    isSubmitting: boolean;
}

type ValidationRule = (value: any, allValues: Record<string, any>) => string | null;

interface NoundryEventDetail {
    field?: string;
    value?: any;
    values?: Record<string, any>;
    errors?: Record<string, string>;
    formData?: FormData;
    response?: Response;
    error?: Error;
}
```

### Class Definition

```typescript
declare class NoundryElement extends HTMLElement {
    readonly $noundry: NoundryState;
    
    reset(): void;
    setValues(values: Record<string, any>): void;
    getValues(): Record<string, any>;
    setValidationRule(fieldName: string, validator: ValidationRule): void;
    requestSubmit(): void;
    
    // Event listeners
    addEventListener(type: 'noundry-input', listener: (event: CustomEvent<NoundryEventDetail>) => void): void;
    addEventListener(type: 'noundry-change', listener: (event: CustomEvent<NoundryEventDetail>) => void): void;
    addEventListener(type: 'noundry-submit', listener: (event: CustomEvent<NoundryEventDetail>) => void): void;
    addEventListener(type: 'noundry-invalid', listener: (event: CustomEvent<NoundryEventDetail>) => void): void;
    addEventListener(type: 'noundry-reset', listener: (event: CustomEvent) => void): void;
    addEventListener(type: 'noundry-request-start', listener: (event: CustomEvent) => void): void;
    addEventListener(type: 'noundry-request-success', listener: (event: CustomEvent<NoundryEventDetail>) => void): void;
    addEventListener(type: 'noundry-request-error', listener: (event: CustomEvent<NoundryEventDetail>) => void): void;
}

declare global {
    interface HTMLElementTagNameMap {
        'noundry-element': NoundryElement;
    }
}
```

### Usage in TypeScript

```typescript
const form = document.querySelector('noundry-element') as NoundryElement;

form.addEventListener('noundry-submit', (event) => {
    // event.detail is properly typed
    console.log(event.detail.values);
});

// State is properly typed
const { values, errors, isValid } = form.$noundry;

// Method calls are type-checked
form.setValues({ name: 'John' });
form.setValidationRule('email', (value: string) => {
    return /\S+@\S+\.\S+/.test(value) ? null : 'Invalid email';
});
```

## Browser Compatibility

### Supported Browsers
- Chrome/Edge 67+
- Firefox 63+
- Safari 10.3+

### Polyfills Required for Older Browsers
```html
<!-- For IE11 and older browsers -->
<script src="https://unpkg.com/@webcomponents/custom-elements@1.4.3/custom-elements.min.js"></script>
<script src="https://unpkg.com/core-js@3/stable/index.js"></script>
```

## Performance Notes

- **Lazy Validation**: Fields are only validated when interacted with
- **Debounced Updates**: State updates are debounced to prevent excessive re-renders
- **Memory Management**: Event listeners are properly cleaned up when elements are removed
- **Minimal DOM Manipulation**: Only updates DOM when necessary

## Security Considerations

- **XSS Protection**: Error messages are displayed as text content, not HTML
- **Input Sanitization**: All user input is properly escaped
- **CSRF Compatibility**: Works with CSRF tokens in forms
- **Content Security Policy**: No `eval()` or inline scripts used