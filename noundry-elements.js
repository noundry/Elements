/**
 * Noundry Elements - A plain JavaScript form validation library
 * Inspired by Informel but built for vanilla JS and Alpine.js
 */

class NoundryUtils {
    static getValidityKey(element) {
        if (!element.validity) return null;
        
        const validityKeys = [
            'valueMissing', 'typeMismatch', 'patternMismatch', 
            'tooLong', 'tooShort', 'rangeUnderflow', 'rangeOverflow', 
            'stepMismatch', 'badInput', 'customError'
        ];
        
        return validityKeys.find(key => element.validity[key]) || null;
    }

    static getFieldError(element) {
        const validityKey = this.getValidityKey(element);
        if (!validityKey) return '';
        
        // Check for custom error message attributes
        const customErrorAttr = element.getAttribute(`data-error-${validityKey.toLowerCase()}`);
        if (customErrorAttr) return customErrorAttr;
        
        const defaultErrorAttr = element.getAttribute('data-error');
        if (defaultErrorAttr) return defaultErrorAttr;
        
        // Fall back to native validation message
        return element.validationMessage;
    }

    static flattenObject(obj, prefix = '', result = {}) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const newKey = prefix ? `${prefix}.${key}` : key;
                
                if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key]) && !(obj[key] instanceof File)) {
                    this.flattenObject(obj[key], newKey, result);
                } else {
                    result[newKey] = obj[key];
                }
            }
        }
        return result;
    }

    static getAtPath(obj, path) {
        return path.split('.').reduce((current, key) => current && current[key], obj);
    }

    static setAtPath(obj, path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((current, key) => {
            if (!(key in current)) current[key] = {};
            return current[key];
        }, obj);
        target[lastKey] = value;
    }

    static valuesToFormData(values) {
        const formData = new FormData();
        const flattened = this.flattenObject(values);
        
        for (const [key, value] of Object.entries(flattened)) {
            if (value instanceof File) {
                formData.append(key, value);
            } else if (Array.isArray(value)) {
                value.forEach(item => formData.append(key, item));
            } else if (value !== null && value !== undefined) {
                formData.append(key, String(value));
            }
        }
        
        return formData;
    }

    static deepCompare(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (Array.isArray(a) && Array.isArray(b)) {
            if (a.length !== b.length) return false;
            return a.every((val, index) => this.deepCompare(val, b[index]));
        }
        if (typeof a === 'object' && typeof b === 'object') {
            const keysA = Object.keys(a);
            const keysB = Object.keys(b);
            if (keysA.length !== keysB.length) return false;
            return keysA.every(key => this.deepCompare(a[key], b[key]));
        }
        return false;
    }
}

class NoundryElement extends HTMLElement {
    constructor() {
        super();
        this.initialValues = {};
        this.currentValues = {};
        this.errors = {};
        this.isDirty = false;
        this.isValid = true;
        this.isSubmitting = false;
        this.validationRules = {};
        this.errorElements = new Map();
        
        this.boundHandleInput = this.handleInput.bind(this);
        this.boundHandleChange = this.handleChange.bind(this);
        this.boundHandleSubmit = this.handleSubmit.bind(this);
        this.boundHandleInvalid = this.handleInvalid.bind(this);
    }

    connectedCallback() {
        this.form = this.querySelector('form');
        if (!this.form) {
            console.error('noundry-element must contain a form element');
            return;
        }

        this.setupFormListeners();
        this.captureInitialValues();
        this.createErrorElements();
        this.updateState();
    }

    disconnectedCallback() {
        this.removeFormListeners();
    }

    setupFormListeners() {
        this.form.addEventListener('input', this.boundHandleInput);
        this.form.addEventListener('change', this.boundHandleChange);
        this.form.addEventListener('submit', this.boundHandleSubmit);
        this.form.addEventListener('invalid', this.boundHandleInvalid, true);
    }

    removeFormListeners() {
        if (this.form) {
            this.form.removeEventListener('input', this.boundHandleInput);
            this.form.removeEventListener('change', this.boundHandleChange);
            this.form.removeEventListener('submit', this.boundHandleSubmit);
            this.form.removeEventListener('invalid', this.boundHandleInvalid, true);
        }
    }

    captureInitialValues() {
        const formData = new FormData(this.form);
        this.initialValues = this.formDataToObject(formData);
        this.currentValues = { ...this.initialValues };
    }

    formDataToObject(formData) {
        const obj = {};
        for (const [key, value] of formData.entries()) {
            if (obj[key]) {
                if (Array.isArray(obj[key])) {
                    obj[key].push(value);
                } else {
                    obj[key] = [obj[key], value];
                }
            } else {
                obj[key] = value;
            }
        }
        return obj;
    }

