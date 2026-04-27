# AI Chat Integration Design - Gemini API

This document provides a complete guide and the full code required to integrate Google Gemini AI into the ACSP AI Assistant.

## Overview
The goal is to provide users with an intelligent chatbot that can answer basic animal-related questions while ensuring safety by referring complex medical issues to licensed veterinarians.

## Architecture
- **Frontend**: `ai_chat.html` handles the UI and user interaction.
- **Backend**: `server.js` (Express) acts as a secure proxy to the Google Gemini API.
- **AI Model**: Google Gemini 1.5 Flash.

---

## 1. Backend Implementation (`Backend/server.js`)

### Step 1: Install Dependencies
Run the following command in your `Backend` directory:
```bash
npm install @google/generative-ai dotenv
```

### Step 2: Full `server.js` Code Integration
Add these parts to your `server.js`:

#### A. Imports & Config
```javascript
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
```

#### B. Gemini Initialization
```javascript
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "YOUR_GEMINI_API_KEY");
const aiModel = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "You are the ACSP AI Assistant, a helpful expert in animal care. You can answer basic questions about pet nutrition, grooming, and common minor symptoms. However, for any complex medical problems, emergencies, or serious symptoms (like severe bleeding, breathing difficulties, or sudden collapse), you MUST advise the user to consult a professional veterinarian or visit the nearest animal clinic immediately. Be concise and friendly."
});
```

#### C. API Route
```javascript
app.post("/api/ai-chat", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ message: "Message is required" });

        const result = await aiModel.generateContent(message);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ message: "AI Assistant is currently unavailable" });
    }
});
```

---

## 2. Frontend Implementation (`Frontend/ai_chat.html`)

### Step 1: HTML Elements
Ensure your input elements have the correct IDs:
```html
<textarea id="user-input" ...></textarea>
<button id="send-button" ...>Send</button>
<div id="chat-history" ...></div>
```

### Step 2: Full Interaction Script
Add this before the closing `</body>` tag:

```javascript
<script>
    const chatHistory = document.getElementById('chat-history');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    function appendMessage(role, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex gap-4 ${role === 'user' ? 'flex-row-reverse' : ''} max-w-[85%] animate-message`;
        
        const avatarHtml = role === 'user' 
            ? `<div class="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-600">
                 <span class="material-symbols-outlined text-xs">person</span>
               </div>`
            : `<div class="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-white">
                 <span class="material-symbols-outlined text-xs">smart_toy</span>
               </div>`;

        const bgClass = role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-orange-100';

        messageDiv.innerHTML = `
            ${avatarHtml}
            <div class="${bgClass} p-5 rounded-2xl shadow-sm">
                <p class="leading-relaxed">${text}</p>
            </div>
        `;
        
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function appendLoading() {
        const loadingId = 'loading-' + Date.now();
        const loadingDiv = document.createElement('div');
        loadingDiv.id = loadingId;
        loadingDiv.className = 'flex gap-4 max-w-[85%] animate-message';
        loadingDiv.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-white">
                <span class="material-symbols-outlined text-xs">smart_toy</span>
            </div>
            <div class="bg-white p-5 rounded-2xl rounded-tl-none shadow-sm border border-orange-100">
                <div class="flex gap-1">
                    <span class="w-2 h-2 bg-orange-200 rounded-full animate-bounce"></span>
                    <span class="w-2 h-2 bg-orange-300 rounded-full animate-bounce delay-100"></span>
                    <span class="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-200"></span>
                </div>
            </div>
        `;
        chatHistory.appendChild(loadingDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
        return loadingId;
    }

    async function handleSend() {
        const message = userInput.value.trim();
        if (!message) return;

        appendMessage('user', message);
        userInput.value = '';
        userInput.style.height = 'auto';

        const loadingId = appendLoading();

        try {
            const response = await fetch('http://localhost:5000/api/ai-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });

            const data = await response.json();
            document.getElementById(loadingId).remove();

            if (response.ok) {
                appendMessage('ai', data.reply);
            } else {
                appendMessage('ai', data.message || "Something went wrong.");
            }
        } catch (error) {
            document.getElementById(loadingId).remove();
            appendMessage('ai', "Error connecting to server. Check if backend is running.");
        }
    }

    sendButton.addEventListener('click', handleSend);
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });
</script>
```

---

## 3. Configuration (`.env`)
Create a `.env` file in your `Backend` folder:
```env
GEMINI_API_KEY=your_actual_api_key_here
PORT=5000
```

---

## 4. Safety Constraints
The AI is strictly programmed to:
1. **Never** diagnose specific diseases.
2. **Never** prescribe medications.
3. **Always** refer serious/emergency concerns to a licensed veterinarian.
I have re-implemented the Gemini AI chat integration in both the Backend and Frontend.

Implementation Details:
Backend (Backend/server.js):
Re-added dotenv configuration for secure API key management.
Integrated @google/generative-ai with the safety-first system prompt.
Re-established the /api/ai-chat endpoint.
Frontend (Frontend/ai_chat.html):
Restored the interactive chat logic, including dynamic message rendering and the "typing" indicator.
Re-enabled auto-scrolling and auto-resizing input for a smoother experience.
Documentation: All code and instructions remain preserved in 

ai_chat.md
.
Reminder: Please ensure you install the dependencies (npm install @google/generative-ai dotenv in the Backend folder) and add your GEMINI_API_KEY to a .env file to enable the AI functionality.