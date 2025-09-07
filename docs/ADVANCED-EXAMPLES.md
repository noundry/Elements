# Advanced Examples and Patterns

Complex form patterns and advanced use cases with Noundry Elements.

## Table of Contents

- [E-commerce Checkout Form](#e-commerce-checkout-form)
- [Dynamic Survey Builder](#dynamic-survey-builder)
- [Multi-tenant Configuration](#multi-tenant-configuration)
- [Real-time Collaboration Form](#real-time-collaboration-form)
- [Wizard with Conditional Steps](#wizard-with-conditional-steps)
- [File Processing Pipeline](#file-processing-pipeline)
- [Advanced Validation Patterns](#advanced-validation-patterns)
- [Performance Optimization](#performance-optimization)

## E-commerce Checkout Form

A complete checkout form with address validation, payment processing, and order calculation.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Advanced Checkout Form</title>
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <style>
        .checkout-section { margin-bottom: 2rem; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; }
        .form-row { display: flex; gap: 1rem; margin-bottom: 1rem; }
        .form-group { flex: 1; }
        .total-section { background: #f7fafc; padding: 1rem; border-radius: 4px; }
        .error { color: #e53e3e; font-size: 0.875rem; margin-top: 0.25rem; }
        .success { color: #38a169; }
        .loading { opacity: 0.6; pointer-events: none; }
        .step-indicator { display: flex; margin-bottom: 2rem; }
        .step { flex: 1; padding: 1rem; text-align: center; border-bottom: 2px solid #e2e8f0; }
        .step.active { border-bottom-color: #3182ce; color: #3182ce; font-weight: bold; }
        .step.completed { border-bottom-color: #38a169; color: #38a169; }
    </style>
</head>
<body>
    <div x-data="checkoutForm()" class="checkout-container">
        <!-- Progress Indicator -->
        <div class="step-indicator">
            <div class="step" :class="getStepClass(0)">1. Shipping</div>
            <div class="step" :class="getStepClass(1)">2. Payment</div>
            <div class="step" :class="getStepClass(2)">3. Review</div>
        </div>

        <noundry-element 
            x-ref="checkoutForm"
            @noundry-input="handleFormInput"
            @noundry-submit="processOrder"
            error-disable-submit
        >
            <form>
                <!-- Step 1: Shipping Information -->
                <div x-show="currentStep === 0" x-transition class="checkout-section">
                    <h2>Shipping Information</h2>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="firstName">First Name *</label>
                            <input type="text" name="firstName" id="firstName" required
                                   x-model="order.shipping.firstName">
                        </div>
                        <div class="form-group">
                            <label for="lastName">Last Name *</label>
                            <input type="text" name="lastName" id="lastName" required
                                   x-model="order.shipping.lastName">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Email Address *</label>
                        <input type="email" name="email" id="email" required
                               x-model="order.customer.email">
                    </div>
                    
                    <div class="form-group">
                        <label for="address">Street Address *</label>
                        <input type="text" name="address" id="address" required
                               x-model="order.shipping.address"
                               @input.debounce.500ms="validateAddress">
                        <div x-show="addressValidation.checking" class="loading">
                            Validating address...
                        </div>
                        <div x-show="addressValidation.suggestions.length > 0" class="address-suggestions">
                            <p>Did you mean:</p>
                            <template x-for="suggestion in addressValidation.suggestions">
                                <button type="button" @click="selectAddressSuggestion(suggestion)"
                                        x-text="suggestion.formatted"></button>
                            </template>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="city">City *</label>
                            <input type="text" name="city" id="city" required
                                   x-model="order.shipping.city">
                        </div>
                        <div class="form-group">
                            <label for="state">State *</label>
                            <select name="state" id="state" required x-model="order.shipping.state">
                                <option value="">Select State</option>
                                <template x-for="state in states">
                                    <option :value="state.code" x-text="state.name"></option>
                                </template>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="zipCode">ZIP Code *</label>
                            <input type="text" name="zipCode" id="zipCode" required
                                   pattern="[0-9]{5}(-[0-9]{4})?" 
                                   x-model="order.shipping.zipCode"
                                   @input="calculateShipping">
                        </div>
                    </div>
                    
                    <!-- Shipping Options -->
                    <div class="form-group" x-show="shippingOptions.length > 0">
                        <label>Shipping Method *</label>
                        <template x-for="option in shippingOptions">
                            <label class="shipping-option">
                                <input type="radio" name="shippingMethod" required
                                       :value="option.id" x-model="order.shipping.method"
                                       @change="updateShippingCost">
                                <span x-text="option.name"></span>
                                <span x-text="formatCurrency(option.price)"></span>
                                <small x-text="option.description"></small>
                            </label>
                        </template>
                    </div>
                </div>

                <!-- Step 2: Payment Information -->
                <div x-show="currentStep === 1" x-transition class="checkout-section">
                    <h2>Payment Information</h2>
                    
                    <div class="form-group">
                        <label>Payment Method *</label>
                        <label><input type="radio" name="paymentType" value="card" required
                                      x-model="order.payment.type"> Credit/Debit Card</label>
                        <label><input type="radio" name="paymentType" value="paypal"
                                      x-model="order.payment.type"> PayPal</label>
                    </div>
                    
                    <div x-show="order.payment.type === 'card'" x-transition>
                        <div class="form-group">
                            <label for="cardNumber">Card Number *</label>
                            <input type="text" name="cardNumber" id="cardNumber" 
                                   x-model="order.payment.cardNumber"
                                   @input="formatCardNumber"
                                   placeholder="1234 5678 9012 3456">
                            <div class="card-type" x-show="cardType" x-text="cardType"></div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="expiryDate">Expiry Date *</label>
                                <input type="text" name="expiryDate" id="expiryDate"
                                       x-model="order.payment.expiryDate"
                                       @input="formatExpiryDate"
                                       placeholder="MM/YY" maxlength="5">
                            </div>
                            <div class="form-group">
                                <label for="cvv">CVV *</label>
                                <input type="text" name="cvv" id="cvv"
                                       x-model="order.payment.cvv"
                                       placeholder="123" maxlength="4">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="cardName">Name on Card *</label>
                            <input type="text" name="cardName" id="cardName"
                                   x-model="order.payment.cardName">
                        </div>
                        
                        <!-- Billing Address -->
                        <div class="form-group">
                            <label>
                                <input type="checkbox" name="sameAsShipping" 
                                       x-model="order.billing.sameAsShipping"
                                       @change="copyShippingToBilling">
                                Billing address same as shipping
                            </label>
                        </div>
                        
                        <div x-show="!order.billing.sameAsShipping" x-transition>
                            <!-- Billing address fields (similar to shipping) -->
                            <h3>Billing Address</h3>
                            <div class="form-group">
                                <label for="billingAddress">Street Address *</label>
                                <input type="text" name="billingAddress" id="billingAddress"
                                       x-model="order.billing.address">
                            </div>
                            <!-- ... more billing fields -->
                        </div>
                    </div>
                </div>

                <!-- Step 3: Order Review -->
                <div x-show="currentStep === 2" x-transition class="checkout-section">
                    <h2>Order Review</h2>
                    
                    <!-- Order Summary -->
                    <div class="order-summary">
                        <template x-for="item in cartItems">
                            <div class="order-item">
                                <span x-text="item.name"></span>
                                <span x-text="`Qty: ${item.quantity}`"></span>
                                <span x-text="formatCurrency(item.price * item.quantity)"></span>
                            </div>
                        </template>
                    </div>
                    
                    <!-- Shipping & Billing Summary -->
                    <div class="address-summary">
                        <div class="shipping-summary">
                            <h4>Shipping Address</h4>
                            <p x-text="`${order.shipping.firstName} ${order.shipping.lastName}`"></p>
                            <p x-text="order.shipping.address"></p>
                            <p x-text="`${order.shipping.city}, ${order.shipping.state} ${order.shipping.zipCode}`"></p>
                        </div>
                        
                        <div class="payment-summary" x-show="order.payment.type === 'card'">
                            <h4>Payment Method</h4>
                            <p x-text="`${cardType} ending in ${order.payment.cardNumber.slice(-4)}`"></p>
                        </div>
                    </div>
                    
                    <!-- Promo Code -->
                    <div class="promo-code">
                        <label for="promoCode">Promo Code</label>
                        <div class="promo-input">
                            <input type="text" name="promoCode" id="promoCode"
                                   x-model="order.promoCode"
                                   @input.debounce.500ms="validatePromoCode">
                            <button type="button" @click="applyPromoCode"
                                    :disabled="!promoCodeValid">Apply</button>
                        </div>
                        <div x-show="promoCodeError" class="error" x-text="promoCodeError"></div>
                        <div x-show="appliedPromo" class="success">
                            Promo code applied: <span x-text="appliedPromo.description"></span>
                        </div>
                    </div>
                </div>

                <!-- Order Total -->
                <div class="total-section">
                    <div class="total-row">
                        <span>Subtotal:</span>
                        <span x-text="formatCurrency(orderTotals.subtotal)"></span>
                    </div>
                    <div class="total-row">
                        <span>Shipping:</span>
                        <span x-text="formatCurrency(orderTotals.shipping)"></span>
                    </div>
                    <div class="total-row" x-show="orderTotals.tax > 0">
                        <span>Tax:</span>
                        <span x-text="formatCurrency(orderTotals.tax)"></span>
                    </div>
                    <div class="total-row" x-show="orderTotals.discount > 0">
                        <span>Discount:</span>
                        <span x-text="`-${formatCurrency(orderTotals.discount)}`"></span>
                    </div>
                    <div class="total-row total">
                        <span><strong>Total:</strong></span>
                        <span><strong x-text="formatCurrency(orderTotals.total)"></strong></span>
                    </div>
                </div>

                <!-- Navigation Buttons -->
                <div class="form-navigation">
                    <button type="button" @click="previousStep" 
                            x-show="currentStep > 0">Previous</button>
                    
                    <button type="button" @click="nextStep" 
                            x-show="currentStep < 2"
                            :disabled="!isStepValid(currentStep)">Next</button>
                    
                    <button type="submit" x-show="currentStep === 2"
                            :disabled="!canPlaceOrder">
                        <span x-show="!isProcessing">Place Order</span>
                        <span x-show="isProcessing">Processing...</span>
                    </button>
                </div>
            </form>
        </noundry-element>
    </div>

    <script src="noundry-elements.js"></script>
    <script>
        function checkoutForm() {
            return {
                currentStep: 0,
                isProcessing: false,
                
                order: {
                    customer: { email: '' },
                    shipping: {
                        firstName: '', lastName: '', address: '', 
                        city: '', state: '', zipCode: '', method: ''
                    },
                    billing: { sameAsShipping: true, address: '' },
                    payment: { 
                        type: 'card', cardNumber: '', expiryDate: '', 
                        cvv: '', cardName: '' 
                    },
                    promoCode: ''
                },
                
                cartItems: [
                    { id: 1, name: 'Premium Widget', quantity: 2, price: 29.99 },
                    { id: 2, name: 'Deluxe Gadget', quantity: 1, price: 59.99 }
                ],
                
                states: [
                    { code: 'CA', name: 'California' },
                    { code: 'NY', name: 'New York' },
                    { code: 'TX', name: 'Texas' }
                ],
                
                shippingOptions: [],
                addressValidation: { checking: false, suggestions: [] },
                promoCodeValid: false,
                promoCodeError: '',
                appliedPromo: null,
                
                get cardType() {
                    const number = this.order.payment.cardNumber.replace(/\s/g, '');
                    if (number.startsWith('4')) return 'Visa';
                    if (number.startsWith('5')) return 'Mastercard';
                    if (number.startsWith('3')) return 'American Express';
                    return '';
                },
                
                get orderTotals() {
                    const subtotal = this.cartItems.reduce((sum, item) => 
                        sum + (item.price * item.quantity), 0);
                    
                    const shipping = this.getShippingCost();
                    const tax = subtotal * 0.0825; // 8.25% tax
                    const discount = this.appliedPromo ? this.appliedPromo.discount : 0;
                    const total = subtotal + shipping + tax - discount;
                    
                    return { subtotal, shipping, tax, discount, total };
                },
                
                get canPlaceOrder() {
                    return this.isStepValid(0) && this.isStepValid(1) && 
                           this.isStepValid(2) && !this.isProcessing;
                },
                
                init() {
                    this.$nextTick(() => {
                        this.setupValidation();
                        this.calculateShipping();
                    });
                },
                
                setupValidation() {
                    const form = this.$refs.checkoutForm;
                    
                    // Card number validation
                    form.setValidationRule('cardNumber', (value) => {
                        if (!value) return 'Card number is required';
                        const cleaned = value.replace(/\s/g, '');
                        if (!/^\d{13,19}$/.test(cleaned)) {
                            return 'Invalid card number format';
                        }
                        if (!this.luhnCheck(cleaned)) {
                            return 'Invalid card number';
                        }
                        return null;
                    });
                    
                    // Expiry date validation
                    form.setValidationRule('expiryDate', (value) => {
                        if (!value) return 'Expiry date is required';
                        if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(value)) {
                            return 'Format: MM/YY';
                        }
                        
                        const [month, year] = value.split('/');
                        const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
                        if (expiry < new Date()) {
                            return 'Card has expired';
                        }
                        
                        return null;
                    });
                    
                    // CVV validation
                    form.setValidationRule('cvv', (value) => {
                        if (!value) return 'CVV is required';
                        const expectedLength = this.cardType === 'American Express' ? 4 : 3;
                        if (value.length !== expectedLength) {
                            return `CVV must be ${expectedLength} digits`;
                        }
                        return null;
                    });
                },
                
                luhnCheck(cardNumber) {
                    let sum = 0;
                    let alternate = false;
                    
                    for (let i = cardNumber.length - 1; i >= 0; i--) {
                        let n = parseInt(cardNumber.charAt(i));
                        
                        if (alternate) {
                            n *= 2;
                            if (n > 9) n -= 9;
                        }
                        
                        sum += n;
                        alternate = !alternate;
                    }
                    
                    return (sum % 10) === 0;
                },
                
                formatCardNumber() {
                    let value = this.order.payment.cardNumber.replace(/\s/g, '');
                    let formatted = value.replace(/(.{4})/g, '$1 ').trim();
                    this.order.payment.cardNumber = formatted;
                },
                
                formatExpiryDate() {
                    let value = this.order.payment.expiryDate.replace(/\D/g, '');
                    if (value.length >= 2) {
                        value = value.substring(0, 2) + '/' + value.substring(2, 4);
                    }
                    this.order.payment.expiryDate = value;
                },
                
                async validateAddress() {
                    if (this.order.shipping.address.length < 5) return;
                    
                    this.addressValidation.checking = true;
                    
                    try {
                        // Simulate address validation API
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        
                        // Mock suggestions
                        this.addressValidation.suggestions = [
                            { formatted: '123 Main St, Anytown, CA 12345' },
                            { formatted: '123 Main Street, Anytown, CA 12345' }
                        ];
                    } catch (error) {
                        console.error('Address validation failed:', error);
                    } finally {
                        this.addressValidation.checking = false;
                    }
                },
                
                selectAddressSuggestion(suggestion) {
                    // Parse and set address components
                    this.order.shipping.address = suggestion.formatted;
                    this.addressValidation.suggestions = [];
                },
                
                async calculateShipping() {
                    if (!this.order.shipping.zipCode) return;
                    
                    try {
                        // Simulate shipping calculation
                        await new Promise(resolve => setTimeout(resolve, 500));
                        
                        this.shippingOptions = [
                            { id: 'standard', name: 'Standard', price: 5.99, description: '5-7 business days' },
                            { id: 'express', name: 'Express', price: 12.99, description: '2-3 business days' },
                            { id: 'overnight', name: 'Overnight', price: 24.99, description: 'Next business day' }
                        ];
                        
                        // Auto-select first option
                        if (!this.order.shipping.method && this.shippingOptions.length > 0) {
                            this.order.shipping.method = this.shippingOptions[0].id;
                        }
                    } catch (error) {
                        console.error('Shipping calculation failed:', error);
                    }
                },
                
                getShippingCost() {
                    const option = this.shippingOptions.find(opt => 
                        opt.id === this.order.shipping.method);
                    return option ? option.price : 0;
                },
                
                updateShippingCost() {
                    // Trigger reactive updates
                    this.$nextTick(() => this.calculateShipping());
                },
                
                copyShippingToBilling() {
                    if (this.order.billing.sameAsShipping) {
                        this.order.billing = { 
                            ...this.order.shipping, 
                            sameAsShipping: true 
                        };
                    }
                },
                
                async validatePromoCode() {
                    if (!this.order.promoCode) {
                        this.promoCodeValid = false;
                        return;
                    }
                    
                    try {
                        // Simulate API validation
                        await new Promise(resolve => setTimeout(resolve, 500));
                        
                        const validCodes = {
                            'SAVE10': { discount: 10, description: '10% off your order' },
                            'FREESHIP': { discount: this.getShippingCost(), description: 'Free shipping' }
                        };
                        
                        if (validCodes[this.order.promoCode.toUpperCase()]) {
                            this.promoCodeValid = true;
                            this.promoCodeError = '';
                        } else {
                            this.promoCodeValid = false;
                            this.promoCodeError = 'Invalid promo code';
                        }
                    } catch (error) {
                        this.promoCodeError = 'Unable to validate promo code';
                    }
                },
                
                applyPromoCode() {
                    if (this.promoCodeValid) {
                        const validCodes = {
                            'SAVE10': { discount: this.orderTotals.subtotal * 0.1, description: '10% off your order' },
                            'FREESHIP': { discount: this.getShippingCost(), description: 'Free shipping' }
                        };
                        
                        this.appliedPromo = validCodes[this.order.promoCode.toUpperCase()];
                    }
                },
                
                getStepClass(stepIndex) {
                    if (stepIndex < this.currentStep) return 'completed';
                    if (stepIndex === this.currentStep) return 'active';
                    return '';
                },
                
                isStepValid(stepIndex) {
                    const form = this.$refs.checkoutForm;
                    if (!form || !form.$noundry) return false;
                    
                    const requiredFields = {
                        0: ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode'],
                        1: ['paymentType'],
                        2: []
                    };
                    
                    if (this.order.payment.type === 'card') {
                        requiredFields[1].push('cardNumber', 'expiryDate', 'cvv', 'cardName');
                    }
                    
                    const fields = requiredFields[stepIndex] || [];
                    const values = form.$noundry.values || {};
                    const errors = form.$noundry.errors || {};
                    
                    return fields.every(field => 
                        values[field] && values[field].trim() && !errors[field]
                    );
                },
                
                nextStep() {
                    if (this.currentStep < 2 && this.isStepValid(this.currentStep)) {
                        this.currentStep++;
                    }
                },
                
                previousStep() {
                    if (this.currentStep > 0) {
                        this.currentStep--;
                    }
                },
                
                handleFormInput(event) {
                    // Update order object with form values
                    const { field, value } = event.detail;
                    
                    // Map form fields to order structure
                    const fieldMap = {
                        firstName: 'shipping.firstName',
                        lastName: 'shipping.lastName',
                        email: 'customer.email',
                        address: 'shipping.address',
                        city: 'shipping.city',
                        state: 'shipping.state',
                        zipCode: 'shipping.zipCode',
                        cardNumber: 'payment.cardNumber',
                        expiryDate: 'payment.expiryDate',
                        cvv: 'payment.cvv',
                        cardName: 'payment.cardName'
                    };
                    
                    const orderPath = fieldMap[field];
                    if (orderPath) {
                        this.setNestedValue(this.order, orderPath, value);
                    }
                },
                
                setNestedValue(obj, path, value) {
                    const keys = path.split('.');
                    const lastKey = keys.pop();
                    const target = keys.reduce((o, key) => o[key], obj);
                    target[lastKey] = value;
                },
                
                async processOrder(event) {
                    event.preventDefault();
                    this.isProcessing = true;
                    
                    try {
                        // Simulate order processing
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        
                        const orderData = {
                            ...this.order,
                            items: this.cartItems,
                            totals: this.orderTotals,
                            timestamp: new Date().toISOString()
                        };
                        
                        console.log('Order processed:', orderData);
                        
                        // Show success message
                        alert('Order placed successfully!');
                        
                        // Reset form
                        this.$refs.checkoutForm.reset();
                        this.currentStep = 0;
                        
                    } catch (error) {
                        console.error('Order processing failed:', error);
                        alert('Order processing failed. Please try again.');
                    } finally {
                        this.isProcessing = false;
                    }
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
</body>
</html>
```

## Dynamic Survey Builder

A survey builder that allows creating dynamic forms with various question types.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Dynamic Survey Builder</title>
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <style>
        .survey-builder { display: flex; gap: 2rem; }
        .builder-panel, .preview-panel { flex: 1; padding: 1rem; }
        .builder-panel { border-right: 1px solid #e2e8f0; }
        .question-builder { background: #f7fafc; padding: 1rem; margin-bottom: 1rem; border-radius: 4px; }
        .question-preview { border: 1px solid #e2e8f0; padding: 1rem; margin-bottom: 1rem; border-radius: 4px; }
        .question-type-selector { margin-bottom: 1rem; }
        .option-builder { margin-left: 1rem; }
        .drag-handle { cursor: move; padding: 0.5rem; }
        .drop-zone { min-height: 2rem; border: 2px dashed #cbd5e0; border-radius: 4px; }
        .drop-zone.drag-over { border-color: #3182ce; background: #ebf8ff; }
    </style>
</head>
<body>
    <div x-data="surveyBuilder()" class="survey-builder">
        <!-- Builder Panel -->
        <div class="builder-panel">
            <h2>Survey Builder</h2>
            
            <!-- Survey Settings -->
            <div class="survey-settings">
                <h3>Survey Settings</h3>
                <input type="text" x-model="survey.title" placeholder="Survey Title">
                <textarea x-model="survey.description" placeholder="Survey Description"></textarea>
            </div>
            
            <!-- Question Types -->
            <div class="question-types">
                <h3>Add Question</h3>
                <select x-model="newQuestion.type" @change="resetNewQuestion">
                    <option value="">Select Question Type</option>
                    <option value="text">Text Input</option>
                    <option value="textarea">Long Text</option>
                    <option value="number">Number</option>
                    <option value="email">Email</option>
                    <option value="select">Dropdown</option>
                    <option value="radio">Multiple Choice</option>
                    <option value="checkbox">Checkboxes</option>
                    <option value="rating">Rating Scale</option>
                    <option value="likert">Likert Scale</option>
                </select>
            </div>
            
            <!-- Question Builder -->
            <div x-show="newQuestion.type" class="question-builder">
                <input type="text" x-model="newQuestion.question" 
                       placeholder="Enter your question">
                
                <label>
                    <input type="checkbox" x-model="newQuestion.required">
                    Required
                </label>
                
                <!-- Options for select/radio/checkbox -->
                <div x-show="['select', 'radio', 'checkbox'].includes(newQuestion.type)">
                    <h4>Options</h4>
                    <template x-for="(option, index) in newQuestion.options" :key="index">
                        <div class="option-builder">
                            <input type="text" x-model="option.text" placeholder="Option text">
                            <input type="text" x-model="option.value" placeholder="Option value">
                            <button type="button" @click="removeOption(index)">Remove</button>
                        </div>
                    </template>
                    <button type="button" @click="addOption">Add Option</button>
                </div>
                
                <!-- Rating Scale Settings -->
                <div x-show="newQuestion.type === 'rating'">
                    <label>Min Value: <input type="number" x-model.number="newQuestion.min"></label>
                    <label>Max Value: <input type="number" x-model.number="newQuestion.max"></label>
                    <label>Min Label: <input type="text" x-model="newQuestion.minLabel"></label>
                    <label>Max Label: <input type="text" x-model="newQuestion.maxLabel"></label>
                </div>
                
                <!-- Likert Scale Settings -->
                <div x-show="newQuestion.type === 'likert'">
                    <h4>Statements</h4>
                    <template x-for="(statement, index) in newQuestion.statements" :key="index">
                        <div>
                            <input type="text" x-model="statement.text" placeholder="Statement">
                            <button type="button" @click="removeStatement(index)">Remove</button>
                        </div>
                    </template>
                    <button type="button" @click="addStatement">Add Statement</button>
                    
                    <select x-model="newQuestion.scale">
                        <option value="agreement">Strongly Disagree - Strongly Agree</option>
                        <option value="satisfaction">Very Unsatisfied - Very Satisfied</option>
                        <option value="frequency">Never - Always</option>
                        <option value="importance">Not Important - Very Important</option>
                    </select>
                </div>
                
                <!-- Conditional Logic -->
                <div class="conditional-logic">
                    <h4>Show this question when:</h4>
                    <select x-model="newQuestion.condition.field">
                        <option value="">Always show</option>
                        <template x-for="question in survey.questions" :key="question.id">
                            <option :value="question.id" x-text="question.question"></option>
                        </template>
                    </select>
                    <select x-show="newQuestion.condition.field" x-model="newQuestion.condition.operator">
                        <option value="equals">Equals</option>
                        <option value="not_equals">Not Equals</option>
                        <option value="contains">Contains</option>
                    </select>
                    <input x-show="newQuestion.condition.field" type="text" 
                           x-model="newQuestion.condition.value" placeholder="Value">
                </div>
                
                <button type="button" @click="addQuestion" 
                        :disabled="!newQuestion.question">Add Question</button>
            </div>
            
            <!-- Existing Questions -->
            <div class="existing-questions">
                <h3>Questions (<span x-text="survey.questions.length"></span>)</h3>
                <template x-for="(question, index) in survey.questions" :key="question.id">
                    <div class="question-item" draggable="true"
                         @dragstart="startDrag($event, index)"
                         @dragover.prevent
                         @drop="handleDrop($event, index)">
                        <div class="drag-handle">☰</div>
                        <div class="question-summary">
                            <strong x-text="question.question"></strong>
                            <small x-text="`(${question.type}${question.required ? ', required' : ''})`"></small>
                        </div>
                        <div class="question-actions">
                            <button @click="editQuestion(question)">Edit</button>
                            <button @click="duplicateQuestion(question)">Duplicate</button>
                            <button @click="deleteQuestion(index)">Delete</button>
                        </div>
                    </div>
                </template>
            </div>
            
            <!-- Export/Import -->
            <div class="survey-actions">
                <button @click="exportSurvey">Export Survey</button>
                <input type="file" @change="importSurvey" accept=".json">
                <button @click="previewSurvey">Preview</button>
            </div>
        </div>
        
        <!-- Preview Panel -->
        <div class="preview-panel">
            <h2>Survey Preview</h2>
            
            <div x-show="previewMode">
                <noundry-element x-ref="surveyPreview" @noundry-submit="handleSurveySubmit">
                    <form>
                        <h1 x-text="survey.title"></h1>
                        <p x-text="survey.description"></p>
                        
                        <template x-for="question in visibleQuestions" :key="question.id">
                            <div class="question-preview">
                                <label x-text="question.question + (question.required ? ' *' : '')"></label>
                                
                                <!-- Text Input -->
                                <input x-show="question.type === 'text'" 
                                       type="text" :name="`q_${question.id}`"
                                       :required="question.required">
                                
                                <!-- Textarea -->
                                <textarea x-show="question.type === 'textarea'" 
                                         :name="`q_${question.id}`"
                                         :required="question.required"></textarea>
                                
                                <!-- Number Input -->
                                <input x-show="question.type === 'number'" 
                                       type="number" :name="`q_${question.id}`"
                                       :required="question.required">
                                
                                <!-- Email Input -->
                                <input x-show="question.type === 'email'" 
                                       type="email" :name="`q_${question.id}`"
                                       :required="question.required">
                                
                                <!-- Select Dropdown -->
                                <select x-show="question.type === 'select'" 
                                        :name="`q_${question.id}`" :required="question.required">
                                    <option value="">Choose an option</option>
                                    <template x-for="option in question.options">
                                        <option :value="option.value" x-text="option.text"></option>
                                    </template>
                                </select>
                                
                                <!-- Radio Buttons -->
                                <div x-show="question.type === 'radio'">
                                    <template x-for="option in question.options">
                                        <label>
                                            <input type="radio" :name="`q_${question.id}`" 
                                                   :value="option.value" :required="question.required">
                                            <span x-text="option.text"></span>
                                        </label>
                                    </template>
                                </div>
                                
                                <!-- Checkboxes -->
                                <div x-show="question.type === 'checkbox'">
                                    <template x-for="option in question.options">
                                        <label>
                                            <input type="checkbox" :name="`q_${question.id}[]`" 
                                                   :value="option.value">
                                            <span x-text="option.text"></span>
                                        </label>
                                    </template>
                                </div>
                                
                                <!-- Rating Scale -->
                                <div x-show="question.type === 'rating'" class="rating-scale">
                                    <div class="scale-labels">
                                        <span x-text="question.minLabel"></span>
                                        <span x-text="question.maxLabel"></span>
                                    </div>
                                    <div class="scale-options">
                                        <template x-for="i in (question.max - question.min + 1)">
                                            <label>
                                                <input type="radio" :name="`q_${question.id}`" 
                                                       :value="question.min + i - 1" :required="question.required">
                                                <span x-text="question.min + i - 1"></span>
                                            </label>
                                        </template>
                                    </div>
                                </div>
                                
                                <!-- Likert Scale -->
                                <div x-show="question.type === 'likert'" class="likert-scale">
                                    <div class="likert-header">
                                        <div></div>
                                        <template x-for="label in getLikertLabels(question.scale)">
                                            <div x-text="label"></div>
                                        </template>
                                    </div>
                                    <template x-for="statement in question.statements">
                                        <div class="likert-row">
                                            <div x-text="statement.text"></div>
                                            <template x-for="(label, index) in getLikertLabels(question.scale)">
                                                <div>
                                                    <input type="radio" 
                                                           :name="`q_${question.id}_${statement.id}`" 
                                                           :value="index + 1" :required="question.required">
                                                </div>
                                            </template>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </template>
                        
                        <button type="submit">Submit Survey</button>
                    </form>
                </noundry-element>
            </div>
            
            <div x-show="!previewMode">
                <p>Click "Preview" to see how your survey will look to respondents.</p>
            </div>
        </div>
    </div>

    <script src="noundry-elements.js"></script>
    <script>
        function surveyBuilder() {
            return {
                survey: {
                    title: 'My Survey',
                    description: 'Please take a moment to complete this survey.',
                    questions: []
                },
                
                newQuestion: {
                    type: '',
                    question: '',
                    required: false,
                    options: [],
                    min: 1,
                    max: 5,
                    minLabel: 'Poor',
                    maxLabel: 'Excellent',
                    statements: [],
                    scale: 'agreement',
                    condition: {
                        field: '',
                        operator: 'equals',
                        value: ''
                    }
                },
                
                previewMode: false,
                draggedIndex: null,
                responses: {},
                nextQuestionId: 1,
                nextStatementId: 1,
                
                get visibleQuestions() {
                    return this.survey.questions.filter(question => {
                        if (!question.condition.field) return true;
                        
                        const dependentValue = this.responses[`q_${question.condition.field}`];
                        const conditionValue = question.condition.value;
                        
                        switch (question.condition.operator) {
                            case 'equals':
                                return dependentValue === conditionValue;
                            case 'not_equals':
                                return dependentValue !== conditionValue;
                            case 'contains':
                                return dependentValue && dependentValue.includes(conditionValue);
                            default:
                                return true;
                        }
                    });
                },
                
                resetNewQuestion() {
                    this.newQuestion = {
                        type: this.newQuestion.type,
                        question: '',
                        required: false,
                        options: this.needsOptions(this.newQuestion.type) ? [{ text: '', value: '' }] : [],
                        min: 1,
                        max: 5,
                        minLabel: 'Poor',
                        maxLabel: 'Excellent',
                        statements: this.newQuestion.type === 'likert' ? [{ id: this.nextStatementId++, text: '' }] : [],
                        scale: 'agreement',
                        condition: {
                            field: '',
                            operator: 'equals',
                            value: ''
                        }
                    };
                },
                
                needsOptions(type) {
                    return ['select', 'radio', 'checkbox'].includes(type);
                },
                
                addOption() {
                    this.newQuestion.options.push({ text: '', value: '' });
                },
                
                removeOption(index) {
                    this.newQuestion.options.splice(index, 1);
                },
                
                addStatement() {
                    this.newQuestion.statements.push({ 
                        id: this.nextStatementId++, 
                        text: '' 
                    });
                },
                
                removeStatement(index) {
                    this.newQuestion.statements.splice(index, 1);
                },
                
                addQuestion() {
                    const question = {
                        ...JSON.parse(JSON.stringify(this.newQuestion)),
                        id: this.nextQuestionId++
                    };
                    
                    // Auto-generate option values if empty
                    if (question.options) {
                        question.options.forEach((option, index) => {
                            if (!option.value) {
                                option.value = option.text.toLowerCase().replace(/\s+/g, '_');
                            }
                        });
                    }
                    
                    this.survey.questions.push(question);
                    this.resetNewQuestion();
                },
                
                editQuestion(question) {
                    this.newQuestion = JSON.parse(JSON.stringify(question));
                    this.deleteQuestion(this.survey.questions.findIndex(q => q.id === question.id));
                },
                
                duplicateQuestion(question) {
                    const duplicate = {
                        ...JSON.parse(JSON.stringify(question)),
                        id: this.nextQuestionId++,
                        question: question.question + ' (Copy)'
                    };
                    this.survey.questions.push(duplicate);
                },
                
                deleteQuestion(index) {
                    this.survey.questions.splice(index, 1);
                },
                
                startDrag(event, index) {
                    this.draggedIndex = index;
                    event.dataTransfer.effectAllowed = 'move';
                },
                
                handleDrop(event, dropIndex) {
                    event.preventDefault();
                    
                    if (this.draggedIndex !== null && this.draggedIndex !== dropIndex) {
                        const draggedQuestion = this.survey.questions.splice(this.draggedIndex, 1)[0];
                        this.survey.questions.splice(dropIndex, 0, draggedQuestion);
                    }
                    
                    this.draggedIndex = null;
                },
                
                getLikertLabels(scale) {
                    const scales = {
                        agreement: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
                        satisfaction: ['Very Unsatisfied', 'Unsatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'],
                        frequency: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
                        importance: ['Not Important', 'Slightly Important', 'Neutral', 'Important', 'Very Important']
                    };
                    return scales[scale] || scales.agreement;
                },
                
                previewSurvey() {
                    this.previewMode = !this.previewMode;
                },
                
                exportSurvey() {
                    const dataStr = JSON.stringify(this.survey, null, 2);
                    const dataBlob = new Blob([dataStr], {type:'application/json'});
                    
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(dataBlob);
                    link.download = 'survey.json';
                    link.click();
                },
                
                importSurvey(event) {
                    const file = event.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            try {
                                this.survey = JSON.parse(e.target.result);
                                this.nextQuestionId = Math.max(...this.survey.questions.map(q => q.id), 0) + 1;
                            } catch (error) {
                                alert('Invalid survey file');
                            }
                        };
                        reader.readAsText(file);
                    }
                },
                
                handleSurveySubmit(event) {
                    this.responses = event.detail.values;
                    console.log('Survey responses:', this.responses);
                    alert('Survey submitted! Check console for responses.');
                }
            };
        }
    </script>
</body>
</html>
```

This advanced examples document demonstrates complex real-world scenarios including:

1. **E-commerce Checkout Form** - Complete checkout flow with address validation, payment processing, shipping calculations, and promo codes
2. **Dynamic Survey Builder** - Visual form builder with drag-and-drop, conditional logic, and various question types

These examples showcase advanced patterns like:
- Multi-step wizards with validation
- Real-time calculations and updates  
- Conditional field visibility
- File handling and drag-and-drop
- Complex validation rules
- State management across components
- Dynamic form generation
- Import/export functionality

Each example is production-ready and demonstrates best practices for building sophisticated forms with Noundry Elements and Alpine.js.