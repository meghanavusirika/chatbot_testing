# New Haven Mortgage Chatbot Integration Guide

This guide explains how to integrate the mortgage eligibility chatbot widget into any webpage.

## 📋 Step-by-Step to Add to Any Page:

### Step 1: Add CSS link in `<head>`
```html
<!-- Chatbot Styles -->
<link rel="stylesheet" href="nhmc-mortgage-chatbot-v1.0/chatbot.css?v=71">
```

### Step 2: Add chatbot HTML before `</body>`
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
    <button id="chatbot-toggle" aria-label="Open chat with mortgage assistant">
        💬
    </button>
    <!-- Chat Window (hidden by default) -->
    <div id="chatbot-window" aria-live="polite" aria-atomic="false" hidden>
        <div id="chatbot-header">
            <span>Mortgage Eligibility Assistant</span>
        </div>
        <div id="chatbot-messages" tabindex="0" aria-label="Chat messages"></div>
        <form id="chatbot-form" autocomplete="off">
            <input type="text" id="chatbot-input" placeholder="Type your message..." aria-label="Type your message" required style="border-radius: 30px !important;" />
            <button type="submit" aria-label="Send">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
                </svg>
            </button>
        </form>
        <div id="chatbot-disclaimer">
            <small>
                Disclaimer: All calculations provided by this assistant are approximate and for informational purposes only. They do not constitute an official mortgage approval or offer. Please contact our team for a formal assessment. The information provided here is confidential and not used for any other purposes.
            </small>
        </div>
    </div>
</div>
```

### Step 3: Add JavaScript files before `</body>`
```html
<!-- Chatbot Dependencies -->
<script src="nhmc-mortgage-chatbot-v1.0/locations_array.js"></script>
<script src="nhmc-mortgage-chatbot-v1.0/chatbot.js?v=71"></script>
```

## 🔑 Key Requirements:

- **File Structure**: Ensure the chatbot folder `nhmc-mortgage-chatbot-v1.0/` is in the same directory as your HTML file
- **Unique IDs**: The chatbot uses specific IDs (`chatbot-widget`, `chatbot-toggle`, etc.) - make sure these don't conflict with existing page elements
- **CSS Loading**: The chatbot CSS must load before any custom page styles that might override it
- **JavaScript Order**: Load `locations_array.js` first, then `chatbot.js`


