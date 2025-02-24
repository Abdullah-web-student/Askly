async function sendMessage() {

    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    if (message === '') return;

    document.getElementById('span').innerHTML = '';


    displayMessage(message, 'user-message');
    userInput.value = '';

    promptCount++;
    document.getElementById('promptCounter').textContent = promptCount;

    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message bot-message';
    typingIndicator.textContent = 'Thinking...';
    document.getElementById('chatContainer').appendChild(typingIndicator);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer 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', //
                'Content-Type': 'application/json',
                'HTTP-Referer': '<SITE_URL>',
                'X-Title': 'Askly'
            },
            body: JSON.stringify({
                model: 'deepseek/deepseek-r1-distill-llama-70b:free',
                messages: [
                    {
                        role: 'system',
                        content: "You are Askly, a smart AI assistant specializing in tutoring. Keep answers concise (1-2 sentences), clear, and relevant to the topic. Avoid unnecessary details or off-topic responses."
                    },
                    { 
                        role: 'user', 
                        content: message 
                    }
                ]
            })
        });

        const data = await response.json();
        typingIndicator.remove();

        if (data.choices && data.choices.length > 0) {
            displayMessage(data.choices[0].message.content, 'bot-message');
        } else {
            displayMessage('Oops! No response from the bot.', 'bot-message');
        }

    } catch (error) {
        typingIndicator.remove();
        displayMessage('Oops! Something went wrong.', 'bot-message');
        console.error('Error:', error);
    }
}

function simulateTypingEffect(text, container) {
    let index = 0;
    const interval = setInterval(() => {
        container.textContent += text.charAt(index);
        index++;
        if (index === text.length) clearInterval(interval);
    }, 50); 
}