    createErrorElements() {
        const fields = this.form.querySelectorAll('[name]');
        fields.forEach(field => {
            const name = field.name;
            let errorElement = this.form.querySelector(`[data-error-for="${name}"]`);
            
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'noundry-error';
                errorElement.setAttribute('data-error-for', name);
                errorElement.style.display = 'none';
                field.insertAdjacentElement('afterend', errorElement);
            }
            
            this.errorElements.set(name, errorElement);
        });
    }

    handleInput(event) {
        this.updateCurrentValues();
        this.updateDirtyState();
        this.validateField(event.target);
        this.updateState();
        
        this.dispatchEvent(new CustomEvent('noundry-input', {
            detail: {
                field: event.target.name,
                value: event.target.value,
                values: this.currentValues
            }
        }));
    }

    handleChange(event) {
        this.updateCurrentValues();
        this.updateDirtyState();
        this.validateField(event.target);
        this.updateState();
        
        this.dispatchEvent(new CustomEvent('noundry-change', {
            detail: {
                field: event.target.name,
                value: event.target.value,
                values: this.currentValues
            }
        }));
    }

    handleSubmit(event) {
        event.preventDefault();
        
        if (this.hasAttribute('default-submit') && this.getAttribute('default-submit') !== 'false') {
            return true;
        }

        this.validateAll();
        
        if (!this.isValid) {
            this.dispatchEvent(new CustomEvent('noundry-invalid', {
                detail: { errors: this.errors }
            }));
            return false;
        }

        this.isSubmitting = true;
        this.updateState();

        const submitEvent = new CustomEvent('noundry-submit', {
            detail: {
                values: this.currentValues,
                formData: new FormData(this.form),
                preventDefault: () => {}
            }
        });

        this.dispatchEvent(submitEvent);

        if (!submitEvent.defaultPrevented) {
            this.performSubmit();
        }
    }

    async performSubmit() {
        const action = this.form.action || window.location.href;
        const method = this.form.method || 'GET';

        try {
            this.dispatchEvent(new CustomEvent('noundry-request-start'));

            const response = await fetch(action, {
                method: method.toUpperCase(),
                body: method.toUpperCase() === 'GET' ? null : new FormData(this.form)
            });

            if (response.ok) {
                this.dispatchEvent(new CustomEvent('noundry-request-success', {
                    detail: { response }
                }));
                
                if (this.hasAttribute('reset-on-submit')) {
                    this.reset();
                }
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            this.dispatchEvent(new CustomEvent('noundry-request-error', {
                detail: { error }
            }));
        } finally {
            this.isSubmitting = false;
            this.updateState();
        }
    }

    handleInvalid(event) {
        event.preventDefault();
        this.validateField(event.target);
    }

    updateCurrentValues() {
        const formData = new FormData(this.form);
        this.currentValues = this.formDataToObject(formData);
    }

    updateDirtyState() {
        this.isDirty = !NoundryUtils.deepCompare(this.initialValues, this.currentValues);
    }

    validateField(field) {
        if (!field.name) return;

        const error = NoundryUtils.getFieldError(field);
        const customValidator = this.validationRules[field.name];
        
        let customError = null;
        if (customValidator) {
            customError = customValidator(field.value, this.currentValues);
        }

        const finalError = customError || error;
        
        if (finalError) {
            this.errors[field.name] = finalError;
        } else {
            delete this.errors[field.name];
        }

        this.displayFieldError(field.name, finalError);
        this.updateValidState();
    }

    validateAll() {
        const fields = this.form.querySelectorAll('[name]');
        fields.forEach(field => this.validateField(field));
    }

    displayFieldError(fieldName, error) {
        const errorElement = this.errorElements.get(fieldName);
        if (errorElement) {
            if (error) {
                errorElement.textContent = error;
                errorElement.style.display = 'block';
                errorElement.setAttribute('aria-live', 'polite');
            } else {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
                errorElement.removeAttribute('aria-live');
            }
        }
    }

    updateValidState() {
        this.isValid = Object.keys(this.errors).length === 0;
    }

    updateState() {
        this.setAttribute('data-dirty', this.isDirty);
        this.setAttribute('data-valid', this.isValid);
        this.setAttribute('data-submitting', this.isSubmitting);
        
        const submitButton = this.form.querySelector('[type="submit"]');
        if (submitButton && this.hasAttribute('error-disable-submit')) {
            submitButton.disabled = !this.isValid || this.isSubmitting;
        }
    }

    // Public API Methods
    reset() {
        this.form.reset();
        this.currentValues = { ...this.initialValues };
        this.errors = {};
        this.isDirty = false;
        this.isValid = true;
        this.isSubmitting = false;
        
        this.errorElements.forEach(errorElement => {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        });
        
        this.updateState();
        
        this.dispatchEvent(new CustomEvent('noundry-reset'));
    }

    setValues(values) {
        for (const [name, value] of Object.entries(values)) {
            const field = this.form.querySelector(`[name="${name}"]`);
            if (field) {
                if (field.type === 'checkbox' || field.type === 'radio') {
                    field.checked = field.value === value;
                } else {
                    field.value = value;
                }
            }
        }
        
        this.updateCurrentValues();
        this.updateDirtyState();
        this.validateAll();
        this.updateState();
    }

    getValues() {
        return { ...this.currentValues };
    }

    setValidationRule(fieldName, validator) {
        this.validationRules[fieldName] = validator;
    }

    requestSubmit() {
        this.form.requestSubmit();
    }

    // Alpine.js integration helpers
    get $noundry() {
        return {
            values: this.currentValues,
            errors: this.errors,
            isDirty: this.isDirty,
            isValid: this.isValid,
            isSubmitting: this.isSubmitting,
            reset: () => this.reset(),
            setValues: (values) => this.setValues(values),
            getValues: () => this.getValues(),
            setValidationRule: (field, validator) => this.setValidationRule(field, validator)
        };
    }
}

// Register the custom element
if (!customElements.get('noundry-element')) {
    customElements.define('noundry-element', NoundryElement);
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NoundryElement, NoundryUtils };
}

// AMD support
if (typeof define === 'function' && define.amd) {
    define(function() {
        return { NoundryElement, NoundryUtils };
    });
}

// Browser global
if (typeof window !== 'undefined') {
    window.NoundryElement = NoundryElement;
    window.NoundryUtils = NoundryUtils;
}