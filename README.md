# Noundry Elements

> A powerful, lightweight form validation library for modern web applications

Noundry Elements is a plain JavaScript form validation library inspired by [Informel](https://github.com/juliendelort/informel), built specifically for vanilla JavaScript and Alpine.js integration. It provides comprehensive form validation, state management, and seamless user experience without the overhead of heavy frameworks.

## 🚀 Features

- ✅ **Web Component Architecture** - Custom `<noundry-element>` tag
- ✅ **Native HTML5 Validation** - Leverages built-in browser validation
- ✅ **Custom Validation Rules** - Add your own validation logic
- ✅ **Real-time State Tracking** - Monitor dirty, valid, and submitting states
- ✅ **Automatic Error Display** - Creates and manages error message elements
- ✅ **AJAX Form Submission** - Built-in fetch API integration
- ✅ **Alpine.js Integration** - Seamless reactive integration
- ✅ **Framework Agnostic** - Works with any JavaScript framework or vanilla JS
- ✅ **Accessibility Ready** - ARIA live regions and screen reader support
- ✅ **TypeScript Ready** - Full TypeScript support included
- ✅ **Lightweight** - ~8KB minified, zero dependencies

## 📦 Installation

### NPM (Recommended)
```bash
npm install @noundryfx/noundry-elements
```

View on npmjs.com: [https://www.npmjs.com/package/@noundryfx/noundry-elements](https://www.npmjs.com/package/@noundryfx/noundry-elements)

### CDN
```html
<script src="https://unpkg.com/@noundryfx/noundry-elements@latest/noundry-elements.js"></script>
```

### Download
Download the `noundry-elements.js` file and include it in your project.

## 🏁 Quick Start

### 1. Basic HTML Setup
```html
<!DOCTYPE html>
<html>
<head>
    <title>My Form</title>
</head>
<body>
    <noundry-element>
        <form action="/api/contact" method="POST">
            <input type="text" name="name" required data-error="Name is required">
            <input type="email" name="email" required data-error="Valid email required">
            <button type="submit">Submit</button>
        </form>
    </noundry-element>

    <script src="noundry-elements.js"></script>
</body>
</html>
```

### 2. With Alpine.js
```html
<div x-data="{ formData: {}, formState: {} }">
    <noundry-element 
        x-ref="myForm"
        @noundry-change="formData = $event.detail.values; formState = $refs.myForm.$noundry"
    >
        <form>
            <input type="text" name="username" x-model="formData.username">
            <button :disabled="!formState.isValid">Submit</button>
        </form>
    </noundry-element>
</div>
```

### 3. JavaScript API
```javascript
const formElement = document.querySelector('noundry-element');

// Listen for events
formElement.addEventListener('noundry-submit', (e) => {
    console.log('Form data:', e.detail.values);
});

// Access form state
const state = formElement.$noundry;
console.log(state.isValid, state.isDirty, state.errors);

// Programmatic control
formElement.setValues({ name: 'John Doe' });
formElement.reset();
```

## 📚 Documentation

### Core Documentation
- [**API Reference**](docs/API.md) - Complete API documentation
- [**Form Elements Guide**](docs/FORM-ELEMENTS.md) - All supported input types and configurations
- [**Validation Guide**](docs/VALIDATION.md) - Custom validation rules and error handling
- [**Alpine.js Integration**](docs/ALPINE-INTEGRATION.md) - Reactive integration patterns
- [**Advanced Examples**](docs/ADVANCED-EXAMPLES.md) - Complex form patterns and use cases

### Live Examples
- [**Basic Contact Form**](example-basic.html) - Simple form with validation
- [**Customer Survey**](sample-survey.html) - Multi-step survey with ratings
- [**Job Application**](sample-job-application.html) - Complex form with file uploads
- [**Advanced Contact**](sample-contact.html) - Dynamic fields and file attachments
- [**User Registration**](sample-registration.html) - Multi-step registration wizard

## 🎯 Key Concepts

### Attributes
Configure form behavior using HTML attributes:

| Attribute | Description |
|-----------|-------------|
| `error-disable-submit` | Disable submit button when form has validation errors |
| `reset-on-submit` | Automatically reset form after successful submission |
| `default-submit` | Allow default form submission behavior (no AJAX) |

### Events
Listen for form lifecycle events:

| Event | Description | Detail Properties |
|-------|-------------|------------------|
| `noundry-input` | Fired on input events | `field`, `value`, `values` |
| `noundry-change` | Fired on change events | `field`, `value`, `values` |
| `noundry-submit` | Fired on form submission | `values`, `formData` |
| `noundry-invalid` | Fired when validation fails | `errors` |
| `noundry-reset` | Fired when form is reset | - |
| `noundry-request-start` | AJAX request started | - |
| `noundry-request-success` | AJAX request succeeded | `response` |
| `noundry-request-error` | AJAX request failed | `error` |

### State Properties
Access real-time form state via `$noundry`:

```javascript
const form = document.querySelector('noundry-element');
const state = form.$noundry;

// State properties
state.values        // Current form values (object)
state.errors        // Current validation errors (object)
state.isDirty       // Has form been modified? (boolean)
state.isValid       // Is form currently valid? (boolean)
state.isSubmitting  // Is form being submitted? (boolean)
```

## 🛠️ Advanced Usage

### Custom Validation
```javascript
formElement.setValidationRule('password', (value, allValues) => {
    if (!value || value.length < 8) {
        return 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(value)) {
        return 'Password must contain uppercase letter';
    }
    return null; // Valid
});
```

### Error Message Customization
```html
<!-- Custom error messages -->
<input 
    type="email" 
    name="email" 
    required
    data-error="Please enter a valid email address"
    data-error-typemismatch="Email format is incorrect"
    data-error-valuemissing="Email is required"
>
```

### Alpine.js Reactive Integration
```html
<div x-data="contactForm()">
    <noundry-element 
        x-ref="form"
        @noundry-input="updateState"
        @noundry-submit="handleSubmit"
    >
        <form>
            <input type="text" name="name" x-model="formData.name">
            <div x-show="formState.errors.name" x-text="formState.errors.name"></div>
            <button :disabled="!formState.isValid">Submit</button>
        </form>
    </noundry-element>
</div>

<script>
function contactForm() {
    return {
        formData: {},
        formState: {},
        updateState() {
            this.formState = this.$refs.form.$noundry;
            this.formData = this.formState.values;
        },
        handleSubmit(event) {
            console.log('Submitted:', event.detail.values);
        }
    };
}
</script>
```

## 🎨 Styling

Style form states using CSS attribute selectors:

```css
/* Form states */
noundry-element[data-dirty="true"] { border-left: 4px solid orange; }
noundry-element[data-valid="true"] { border-left: 4px solid green; }
noundry-element[data-valid="false"] { border-left: 4px solid red; }
noundry-element[data-submitting="true"] { opacity: 0.7; }

/* Error messages */
.noundry-error {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}

/* Custom styling for different validation states */
input:invalid { border-color: #ef4444; }
input:valid { border-color: #10b981; }
```

## 🌐 Browser Support

- **Chrome/Edge**: 67+
- **Firefox**: 63+  
- **Safari**: 10.3+
- **All modern browsers** with Custom Elements v1 support

For older browsers, include the [Web Components polyfill](https://www.webcomponents.org/polyfills).

## 🔧 Configuration Options

### Form Element Attributes

```html
<noundry-element
    error-disable-submit    <!-- Disable submit on errors -->
    reset-on-submit        <!-- Reset after successful submission -->
    default-submit="false" <!-- Control AJAX behavior -->
>
    <form>...</form>
</noundry-element>
```

### Input Field Configuration

```html
<!-- Basic validation -->
<input type="text" name="username" required minlength="3">

<!-- Custom error messages -->
<input 
    type="password" 
    name="password" 
    required
    minlength="8"
    data-error="Password is required"
    data-error-tooshort="Password must be at least 8 characters"
>

<!-- Pattern validation -->
<input 
    type="tel" 
    name="phone"
    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
    data-error-patternmismatch="Phone format: 123-456-7890"
>

<!-- Custom error placement -->
<input type="email" name="email" required>
<div data-error-for="email" class="custom-error-style"></div>
```

## 📋 Form Element Types

Noundry Elements supports all HTML5 input types and form controls:

### Text Inputs
- `text`, `email`, `url`, `tel`, `password`
- `search`, `number`, `range`
- `date`, `time`, `datetime-local`, `month`, `week`

### Selection Inputs  
- `radio`, `checkbox`
- `select` (single and multiple)
- `datalist`

### File Inputs
- `file` (single and multiple)
- File size and type validation

### Text Areas
- `textarea` with character counting
- Auto-resize functionality

### Specialized Inputs
- `hidden` fields
- `color` picker
- Custom validation rules for any input type

## 🚀 Performance

- **Lightweight**: ~8KB minified (3KB gzipped)
- **Zero Dependencies**: No external libraries required
- **Lazy Validation**: Only validates on user interaction
- **Efficient DOM Updates**: Minimal DOM manipulation
- **Memory Efficient**: Proper cleanup on element removal

## 🔒 Security

- **XSS Protection**: Sanitized error message display
- **CSRF Ready**: Works with CSRF tokens
- **Content Security Policy**: Compatible with strict CSP
- **No Eval**: No dynamic code execution

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Setup
```bash
git clone https://github.com/your-username/noundry-elements.git
cd noundry-elements
npm install
npm run dev      # Start development server
npm run test     # Run tests
npm run build    # Build for production
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆚 Comparison

| Feature | Noundry Elements | Informel | React Hook Form | Formik |
|---------|------------------|----------|----------------|--------|
| **Framework** | Vanilla JS + Alpine.js | Svelte | React | React |
| **Bundle Size** | 8KB | 12KB | 25KB | 45KB |
| **Dependencies** | Zero | Svelte | React | React + Yup |
| **Custom Elements** | ✅ | ✅ | ❌ | ❌ |
| **Alpine.js Integration** | ✅ | ❌ | ❌ | ❌ |
| **TypeScript** | ✅ | ✅ | ✅ | ✅ |
| **Form Arrays** | ⚠️ (planned) | ✅ | ✅ | ✅ |
| **Schema Validation** | ⚠️ (planned) | ✅ (Zod) | ✅ (Yup) | ✅ (Yup) |

## 💡 FAQ

**Q: Can I use Noundry Elements with React/Vue/Angular?**  
A: Yes! As a Web Component, it works with any framework. However, framework-specific form libraries might be more idiomatic.

**Q: Does it support nested forms or form arrays?**  
A: Basic nested object support is included. Advanced form arrays are planned for v2.0.

**Q: Can I customize the error message styling?**  
A: Yes! Error elements use the `.noundry-error` class and can be fully customized via CSS.

**Q: Is server-side validation supported?**  
A: Yes! Listen for `noundry-submit` events and add server validation errors programmatically.

**Q: Can I disable AJAX and use traditional form submission?**  
A: Yes! Add `default-submit="true"` to allow traditional form submission.

## 🎯 Roadmap

### v1.1 (Current)
- ✅ Core validation and state management
- ✅ Alpine.js integration
- ✅ File upload support
- ✅ Custom validation rules

### v1.2 (Next)
- 🔄 Schema validation (Zod integration)
- 🔄 Form arrays and nested forms
- 🔄 Enhanced TypeScript definitions
- 🔄 React integration helpers

### v2.0 (Future)
- 📋 Visual form builder
- 📋 Advanced field types
- 📋 Multi-language support
- 📋 Performance optimizations

---

**Made with ❤️ for the modern web**

[GitHub](https://github.com/your-username/noundry-elements) • [Documentation](docs/) • [Examples](examples/) • [Discord](https://discord.gg/noundry)