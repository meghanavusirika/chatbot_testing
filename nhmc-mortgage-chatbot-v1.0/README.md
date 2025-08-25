# Mortgage Eligibility Chatbot Widget

## Overview

The Mortgage Eligibility Chatbot Widget is a professional, interactive tool designed to help users check their mortgage eligibility through a conversational interface. The chatbot calculates Loan-to-Value (LTV) ratios and provides personalized guidance based on user inputs.

## Features

- **Interactive Conversation Flow**: Guided questionnaire for mortgage eligibility assessment
- **LTV Calculation**: Automatic calculation of Loan-to-Value ratios
- **Professional UI**: Clean, modern interface with typing animations
- **Proactive Engagement**: Chat invitation popup to engage users
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Contact Integration**: Direct connection to contact forms
- **State Management**: Robust conversation flow management

## Technical Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- CSS3 support for animations and styling
- HTTPS recommended for production deployment

## Integration Instructions

### Step 1: Download Required Files

Ensure you have the following files in your project directory:

```
your-project/
├── chatbot.js
├── chatbot.css
├── locations_array.js
└── index.html (example implementation)
```

### Step 2: Add CSS to Your Website

Include the chatbot stylesheet in your HTML `<head>` section:

```html
<head>
    <!-- Your existing head content -->
    <link rel="stylesheet" href="path/to/chatbot.css">
</head>
```

### Step 3: Add HTML Structure

Add the following HTML structure to your website (preferably just before the closing `</body>` tag):

```html
<!-- Mortgage Eligibility Chatbot Widget -->
<div id="chatbot-widget">
    <!-- Proactive Chat Prompt -->
    <div id="chatbot-prompt" class="chatbot-prompt">
        <div class="prompt-content">
            <span class="prompt-message">👋 Hey! Want to check if you're eligible for a mortgage? I can help!</span>
            <button class="prompt-close" aria-label="Close prompt">×</button>
        </div>
    </div>
    
    <!-- Chat Toggle Button -->
    <button id="chatbot-toggle" aria-label="Open chat with mortgage assistant">
        💬
    </button>
    
    <!-- Chat Window -->
    <div id="chatbot-window" aria-live="polite" aria-atomic="false" hidden>
        <div id="chatbot-header">
            <span>Mortgage Eligibility Assistant</span>
        </div>
        
        <!-- Chat Messages -->
        <div id="chatbot-messages" tabindex="0" aria-label="Chat messages"></div>
        
        <!-- Chat Input -->
        <form id="chatbot-form" autocomplete="off">
            <input type="text" id="chatbot-input" placeholder="Type your message..." aria-label="Type your message" required />
            <button type="submit" aria-label="Send">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
                </svg>
            </button>
        </form>
        
        <!-- Disclaimer -->
        <div id="chatbot-disclaimer">
            <small>
                Disclaimer: All calculations provided by this assistant are approximate and for informational purposes only. They do not constitute an official mortgage approval or offer. Please contact our team for a formal assessment. The information provided here is confidential and not used for any other purposes.
            </small>
        </div>
    </div>
</div>
```

### Step 4: Add JavaScript Files

Include the required JavaScript files just before the closing `</body>` tag:

```html
<!-- Locations Data -->
<script src="path/to/locations_array.js"></script>
<!-- Chatbot Logic -->
<script src="path/to/chatbot.js"></script>
</body>
```

### Step 5: Customize Contact URL

Update the contact URL in `chatbot.js` to point it out correctly:

```javascript
// In chatbot.js, line 8
const CONTACT_URL = 'https://your-website.com/contact-us/';
```

## Styling Customization

### Primary Colors

The chatbot uses a green color scheme. To customize colors, update these CSS variables in `chatbot.css`:

```css
:root {
    --chatbot-primary: #009700;      /* Main green color */
    --chatbot-secondary: #00b33c;    /* Secondary green color */
    --chatbot-background: #ffffff;   /* Background color */
    --chatbot-text: #333333;         /* Text color */
}
```

### Typography

Update font families in `chatbot.css`:

```css
#chatbot-widget {
    font-family: 'Your Font', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

## Browser Compatibility

- **Chrome**: 60+
- **Firefox**: 55+
- **Safari**: 12+
- **Edge**: 79+

## Performance Considerations

- **File Size**: Total widget size is approximately 120KB (CSS + JS + Locations)
- **Loading**: Widget loads asynchronously and doesn't block page rendering
- **Memory**: Minimal memory footprint with efficient state management
- **Network**: No external dependencies or API calls

## Troubleshooting

### Common Issues

1. **Widget Not Appearing**
   - Check that all required files are properly linked
   - Verify JavaScript is enabled in the browser
   - Check browser console for errors

2. **Styling Issues**
   - Ensure `chatbot.css` is loaded before any custom styles
   - Check for CSS conflicts with existing site styles

3. **Functionality Problems**
   - Check browser console for JavaScript errors
   - Verify all HTML elements have correct IDs
   - Ensure contact URL is accessible

## Security Considerations

- **HTTPS**: Deploy on HTTPS in production environments
- **Data Privacy**: No user data is stored or transmitted
- **XSS Protection**: Input sanitization implemented
- **CSP Compliance**: Widget is compatible with Content Security Policy

## Support and Maintenance

### Version Information

- **Current Version**: 1.0.0
- **Last Updated**: 08-13-2025
- **Company**: New Haven Mortgage Corporation
- **Author**: Meghana Reddy Vusirika 

### Updates and Maintenance

- Regularly test the widget across different browsers
- Monitor user feedback and interaction patterns
- Update contact URLs as needed
- Review and update styling to match brand guidelines

## License

This chatbot widget is proprietary software developed by New Haven Mortgage Corporation. All rights reserved.

---

For technical support or customization requests, please contact the development team at New Haven Mortgage Corporation.
