/**
 * Lex Matondo Portfolio — AI Chatbot Assistant Widget
 * Natural, fast, and strict knowledge base about Lex.
 */

(function () {
  'use strict';

  // Fallback profile knowledge in case running completely offline / local file
  const LOCAL_KNOWLEDGE = {
    name: "Lex Matondo (Lex Edrick Asherjesse C. Matondo)",
    role: "Computer Engineering (BSCPE) student, Developer & Photographer",
    school: "Cor Jesu College (CJC), Digos City, Davao del Sur, Philippines",
    philosophy: "CODE × CREATE — One person, two disciplines.",
    email: "Matondolex@gmail.com",
    projects: [
      "• **ChemLab System** (https://chemlab-system.me): Chemistry lab scheduling and apparatus management portal.",
      "• **COE LGU System** (https://www.coelgu-system.engineer): College of Engineering budget transparency and student council financial portal.",
      "• **PMAEE CadetCoach** (https://reviewer-coach.onrender.com): AI prep portal for Philippine Military Academy entrance exams.",
      "• **Content-Creation-Manager** & **eBarangay-Portal** on GitHub (https://github.com/CodeWithLex).",
      "• **Healthcare Smart Dispenser**: Arduino-driven automated medicine dispenser with Java Swing GUI."
    ],
    skills: "Java, JavaScript, TypeScript, Kotlin, SQL, HTML5, CSS3, Python, Node.js, Express, Supabase, PostgreSQL, MySQL, Java Swing, JavaFX, Android Jetpack Compose, Git, Figma, Photoshop, Lightroom, After Effects.",
    photography: "Event & portrait photographer under **Leavian Visuals** (portraits, weddings, debuts, christenings, and Cor Jesu College of Engineering & student publication events). Follow on TikTok (@edrickvisuals.mov) or Facebook (Lowbudphotography27).",
    contact: "• **Email:** Matondolex@gmail.com\n• **GitHub:** https://github.com/CodeWithLex\n• **TikTok:** https://www.tiktok.com/@edrickvisuals.mov\n• **Facebook:** https://www.facebook.com/Lowbudphotography27/\n• **YouTube:** https://www.youtube.com/@lexmatondo27"
  };

  const SUGGESTIONS = [
    "Tell me about Lex",
    "What projects has Lex built?",
    "What is his tech stack?",
    "Tell me about his photography",
    "How can I contact Lex?"
  ];

  let chatHistory = [];
  let isOpen = false;
  let isSubmitting = false;

  function initChatbot() {
    // Prevent duplicate injection
    if (document.getElementById('lexChatWidget')) return;

    // Backdrop for mobile & focused reading
    const backdrop = document.createElement('div');
    backdrop.id = 'lexChatBackdrop';
    backdrop.className = 'lex-chat-backdrop';
    document.body.appendChild(backdrop);

    const widget = document.createElement('div');
    widget.id = 'lexChatWidget';
    widget.className = 'lex-chat-widget';

    widget.innerHTML = `
      <div class="lex-chat-panel" id="lexChatPanel" role="dialog" aria-label="AI Portfolio Assistant">
        <div class="lex-sheet-handle" aria-hidden="true"></div>
        <div class="lex-chat-header">
          <div class="lex-chat-title-group">
            <div class="lex-chat-avatar">LM</div>
            <div class="lex-chat-header-info">
              <div class="lex-chat-name">
                Lex's AI Guide
                <span class="lex-status-dot" title="Online"></span>
              </div>
              <div class="lex-chat-sub">Ask me about Lex's work</div>
            </div>
          </div>
          <div class="lex-chat-actions">
            <button class="lex-icon-btn" id="lexClearChat" title="Clear chat" aria-label="Clear chat">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
            <button class="lex-icon-btn" id="lexCloseChat" title="Close" aria-label="Close chat">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <div class="lex-chat-body" id="lexChatBody">
          <!-- Messages will render here -->
        </div>

        <div class="lex-chat-suggestions" id="lexSuggestions"></div>

        <div class="lex-chat-footer">
          <form class="lex-chat-form" id="lexChatForm">
            <input 
              type="text" 
              class="lex-chat-input" 
              id="lexChatInput" 
              placeholder="Ask about projects, stack, or photos..." 
              maxlength="400"
              autocomplete="off"
            />
            <button type="submit" class="lex-send-btn" id="lexSendBtn" aria-label="Send message">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      </div>

      <button class="lex-chat-trigger" id="lexChatTrigger" aria-label="Open AI chat assistant">
        <span class="lex-trigger-icon">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </span>
        <span class="lex-trigger-label">Chat with AI</span>
        <span class="lex-trigger-badge"></span>
      </button>
    `;

    document.body.appendChild(widget);
    bindEvents();
    renderWelcomeMessage();
    renderSuggestions();
  }

  function bindEvents() {
    const widget = document.getElementById('lexChatWidget');
    const panel = document.getElementById('lexChatPanel');
    const trigger = document.getElementById('lexChatTrigger');
    const closeBtn = document.getElementById('lexCloseChat');
    const clearBtn = document.getElementById('lexClearChat');
    const backdrop = document.getElementById('lexChatBackdrop');
    const form = document.getElementById('lexChatForm');
    const input = document.getElementById('lexChatInput');

    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleChat();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleChat(false);
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        clearChat();
      });
    }

    if (panel) {
      panel.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleChat(false);
      });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        toggleChat(false);
      }
    });

    // Close if clicked outside on desktop
    document.addEventListener('click', (e) => {
      if (!isOpen) return;
      const w = document.getElementById('lexChatWidget');
      if (w && !w.contains(e.target)) {
        toggleChat(false);
      }
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const text = input ? input.value.trim() : '';
        if (!text || isSubmitting) return;
        sendMessage(text);
        if (input) input.value = '';
      });
    }
  }

  function toggleChat(forceState) {
    const widget = document.getElementById('lexChatWidget');
    const backdrop = document.getElementById('lexChatBackdrop');
    isOpen = typeof forceState === 'boolean' ? forceState : !isOpen;

    if (isOpen) {
      if (widget) widget.classList.add('is-open');
      if (backdrop && window.innerWidth <= 640) backdrop.classList.add('is-active');
      const input = document.getElementById('lexChatInput');
      const body = document.getElementById('lexChatBody');
      if (body) body.scrollTop = body.scrollHeight;
      setTimeout(() => input && input.focus(), 150);
    } else {
      if (widget) widget.classList.remove('is-open');
      if (backdrop) backdrop.classList.remove('is-active');
    }
  }

  async function sendMessage(text) {
    if (isSubmitting) return;
    isSubmitting = true;

    const input = document.getElementById('lexChatInput');
    const sendBtn = document.getElementById('lexSendBtn');
    if (input) input.disabled = true;
    if (sendBtn) sendBtn.disabled = true;

    appendMessage('user', text);
    chatHistory.push({ role: 'user', content: text });

    // Hide suggestion chips once conversation starts
    const suggestions = document.getElementById('lexSuggestions');
    if (suggestions) suggestions.style.display = 'none';

    showTypingIndicator();

    try {
      const response = await fetch(CHAT_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory })
      });

      removeTypingIndicator();

      if (response.status === 429) {
        const errData = await response.json().catch(() => ({}));
        const warning = errData.error || "Rate limit reached. Please wait a minute before asking more questions.";
        appendMessage('assistant', `⚠️ **${warning}**`);
        return;
      }

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const botReply = data.reply || "Sorry, I couldn't generate a reply right now.";
      appendMessage('assistant', botReply);
      chatHistory.push({ role: 'assistant', content: botReply });
    } catch (err) {
      console.warn('API call unavailable, using knowledge engine fallback:', err.message);
      // Fallback local engine
      setTimeout(() => {
        removeTypingIndicator();
        const fallbackReply = getLocalFallback(text);
        appendMessage('assistant', fallbackReply);
        chatHistory.push({ role: 'assistant', content: fallbackReply });
      }, 250);
    } finally {
      // Cooldown before unlocking input to prevent spam clicking
      setTimeout(() => {
        isSubmitting = false;
        if (input) {
          input.disabled = false;
          input.focus();
        }
        if (sendBtn) sendBtn.disabled = false;
      }, 800);
    }
  }

  // Auto-init when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
  } else {
    initChatbot();
  }
})();
