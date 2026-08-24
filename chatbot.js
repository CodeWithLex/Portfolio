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
    school: "Cor Jesu College (CJC), Digos City, Philippines",
    philosophy: "CODE × CREATE — One person, two disciplines.",
    projects: [
      "• **ChemLab System** (https://chemlab-system.me): Chemistry lab scheduling and apparatus management portal.",
      "• **COE LGU System** (https://www.coelgu-system.engineer): College of Engineering budget transparency and student council financial portal.",
      "• **PMAEE CadetCoach** (https://reviewer-coach.onrender.com): AI prep portal for Philippine Military Academy entrance exams.",
      "• **Content-Creation-Manager** & **eBarangay-Portal** on GitHub (https://github.com/CodeWithLex)."
    ],
    skills: "Java, JavaScript, Kotlin, SQL, HTML/CSS, Python, Node.js, Express, Supabase, PostgreSQL, MySQL, Java Swing, JavaFX, Android Jetpack Compose, Git, Figma, Photoshop, After Effects.",
    photography: "Event & portrait photographer under **Leavian Visuals** (portraits, weddings, christenings, and College of Engineering events). Follow on TikTok (@edrickvisuals.mov) or Facebook (Lowbudphotography27).",
    contact: "• **GitHub:** https://github.com/CodeWithLex\n• **TikTok:** https://www.tiktok.com/@edrickvisuals.mov\n• **Facebook:** https://www.facebook.com/Lowbudphotography27/\n• **YouTube:** https://www.youtube.com/@lexmatondo27"
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

    const widget = document.createElement('div');
    widget.id = 'lexChatWidget';
    widget.className = 'lex-chat-widget';

    widget.innerHTML = `
      <div class="lex-chat-panel" id="lexChatPanel" role="dialog" aria-label="AI Portfolio Assistant">
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
            <button class="lex-icon-btn" id="lexCloseChat" title="Close" aria-label="Close chat">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
              placeholder="Ask about Lex's projects, stack, or photos..." 
              maxlength="400"
              autocomplete="off"
            />
            <button type="submit" class="lex-send-btn" id="lexSendBtn" aria-label="Send message">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      </div>

      <button class="lex-chat-trigger" id="lexChatTrigger" aria-label="Open AI chat assistant">
        <span class="lex-trigger-icon">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </span>
        <span>Chat with AI</span>
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
    const form = document.getElementById('lexChatForm');
    const input = document.getElementById('lexChatInput');

    trigger.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', () => toggleChat(false));
    clearBtn.addEventListener('click', clearChat);

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
    isOpen = typeof forceState === 'boolean' ? forceState : !isOpen;

    if (isOpen) {
      widget.classList.add('is-open');
      const input = document.getElementById('lexChatInput');
      setTimeout(() => input && input.focus(), 150);
    } else {
      widget.classList.remove('is-open');
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
    const q = query.toLowerCase();
    if (q.includes('project') || q.includes('build') || q.includes('work') || q.includes('made') || q.includes('chemlab') || q.includes('lgu')) {
      return `Here are Lex's primary projects:\n\n${LOCAL_KNOWLEDGE.projects.join('\n')}`;
    }
    if (q.includes('stack') || q.includes('language') || q.includes('tech') || q.includes('tool') || q.includes('skill')) {
      return `Lex's technical stack:\n\n${LOCAL_KNOWLEDGE.skills}`;
    }
    if (q.includes('photo') || q.includes('camera') || q.includes('picture') || q.includes('visual') || q.includes('shoot') || q.includes('wedding')) {
      return LOCAL_KNOWLEDGE.photography;
    }
    if (q.includes('contact') || q.includes('email') || q.includes('social') || q.includes('github') || q.includes('reach')) {
      return `You can connect with Lex on:\n\n${LOCAL_KNOWLEDGE.contact}`;
    }
    if (q.includes('who') || q.includes('about') || q.includes('lex') || q.includes('school') || q.includes('college') || q.includes('cjc')) {
      return `**${LOCAL_KNOWLEDGE.name}**\n\n• ${LOCAL_KNOWLEDGE.role}\n• Studying at ${LOCAL_KNOWLEDGE.school}\n• Philosophy: "${LOCAL_KNOWLEDGE.philosophy}"`;
    }
    if (q.includes('recipe') || q.includes('weather') || q.includes('math') || q.includes('president') || q.includes('bitcoin')) {
      return "I am Lex's portfolio assistant, so I can only answer questions about Lex Matondo, his projects, skills, education, and photography.";
    }
    return `Lex is a Computer Engineering student, developer, and photographer from Digos City, Philippines. Ask me about his projects (${LOCAL_KNOWLEDGE.projects[0].split('(')[0].replace('• **', '')}), his tech stack, or his photography!`;
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

      if (response.status === 403) {
        appendMessage('assistant', "⚠️ **Access restricted:** This API is locked to verified portfolio domains.");
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
      console.warn('API route unavailable or offline, using local knowledge engine:', err.message);
      // Fallback local engine for local file preview
      setTimeout(() => {
        removeTypingIndicator();
        const fallbackReply = getLocalFallback(text);
        appendMessage('assistant', fallbackReply);
        chatHistory.push({ role: 'assistant', content: fallbackReply });
      }, 350);
    } finally {
      // Cooldown before unlocking input to prevent spam clicking
      setTimeout(() => {
        isSubmitting = false;
        if (input) {
          input.disabled = false;
          input.focus();
        }
        if (sendBtn) sendBtn.disabled = false;
      }, 1200);
    }
  }

  // Auto-init when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
  } else {
    initChatbot();
  }
})();
