// Project: Mortgage Eligibility Assistant
// Company: New Haven Mortgage Corporation
// Author: Meghana Reddy Vusirika
// Description: Core logic for mortgage eligibility verification and LTV calculation.
// Last Updated: 08-13-2025

(function() {
    
    // --- Configuration ---
    const CONTACT_URL = 'https://www.newhavenmortgage.com/borrower/contact-us/';

    // --- State Machine States ---
    const STATES = {
        START: 'start',
        WELCOME: 'welcome',
        PROPERTY_TYPE: 'property_type',
        COMMERCIAL: 'commercial',
        RESIDENTIAL: 'residential',
        PURCHASE_REFINANCE: 'purchase_refinance',
        PURCHASE: 'purchase',
        REFINANCE: 'refinance',
        LOCATION: 'location',
        LOAN_AMOUNT: 'loan_amount',
        PROPERTY_VALUE: 'property_value',
        DEPOSIT_ASK: 'deposit_ask',
        DEPOSIT_AMOUNT: 'deposit_amount',
        COLLATERAL_ASK: 'collateral_ask',
        COLLATERAL_VALUE: 'collateral_value',
        EXISTING_MORTGAGE_ASK: 'existing_mortgage_ask',
        EXISTING_MORTGAGE_AMOUNT: 'existing_mortgage_amount',

        LTV_RESULT: 'ltv_result',
        HIGH_LTV_COLLATERAL: 'high_ltv_collateral',
        NOT_ELIGIBLE: 'not_eligible',
        GOODBYE: 'goodbye',
        END: 'end',
        CHECK_ANOTHER: 'check_another',
    };

    // --- Chatbot State ---
    let state = STATES.START;
    let context = {};

    // --- DOM Elements ---
    
    const widget = document.getElementById('chatbot-widget');
    const toggleBtn = document.getElementById('chatbot-toggle');
    const chatWindow = document.getElementById('chatbot-window');
    const messagesDiv = document.getElementById('chatbot-messages');
    const form = document.getElementById('chatbot-form');
    const input = document.getElementById('chatbot-input');
    const prompt = document.getElementById('chatbot-prompt');
    const promptClose = document.querySelector('.prompt-close');
    
    

    // --- Proactive Chat Prompt Functions ---
    function showProactivePrompt() {
        if (prompt && chatWindow.hidden) {
            prompt.style.display = 'block';
            // Auto-hide after 8 seconds
            setTimeout(() => {
                hideProactivePrompt();
            }, 8000);
        }
    }

    function hideProactivePrompt() {
        if (prompt) {
            prompt.style.display = 'none';
        }
    }

    function handlePromptClose() {
        hideProactivePrompt();
        sessionStorage.setItem('chatbot-prompt-closed', 'true');
    }

    function handlePromptClick() {
        hideProactivePrompt();
        // Open the chat when prompt is clicked
        if (chatWindow.hidden) {
            toggleChat();
        }
    }

    // Initialize proactive prompt
    function initProactivePrompt() {
        if (prompt && promptClose) {
            // Check if prompt was already closed in this session
            const promptClosed = sessionStorage.getItem('chatbot-prompt-closed');
            
            if (!promptClosed) {
                // Show prompt after 2 seconds
                setTimeout(() => {
                    showProactivePrompt();
                }, 2000);
            }

            // Add event listeners
            promptClose.addEventListener('click', handlePromptClose);
            prompt.addEventListener('click', handlePromptClick);
        }
    }

    // --- Utility Functions ---
    function addMessage(text, sender = 'bot', options = {}) {
        if (!text && !options.button) return; 
        const msgDiv = document.createElement('div');
        msgDiv.className = `chatbot-message ${sender}`;
        if (text) {
            const lastMessage = messagesDiv.lastElementChild;
            const shouldShowLabel = !lastMessage || 
                                  !lastMessage.classList.contains(sender) ||
                                  lastMessage.querySelector('.chatbot-option-btn') ||
                                  lastMessage.querySelector('a');
            
            if (shouldShowLabel) {
                const label = document.createElement('div');
                label.className = 'chatbot-label';
                label.textContent = sender === 'bot' ? 'Meghana' : 'You';
                msgDiv.appendChild(label);
            }
            const bubble = document.createElement('div');
            bubble.className = 'chatbot-bubble';
            bubble.innerHTML = text;
            msgDiv.appendChild(bubble);
        }
        if (options.button) {
            msgDiv.appendChild(options.button);
        }
        messagesDiv.appendChild(msgDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    function addBotMessage(text) {
        addMessage(text, 'bot');
    }
    function addUserMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chatbot-message user';
        
        const label = document.createElement('div');
        label.className = 'chatbot-label';
        label.textContent = 'You';
        msgDiv.appendChild(label);
        
        const bubble = document.createElement('div');
        bubble.className = 'chatbot-bubble';
        bubble.style.backgroundColor = '#00930c';
        bubble.style.color = '#fff';
        bubble.style.borderRadius = '9px';
        bubble.style.padding = '8px 16px';
        bubble.style.maxWidth = 'fit-content';
        bubble.style.marginLeft = 'auto';
        bubble.textContent = text;
        
        msgDiv.appendChild(bubble);
        messagesDiv.appendChild(msgDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    function showTypingIndicator() {

        const typingDiv = document.createElement('div');
        typingDiv.className = 'chatbot-message bot typing-indicator';
        typingDiv.id = 'typing-indicator';
        
        const label = document.createElement('div');
        label.className = 'chatbot-label';
        label.textContent = 'Meghana';
        typingDiv.appendChild(label);
        
        const bubble = document.createElement('div');
        bubble.className = 'chatbot-bubble typing-bubble';
        bubble.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
        typingDiv.appendChild(bubble);
        
        messagesDiv.appendChild(typingDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

    }

    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    function addBotMessageWithTyping(text, delay = 1000) {
        showTypingIndicator();
        setTimeout(() => {
            hideTypingIndicator();
            setTimeout(() => {
                addBotMessage(text);
            }, 100);
        }, delay);
    }

    function addBotMessageWithTypingAndButtons(text, buttons, delay = 1000) {
        showTypingIndicator();
        setTimeout(() => {
            hideTypingIndicator();
            setTimeout(() => {
                const msgDiv = document.createElement('div');
                msgDiv.className = 'chatbot-message bot';
                
                const label = document.createElement('div');
                label.className = 'chatbot-label';
                label.textContent = 'Meghana';
                msgDiv.appendChild(label);
                
                const bubble = document.createElement('div');
                bubble.className = 'chatbot-bubble';
                bubble.innerHTML = text;
                msgDiv.appendChild(bubble);
                
                const btnGroup = document.createElement('div');
                btnGroup.style.display = 'flex';
                btnGroup.style.gap = '8px';
                btnGroup.style.margin = '8px 0 16px 0';
                buttons.forEach(({ label, value }) => {
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.textContent = label;
                    btn.className = 'chatbot-option-btn';
                    btn.addEventListener('click', () => handleUserInput(value, true, label));
                    btnGroup.appendChild(btn);
                });
                msgDiv.appendChild(btnGroup);
                
                messagesDiv.appendChild(msgDiv);
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
            }, 100);
        }, delay);
    }

    function addBotButtonsWithTyping(buttons, delay = 800) {
        showTypingIndicator();
        setTimeout(() => {
            hideTypingIndicator();
            setTimeout(() => {
                addBotButtons(buttons);
            }, 100);
        }, delay);
    }

    function addBotButtons(buttons) {
        const btnGroup = document.createElement('div');
        btnGroup.style.display = 'flex';
        btnGroup.style.gap = '8px';
        btnGroup.style.margin = '8px 0 16px 0';
        buttons.forEach(({ label, value }) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = label;
            btn.className = 'chatbot-option-btn';
            btn.addEventListener('click', () => handleUserInput(value, true, label));
            btnGroup.appendChild(btn);
        });
        messagesDiv.appendChild(btnGroup);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    function showUserSelection(selection) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chatbot-message user';
        
        // Add the "You" label
        const label = document.createElement('div');
        label.className = 'chatbot-label';
        label.textContent = 'You';
        msgDiv.appendChild(label);
        
        const bubble = document.createElement('div');
        bubble.className = 'chatbot-bubble';
        bubble.style.backgroundColor = '#00930c';
        bubble.style.color = '#fff';
        bubble.style.borderRadius = '9px';
        bubble.style.padding = '8px 16px';
        bubble.style.maxWidth = 'fit-content';
        bubble.style.marginLeft = 'auto';
        
        // Capitalize the first letter of the selection
        const capitalizedSelection = selection.charAt(0).toUpperCase() + selection.slice(1).toLowerCase();
        bubble.textContent = capitalizedSelection;
        
        msgDiv.appendChild(bubble);
        messagesDiv.appendChild(msgDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    function resetChat() {

        messagesDiv.innerHTML = '';
        state = STATES.START;
        context = {};
        setTimeout(() => runState(), 500);
    }

    // --- LTV Calculation ---
    function calculateLTV(context) {
        let ltv = 0;
        
        if (context.flow === 'purchase') {
            if (context.deposit > 0) {
                // LTV = (Loan Amount/Estimated Property Value + Deposit) x 100
                ltv = (context.loanAmount / (context.propertyValue + context.deposit)) * 100;
            } else if (context.collateralValue > 0) {
                // LTV = (Loan Amount/Estimated Collateral Property Value) x 100
                ltv = (context.loanAmount / context.collateralValue) * 100;
            } else {
                // No deposit or collateral - not eligible
                return null;
            }
        } else if (context.flow === 'refinance') {
            if (context.existingMortgage > 0) {
                // LTV = (Loan Amount + Existing Mortgages/Estimated Property Value) x 100
                ltv = ((context.loanAmount + context.existingMortgage) / context.propertyValue) * 100;
            } else {
                // LTV = (Loan Amount/Estimated Property Value) x 100
                ltv = (context.loanAmount / context.propertyValue) * 100;
            }
        }
        
        return ltv;
    }



    // --- State Machine Logic ---
    function runState() {

        switch (state) {
            case STATES.START:

                addBotMessageWithTyping('Hi there! 👋 I\'m Meghana.');
                setTimeout(() => {
                    addBotMessageWithTyping('I\'m your mortgage assistant chatbot 🤖, and I\'ll be helping you check your mortgage eligibility today. It\'s super simple, I\'ll just ask you a few quick questions to get started.');
                    setTimeout(() => {
                        addBotButtons([
                            { label: '🚀 Let\'s get started – click here', value: 'start' },
                        ]);
                    }, 1500);
                }, 1500);
                break;
            case STATES.WELCOME:
                addBotMessageWithTyping('Great! First up - what kind of property are you looking to get a mortgage for?');
                setTimeout(() => {
                    addBotButtons([
                        { label: 'Commercial', value: 'commercial' },
                        { label: 'Residential', value: 'residential' },
                    ]);
                }, 1500);
                break;
            case STATES.COMMERCIAL:
                addBotMessageWithTyping('Thanks for letting us know! Commercial mortgages are a bit more detailed, so one of our team members will be the best person to help you out. Please click the button below to leave your contact information for us to reach out to you.');
                setTimeout(() => {
                    addContactButton('Leave us a message');
                    state = STATES.END;
                    setTimeout(() => runState(), 200);
                }, 1500);
                break;
            case STATES.RESIDENTIAL:
                addBotMessageWithTyping('Great Choice! Let\'s talk more about your residential plans.');
                setTimeout(() => {
                    addBotMessageWithTyping('So, are you planning to buy a new home or refinance your current mortgage?');
                    setTimeout(() => {
                        addBotButtons([
                            { label: 'Purchase', value: 'purchase' },
                            { label: 'Refinance', value: 'refinance' },
                        ]);
                    }, 1500);
                }, 1500);
                break;
            case STATES.PURCHASE:
                addBotMessageWithTyping('Great! Please choose the location of the property from the dropdown menu below.');
                setTimeout(() => {
                    addLocationDropdown();
                }, 2000);
                break;
            case STATES.REFINANCE:
                addBotMessageWithTyping('Great! Please choose the location of the property from the dropdown menu below.');
                setTimeout(() => {
                    addLocationDropdown();
                }, 2000);
                break;
            case STATES.LOCATION:
                if (context.flow === 'purchase') {
                    addBotMessageWithTyping('Awesome! How much are you looking to borrow for your purchase?');
                } else if (context.flow === 'refinance') {
                    addBotMessageWithTyping('Awesome! How much are you looking to borrow for your refinance?');
                }
                break;
            case STATES.LOAN_AMOUNT:
                if (context.flow === 'purchase') {
                    addBotMessageWithTyping('Nice! What\'s the estimated value of the property you are looking to buy?');
                } else if (context.flow === 'refinance') {
                    addBotMessageWithTyping('Nice! What\'s the estimated value of your current property?');
                }
                break;
            case STATES.PROPERTY_VALUE:
                if (context.flow === 'purchase') {
                    addBotMessageWithTyping('Almost there! Would you be okay to put a deposit on the property you\'re buying?');
                } else if (context.flow === 'refinance') {
                    addBotMessageWithTyping('Almost there! Do you have any existing mortgages on this property?');
                }
                setTimeout(() => {
                    addBotButtons([
                        { label: 'Yes', value: 'yes' },
                        { label: 'No', value: 'no' },
                    ]);
                }, 1500);
                break;
            case STATES.DEPOSIT_ASK:
                addBotMessageWithTyping('Great! How much are you thinking of putting down for the deposit?');
                break;
            case STATES.DEPOSIT_AMOUNT:
                addBotMessageWithTyping('Great! How much are you thinking of putting down for the deposit?');
                break;
            case STATES.COLLATERAL_ASK:
                addBotMessageWithTyping('No worries! Do you have any collateral you can offer instead?');
                setTimeout(() => {
                    addBotButtons([
                        { label: 'Yes', value: 'yes' },
                        { label: 'No', value: 'no' },
                    ]);
                }, 1500);
                break;
            case STATES.COLLATERAL_VALUE:
                addBotMessageWithTyping('Perfect! What\'s the estimated value of the collateral you\'re offering?');
                break;
            case STATES.EXISTING_MORTGAGE_ASK:
                addBotMessageWithTyping('Got it! What\'s the total estimated outstanding amount on your current mortgages?');
                break;

            case STATES.LTV_RESULT:
                // Calculate LTV and respond
                const ltv = calculateLTV(context);
                context.ltv = ltv;
                
                if (ltv === null) {
                    // Not eligible (no deposit or collateral for purchase)
                    addBotMessageWithTyping('Thanks for sharing these details! While it looks like you might not meet the current eligibility criteria just yet, there are often other paths we can explore. Our team would love to help you figure out the next best step! Please click the button below to get in touch with our team.');
                    setTimeout(() => {
                        addContactButton('Get in touch with our team');
                        state = STATES.END;
                    }, 1500);
                } else if (ltv >= 60 && ltv <= 80) {
                    // Eligible (60-80%)
                    addBotMessageWithTyping(`Congratulations! 🎉 Based on the information you provided, you appear to be eligible for a mortgage loan.`);
                    setTimeout(() => {
                        addBotMessageWithTyping('If you\'d like, please click the button below to connect with one of our representatives who can help you take the next steps and answer any questions you may have.');
                        setTimeout(() => {
                            addContactButton('Get in touch with our team');
                            state = STATES.END;
                        }, 1500);
                    }, 1500);
                } else if (ltv > 80) {
                    // High LTV - ask about additional collateral
                    addBotMessageWithTyping('Based on the information provided, your LTV ratio is quite high. Do you have another property you can use as collateral?');
                    setTimeout(() => {
                        addBotButtonsWithTyping([
                            { label: 'Yes', value: 'yes' },
                            { label: 'No', value: 'no' },
                        ]);
                    }, 1000);
                    // Stay in LTV_RESULT state to handle the user response
                    // Store the LTV for later use
                    context.ltv = ltv;
                } else {
                    // Low LTV - still eligible
                    addBotMessageWithTyping(`Congratulations! 🎉 Based on the information you provided, you appear to be eligible for a mortgage loan.`);
                    setTimeout(() => {
                        addBotMessageWithTyping('If you\'d like, please click the button below to connect with our team to help you take the next steps and answer any questions you may have.');
                        setTimeout(() => {
                            addContactButton('Get in touch with our team');
                            state = STATES.END;
                        }, 1500);
                    }, 1500);
                }
                break;
            case STATES.HIGH_LTV_COLLATERAL:
                // Show the appropriate message based on the user's response
                if (context.additionalCollateral === 'no') {
                    addBotMessageWithTyping('Thanks for sharing these details! While it looks like you might not meet all the criteria for a mortgage right now, don\'t worry - our team is here to help you explore other options or offer guidance on how to improve your eligibility. Please click the button below to get in touch with our team.');
                    setTimeout(() => {
                        addContactButton('Get in touch with our team');
                        state = STATES.END;
                    }, 1500);
                } else if (context.additionalCollateral === 'yes') {
                    addBotMessageWithTyping('That\'s great! We\'d be happy to connect with you. Please leave us a message with your contact information by clicking the button below, and one of our representatives will reach out to discuss your eligibility and walk you through the next steps.');
                    setTimeout(() => {
                        addContactButton('Yes, please connect me!');
                        state = STATES.END;
                    }, 1500);
                }
                break;
            case STATES.NOT_ELIGIBLE:
                addBotMessageWithTyping('Thanks for sharing these details! While it looks like you might not meet the current eligibility criteria just yet, there are often other paths we can explore. Our team would love to help you figure out the next best step! Please click the button below to get in touch with our team.');
                setTimeout(() => {
                    addContactButton('Get in touch with our team');
                    state = STATES.END;
                }, 1500);
                break;
            case STATES.END:
                // Do nothing - wait for user to click contact button
                break;
            case STATES.CHECK_ANOTHER:
                // This state is handled by the contact button click event
                break;
            case STATES.GOODBYE:
                addBotMessageWithTyping('Great helping you out today! If you have any more questions, I\'m always here to help. Or, you could leave your contact information by clicking the button below and one of our representatives will reach out to you.');
                setTimeout(() => {
                    addContactButton('Get in Touch');
                }, 1500);
                break;
            default:
                // Do nothing - wait for user input
                break;
        }
    }

    function addLocationDropdown() {
        const dropdownDiv = document.createElement('div');
        dropdownDiv.style.margin = '10px 0';
        
        const select = document.createElement('select');
        select.className = 'chatbot-location-dropdown';
        select.style.cssText = `
            padding: 8px 12px;
            border: 1.5px solid #b6e7c9;
            border-radius: 9px;
            background: #fff;
            color: #333;
            font-size: 0.9rem;
            width: 100%;
            max-width: 300px;
            cursor: pointer;
            outline: none;
        `;
        
        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '-- Select a location --';
        select.appendChild(defaultOption);
        
        // Load all 6,640 locations from the external array
        ALL_LOCATIONS.forEach(location => {
            const option = document.createElement('option');
            option.value = location.toLowerCase();
            option.textContent = location;
            select.appendChild(option);
        });
        
        // Add event listener
        select.addEventListener('change', (e) => {
            if (e.target.value) {
                // Store the location and change state to LOCATION
                context.location = e.target.value;
                state = STATES.LOCATION;
                // Show the user's selection
                showUserSelection(e.target.value);
                // Run the state to show the loan amount question
                setTimeout(() => runState(), 500);
            }
        });
        
        dropdownDiv.appendChild(select);
        messagesDiv.appendChild(dropdownDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    function addContactButton(text = 'Contact Us') {
        const btn = document.createElement('a');
        btn.href = CONTACT_URL;
        btn.target = '_blank';
        btn.rel = 'noopener noreferrer';
        btn.textContent = text;
        btn.className = 'chatbot-option-btn';
        btn.style.padding = '8px 12px';
        btn.style.fontWeight = '600';
        btn.style.fontSize = '1rem';
        btn.style.display = 'inline-block';
        btn.style.width = 'auto';
        btn.style.maxWidth = '200px';
        btn.style.whiteSpace = 'nowrap';
        btn.style.margin = '7px 0 7px 0';
        
        // Check if this is the final goodbye contact button (after user said "No" to checking another property)
        if (text === 'Get in Touch') {
            // This is the final goodbye button - no more questions, just open contact form
            btn.addEventListener('click', () => {
                // Open contact form without asking any more questions
                window.open(CONTACT_URL, '_blank');
            });
        } else {
            // This is the regular contact button - show the "check another property" question
            btn.addEventListener('click', () => {
                setTimeout(() => {
                    state = STATES.CHECK_ANOTHER;
                    addBotMessageWithTypingAndButtons('Would you like to check eligibility for another property? 😊', [
                        { label: 'Yes', value: 'check_another' },
                        { label: 'No', value: 'goodbye' }
                    ], 1000);
                }, 1000);
            });
        }
        
        messagesDiv.appendChild(btn);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    // --- User Input Handler ---
    function handleUserInput(inputValue, isButton = false, selectedLabel = null) {

        if (!isButton) addUserMessage(inputValue);
        input.value = '';
        input.blur();



        // Show user selection for specific buttons
        if (isButton && selectedLabel && inputValue.toLowerCase() !== 'start') {
            if (!selectedLabel.toLowerCase().includes('contact') && 
                !selectedLabel.toLowerCase().includes('leave') && 
                !selectedLabel.toLowerCase().includes('get in touch') &&
                !selectedLabel.toLowerCase().includes('let\'s get started')) {
                showUserSelection(selectedLabel);
            }
        }

        // State transitions
        switch (state) {
            case STATES.START:
                if (inputValue.toLowerCase() === 'start') {
                    state = STATES.WELCOME;
                } else {
                    addBotMessage('Please click the button to get started.');
                    return;
                }
                break;
            case STATES.WELCOME:
                if (inputValue.toLowerCase() === 'commercial') {
                    state = STATES.COMMERCIAL;
                } else if (inputValue.toLowerCase() === 'residential') {
                    state = STATES.RESIDENTIAL;
                } else {
                    addBotMessage('Please select an option.');
                    return;
                }
                break;
            case STATES.RESIDENTIAL:
                if (inputValue.toLowerCase() === 'purchase') {
                    state = STATES.PURCHASE;
                    context.flow = 'purchase';
                } else if (inputValue.toLowerCase() === 'refinance') {
                    state = STATES.REFINANCE;
                    context.flow = 'refinance';
                } else {
                    addBotMessage('Please select an option.');
                    return;
                }
                break;
            case STATES.PURCHASE:
            case STATES.REFINANCE:
                // These states are now handled in the location dropdown
                break;
            case STATES.LOCATION:
                // Handle loan amount input
                if (!/^\d+(\.\d+)?$/.test(inputValue.trim())) {
                    addBotMessage('Please enter a valid amount (numbers only).');
                    return;
                }
                const amt = parseFloat(inputValue);
                if (isNaN(amt) || amt <= 0) {
                    addBotMessage('Please enter a valid amount.');
                    return;
                }
                context.loanAmount = amt;
                state = STATES.LOAN_AMOUNT;
                break;
            case STATES.LOAN_AMOUNT:
                // Handle property value input
                if (!/^\d+(\.\d+)?$/.test(inputValue.trim())) {
                    addBotMessage('Please enter a valid amount (numbers only).');
                    return;
                }
                const val = parseFloat(inputValue);
                if (isNaN(val) || val <= 0) {
                    addBotMessage('Please enter a valid amount.');
                    return;
                }
                context.propertyValue = val;
                state = STATES.PROPERTY_VALUE;
                break;
            case STATES.PROPERTY_VALUE:
                if (context.flow === 'purchase') {
                    if (inputValue.toLowerCase() === 'yes') {
                        state = STATES.DEPOSIT_ASK;
                    } else if (inputValue.toLowerCase() === 'no') {
                        state = STATES.COLLATERAL_ASK;
                    } else {
                        addBotMessage('Please select an option.');
                        return;
                    }
                } else if (context.flow === 'refinance') {
                    if (inputValue.toLowerCase() === 'yes') {
                        state = STATES.EXISTING_MORTGAGE_ASK;
                    } else if (inputValue.toLowerCase() === 'no') {
                        state = STATES.LTV_RESULT;
                    } else {
                        addBotMessage('Please select an option.');
                        return;
                    }
                }
                break;
            case STATES.DEPOSIT_ASK:
                // Handle deposit amount input
                if (!/^\d+(\.\d+)?$/.test(inputValue.trim())) {
                    addBotMessage('Please enter a valid amount (numbers only).');
                    return;
                }
                const dep = parseFloat(inputValue);
                if (isNaN(dep) || dep < 0) {
                    addBotMessage('Please enter a valid amount.');
                    return;
                }
                context.deposit = dep;
                state = STATES.LTV_RESULT;
                break;
            case STATES.DEPOSIT_AMOUNT:
                if (!/^\d+(\.\d+)?$/.test(inputValue.trim())) {
                    addBotMessage('Please enter a valid amount (numbers only).');
                    return;
                }
                const depAmt = parseFloat(inputValue);
                if (isNaN(depAmt) || depAmt < 0) {
                    addBotMessage('Please enter a valid amount.');
                    return;
                }
                context.deposit = depAmt;
                state = STATES.LTV_RESULT;
                break;
            case STATES.COLLATERAL_ASK:
                if (inputValue.toLowerCase() === 'yes') {
                    state = STATES.COLLATERAL_VALUE;
                } else if (inputValue.toLowerCase() === 'no') {
                    addBotMessageWithTyping('Thanks for sharing these details! While it looks like you might not meet the current eligibility criteria just yet, there are often other paths we can explore. Our team would love to help you figure out the next best step! Please click the button below to get in touch with our team.');
                    setTimeout(() => {
                        addContactButton('Get in touch with our team');
                        state = STATES.END;
                    }, 1500);
                    return;
                } else {
                    addBotMessage('Please select an option.');
                    return;
                }
                break;
            case STATES.COLLATERAL_VALUE:
                if (!/^\d+(\.\d+)?$/.test(inputValue.trim())) {
                    addBotMessage('Please enter a valid amount (numbers only).');
                    return;
                }
                const colVal = parseFloat(inputValue);
                if (isNaN(colVal) || colVal <= 0) {
                    addBotMessage('Please enter a valid amount.');
                    return;
                }
                context.collateralValue = colVal;
                state = STATES.LTV_RESULT;
                break;
            case STATES.EXISTING_MORTGAGE_ASK:
                if (!/^\d+(\.\d+)?$/.test(inputValue.trim())) {
                    addBotMessage('Please enter a valid amount (numbers only).');
                    return;
                }
                const existingMort = parseFloat(inputValue);
                if (isNaN(existingMort) || existingMort < 0) {
                    addBotMessage('Please enter a valid amount.');
                    return;
                }
                context.existingMortgage = existingMort;
                state = STATES.LTV_RESULT;
                break;

            case STATES.LTV_RESULT:
                // Handle the collateral response from LTV > 80% case
                if (context.ltv > 80) {
                    if (inputValue.toLowerCase() === 'yes') {
                        context.additionalCollateral = 'yes';
                    } else if (inputValue.toLowerCase() === 'no') {
                        context.additionalCollateral = 'no';
                    } else {
                        addBotMessage('Please select Yes or No.');
                        return;
                    }
                    state = STATES.HIGH_LTV_COLLATERAL;
                } else {
                    // This state should only be reached after LTV calculation, not for user input
    
                }
                break;
            case STATES.CHECK_ANOTHER:
                if (inputValue.toLowerCase() === 'check_another') {
                    state = STATES.WELCOME;
                    setTimeout(() => runState(), 200);
                    return;
                } else if (inputValue.toLowerCase() === 'goodbye') {
                    state = STATES.GOODBYE;
                    setTimeout(() => runState(), 200);
                    return;
                } else {
                    addBotMessage('Please select an option.');
                    return;
                }
                break;
            case STATES.END:
                if (inputValue.toLowerCase() === 'check_another') {
                    state = STATES.WELCOME;
                    setTimeout(() => runState(), 200);
                    return;
                } else if (inputValue.toLowerCase() === 'goodbye') {
                    state = STATES.GOODBYE;
                    setTimeout(() => runState(), 200);
                    return;
                }
                addBotMessage('Please click the button above to give your contact information!');
                break;
            default:
                // Do nothing - wait for user input
                break;
        }
        // Only call runState if we didn't return early
        if (state !== STATES.END) {
            setTimeout(() => runState(), 200);
        }
    }



        // --- Event Listeners ---
    toggleBtn.addEventListener('click', () => {
        if (chatWindow.hidden) {
            chatWindow.hidden = false;
            toggleBtn.setAttribute('aria-pressed', 'true');
            hideProactivePrompt(); // Hide prompt when chat opens
            resetChat();
            input.focus();
        } else {
            chatWindow.hidden = true;
            toggleBtn.setAttribute('aria-pressed', 'false');
        }
    });
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = input.value.trim();

        if (val) handleUserInput(val);
    });
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            form.dispatchEvent(new Event('submit'));
        }
    });

    // --- Initialize ---
    
    window.resetMortgageChatbot = resetChat;
    
    // Initialize proactive prompt
    initProactivePrompt();
    

    
    
})(); 