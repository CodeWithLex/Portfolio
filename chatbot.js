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
    const trigger = document.getElementById('lexChatTrigger');
    const closeBtn = document.getElementById('lexCloseChat');
    const clearBtn = document.getElementById('lexClearChat');
    const backdrop = document.getElementById('lexChatBackdrop');
    const form = document.getElementById('lexChatForm');
    const input = document.getElementById('lexChatInput');

    trigger.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', () => toggleChat(false));
    clearBtn.addEventListener('click', clearChat);
    if (backdrop) backdrop.addEventListener('click', () => toggleChat(false));

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        toggleChat(false);
      }
    });

    // Close if clicked outside on desktop
    document.addEventListener('click', (e) => {
      if (!isOpen) return;
      const widget = document.getElementById('lexChatWidget');
      if (widget && !widget.contains(e.target) && (!backdrop || !backdrop.contains(e.target))) {
        toggleChat(false);
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text || isSubmitting) return;
      sendMessage(text);
      input.value = '';
    });
  }

  function toggleChat(forceState) {
    const widget = document.getElementById('lexChatWidget');
    const backdrop = document.getElementById('lexChatBackdrop');
    isOpen = typeof forceState === 'boolean' ? forceState : !isOpen;

    if (isOpen) {
      widget.classList.add('is-open');
      if (backdrop && window.innerWidth <= 640) backdrop.classList.add('is-active');
      const input = document.getElementById('lexChatInput');
      const body = document.getElementById('lexChatBody');
      if (body) body.scrollTop = body.scrollHeight;
      setTimeout(() => input && input.focus(), 150);
    } else {
      widget.classList.remove('is-open');
      if (backdrop) backdrop.classList.remove('is-active');
    }
  }

  function clearChat() {
    chatHistory = [];
    const chatBody = document.getElementById('lexChatBody');
    chatBody.innerHTML = '';
    renderWelcomeMessage();
    renderSuggestions();
  }

  function renderWelcomeMessage() {
    appendMessage(
      'assistant',
      "Hey! I'm Lex's AI portfolio guide. Ask me anything about his software projects, tech stack, photography work at Leavian Visuals, or background!"
    );
  }

  function renderSuggestions() {
    const container = document.getElementById('lexSuggestions');
    container.innerHTML = '';
    SUGGESTIONS.forEach((prompt) => {
      const chip = document.createElement('button');
      chip.className = 'lex-chip';
      chip.type = 'button';
      chip.textContent = prompt;
      chip.addEventListener('click', () => {
        sendMessage(prompt);
      });
      container.appendChild(chip);
    });
  }

  function formatMarkdown(text) {
    if (!text) return '';
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Bold **text**
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Links [text](url)
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      // Direct URLs
      .replace(/(^|[^"'])(https?:\/\/[^\s<]+)/g, '$1<a href="$2" target="_blank" rel="noopener noreferrer">$2</a>')
      // Code `text`
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Bullet points
      .replace(/^[•*-]\s+(.+)$/gm, '<li>$1</li>');

    // Wrap li groups in ul
    html = html.replace(/(<li>.*?<\/li>)+/gs, (match) => `<ul>${match}</ul>`);

    // Paragraph breaks
    return html.split('\n\n').map(p => {
      p = p.trim();
      if (!p) return '';
      if (p.startsWith('<ul>')) return p;
      return `<p>${p.replace(/\n/g, '<br/>')}</p>`;
    }).join('');
  }

  function appendMessage(role, content) {
    const chatBody = document.getElementById('lexChatBody');
    const msgEl = document.createElement('div');
    msgEl.className = `lex-msg ${role}`;

    const formattedContent = role === 'assistant' ? formatMarkdown(content) : document.createTextNode(content).textContent;
    msgEl.innerHTML = role === 'assistant' ? formattedContent : `<p>${formattedContent}</p>`;

    chatBody.appendChild(msgEl);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function showTypingIndicator() {
    const chatBody = document.getElementById('lexChatBody');
    const indicator = document.createElement('div');
    indicator.className = 'lex-typing-indicator';
    indicator.id = 'lexTypingIndicator';
    indicator.innerHTML = `
      <span class="lex-typing-dot"></span>
      <span class="lex-typing-dot"></span>
      <span class="lex-typing-dot"></span>
    `;
    chatBody.appendChild(indicator);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('lexTypingIndicator');
    if (indicator) indicator.remove();
  }

  function getLocalFallback(query) {
    const q = query.toLowerCase().trim();

    // Natural Greetings
    if (/^(hi|hello|hey|kamusta|musta|hi po|hello po|good day|good morning|good evening|yo)\b/.test(q) || q === 'hi' || q === 'hello' || q === 'hi po') {
      return "Hello! I'm Lex Matondo's AI guide. I can answer any questions about his software projects, tech stack, education at Cor Jesu College, or photography work at Leavian Visuals.";
    }

    if (q === 'what' || q.includes('what can you do') || q.includes('help') || q.includes('options')) {
      return "You can ask me about:\n\n• **Projects:** ChemLab System, COE LGU System, PMAEE CadetCoach, eBarangay-Portal\n• **Tech Stack:** Java, SQL, JavaScript, Kotlin, Android, Node.js\n• **Photography:** Leavian Visuals, portrait/event work, and publication photojournalism\n• **Contact & Links:** GitHub, socials, and email";
    }

    // Projects
    if (q.includes('project') || q.includes('build') || q.includes('work') || q.includes('made') || q.includes('chemlab') || q.includes('lgu') || q.includes('cadet') || q.includes('dispenser') || q.includes('app')) {
      return `Here are Lex's primary projects:\n\n${LOCAL_KNOWLEDGE.projects.join('\n')}`;
    }

    // Stack & Skills
    if (q.includes('stack') || q.includes('language') || q.includes('tech') || q.includes('tool') || q.includes('skill') || q.includes('java') || q.includes('python') || q.includes('sql')) {
      return `Lex's technical stack:\n\n${LOCAL_KNOWLEDGE.skills}`;
    }

    // Photography
    if (q.includes('photo') || q.includes('camera') || q.includes('picture') || q.includes('visual') || q.includes('shoot') || q.includes('wedding') || q.includes('leavian')) {
      return LOCAL_KNOWLEDGE.photography;
    }

    // Contact
    if (q.includes('contact') || q.includes('email') || q.includes('social') || q.includes('github') || q.includes('reach') || q.includes('message')) {
      return `You can connect with Lex on:\n\n${LOCAL_KNOWLEDGE.contact}`;
    }

    // Background & Identity
    if (q.includes('who') || q.includes('about') || q.includes('lex') || q.includes('school') || q.includes('college') || q.includes('cjc') || q.includes('student')) {
      return `**${LOCAL_KNOWLEDGE.name}**\n\n• ${LOCAL_KNOWLEDGE.role}\n• Studying at ${LOCAL_KNOWLEDGE.school}\n• Philosophy: "${LOCAL_KNOWLEDGE.philosophy}"`;
    }

    // Strict boundary refusal for unrelated subjects
    return "I am Lex Matondo's dedicated portfolio assistant. I can only answer questions specifically about Lex, his software projects, technical skills, and photography work.";
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

    // If running via local file protocol (file://), answer immediately with local knowledge engine
    if (window.location.protocol === 'file:') {
      setTimeout(() => {
        removeTypingIndicator();
        const localReply = getLocalFallback(text);
        appendMessage('assistant', localReply);
        chatHistory.push({ role: 'assistant', localReply });
        isSubmitting = false;
        if (input) {
          input.disabled = false;
          input.focus();
        }
        if (sendBtn) sendBtn.disabled = false;
      }, 300);
      return;
    }

    try {
      const response = await fetch('/api/chat', {
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
      console.warn('API route unavailable, using local knowledge engine:', err.message);
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
      }, 1000);
    }
  }

  // Auto-init when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
  } else {
    initChatbot();
  }
})();
