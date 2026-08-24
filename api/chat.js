// Vercel Serverless Function: AI Chatbot Endpoint for Lex Matondo's Portfolio
// Supports Google Gemini (Free tier) and Groq (Free tier)

const LEX_KNOWLEDGE = `
You are the personal AI Portfolio Assistant for Lex Matondo (Lex Edrick Asherjesse C. Matondo).
Your purpose is to answer questions strictly about Lex Matondo, his projects, technical skills, photography, education, and background.

### SOURCE OF TRUTH / FACTS ABOUT LEX:
- Name: Lex Matondo (Full: Lex Edrick Asherjesse C. Matondo)
- Title: Student Developer & Photographer
- Education: Computer Engineering (BSCPE) student at Cor Jesu College (CJC), Digos City, Philippines
- Core Framing: "CODE × CREATE" — One person, two disciplines. Developer first; photography is the real second discipline. "I build things. I also photograph them."
- Location: Digos City, Davao del Sur, Philippines
- Tech Stack:
  * Languages: Java, JavaScript, HTML, CSS, Kotlin, SQL, Python
  * Frameworks & Libs: Java Swing, JavaFX, Scene Builder, Node.js, Express.js, Supabase, PostgreSQL, MySQL, Android / Jetpack Compose
  * Tools: Git, GitHub, Figma, NetBeans, Android Studio, VS Code, Photoshop, After Effects, TouchDesigner
- Key Projects:
  1. ChemLab System (https://chemlab-system.me, repo: CodeWithLex.github.io) — Chemistry laboratory portal with group login, apparatus borrowing queues, session scheduling (Mon–Sat, 30-min slots), QR activity receipts, and logs.
  2. COE LGU System (https://www.coelgu-system.engineer, repo: LGU-SYSTEM) — College of Engineering budget transparency and student council financial portal in PHP/₱ with over-budget alerts, 1.0–5.0 GPA calculator, PDF export, audit log. Restricted to @g.cjc.edu.ph accounts.
  3. PMAEE CadetCoach (https://reviewer-coach.onrender.com) — AI prep portal for Philippine Military Academy Entrance Examination, hosted on Render.
  4. eBarangay-Portal (https://github.com/CodeWithLex/eBarangay-Portal) — Barangay document requests and digital governance web app.
  5. Content-Creation-Manager (https://github.com/CodeWithLex/Content-Creation-Manager) — Desktop Java tool organizing content creation pipelines.
  6. PORJECT-F.R.I.D.A.Y (https://github.com/CodeWithLex/PORJECT-F.R.I.D.A.Y) — Humorous AI voice assistant experiment inspired by Marvel.
  7. Hardware/School projects: Healthcare Smart Assistant / Medicine Dispenser (Java Swing + Arduino).
- Photography:
  * Brand: Leavian Visuals (Facebook: https://www.facebook.com/Lowbudphotography27/)
  * TikTok: @edrickvisuals.mov (https://www.tiktok.com/@edrickvisuals.mov)
  * YouTube: @lexmatondo27 (https://www.youtube.com/@lexmatondo27)
  * Roles: Photographer for student publication and College of Engineering events (Portraits, Weddings, Christenings, Editorial).
- Socials / Contact:
  * GitHub: https://github.com/CodeWithLex
  * Portfolio: https://lex-portfolio-swart.vercel.app

### STRICT RULES & CONSTRAINTS:
1. ONLY answer questions about Lex Matondo, his projects, skills, education, photography, experience, and contact info based strictly on the facts above.
2. If the user asks general, unrelated, or off-topic questions (e.g. general coding help, recipes, math problems, political opinions, unrelated essays), politely and concisely decline: "I am Lex's portfolio assistant, so I can only answer questions about Lex Matondo, his projects, skills, and photography."
3. Speak in a friendly, conversational, concise, and professional tone. Avoid AI clichés ("delve", "tapestry", "in today's fast-paced world").
4. Keep answers crisp and readable with short bullet points when listing items.
`;

// In-memory rate limiting cache (per serverless instance)
const rateLimitMap = new Map();

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 8;      // Max 8 requests per minute per IP
const MAX_INPUT_LENGTH = 400;           // Limit input length to prevent token bloat

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown-ip';
}

function isRateLimited(ip) {
  const now = Date.now();
  const userRecord = rateLimitMap.get(ip) || [];

  // Filter requests within the active window
  const activeRequests = userRecord.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW_MS);

  if (activeRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  activeRequests.push(now);
  rateLimitMap.set(ip, activeRequests);

  // Clean old entries periodically to prevent memory leaks
  if (rateLimitMap.size > 2000) {
    for (const [key, timestamps] of rateLimitMap.entries()) {
      const valid = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
      if (valid.length === 0) {
        rateLimitMap.delete(key);
      } else {
        rateLimitMap.set(key, valid);
      }
    }
  }

  return false;
}

function isAllowedOrigin(req) {
  const origin = req.headers.origin || req.headers.referer || '';
  if (!origin) return true; // Allow direct server/curl if testing, or check if in production

  const allowedPatterns = [
    /^https?:\/\/localhost(:\d+)?$/,
    /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
    /^https:\/\/lex-portfolio[a-z0-9-]*\.vercel\.app$/,
    /^https:\/\/[a-z0-9-]+\.vercel\.app$/,
    /^https:\/\/codewithlex\.github\.io$/,
    /^https?:\/\/chemlab-system\.me$/
  ];

  return allowedPatterns.some(pattern => {
    try {
      const url = new URL(origin);
      return pattern.test(url.origin);
    } catch {
      return false;
    }
  });
}

export default async function handler(req, res) {
  const clientOrigin = req.headers.origin || '*';

  // Security Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', clientOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // 1. Origin verification
  if (!isAllowedOrigin(req)) {
    return res.status(403).json({ error: 'Access forbidden: unauthorized origin.' });
  }

  // 2. IP Rate limiting
  const clientIp = getClientIp(req);
  if (isRateLimited(clientIp)) {
    res.setHeader('Retry-After', '60');
    return res.status(429).json({
      error: 'Too many requests. Please wait a minute before asking more questions.'
    });
  }

  try {
    const { messages = [] } = req.body || {};
    let lastUserMessage = messages.length > 0 ? messages[messages.length - 1].content : '';

    if (!lastUserMessage || !lastUserMessage.trim()) {
      return res.status(400).json({ error: 'Message content is required.' });
    }

    // 3. Payload sanity check & truncation to prevent token drain
    lastUserMessage = lastUserMessage.trim().slice(0, MAX_INPUT_LENGTH);

    const nvidiaKey = process.env.NVIDIA_API_KEY || process.env.DEEPSEEK_API_KEY;
    const nvidiaModel = process.env.NVIDIA_MODEL || 'deepseek-ai/deepseek-v3';
    const geminiKey = process.env.GEMINI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    // 1. If NVIDIA API key is configured (NVIDIA NIM DeepSeek free tier)
    if (nvidiaKey) {
      const formattedMessages = [
        { role: 'system', content: LEX_KNOWLEDGE },
        ...messages.slice(-6)
      ];

      const nvidiaResponse = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${nvidiaKey}`
        },
        body: JSON.stringify({
          model: nvidiaModel,
          messages: formattedMessages,
          temperature: 0.3,
          max_tokens: 500
        })
      });

      if (nvidiaResponse.ok) {
        const nvidiaData = await nvidiaResponse.json();
        const rawReply = nvidiaData.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
        // Clean any reasoning tags (<think>...</think>) if using DeepSeek-R1
        const reply = rawReply.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
        return res.status(200).json({ reply });
      } else {
        const nvidiaErr = await nvidiaResponse.text();
        console.error('NVIDIA DeepSeek API error:', nvidiaErr);
      }
    }

    // 2. If Gemini API key is configured (Free Tier)
    if (geminiKey) {
      const contents = [
        {
          role: 'user',
          parts: [{ text: `${LEX_KNOWLEDGE}\n\nUser Question: ${lastUserMessage}` }]
        }
      ];

      // If there is conversation history, include up to last 4 exchanges
      if (messages.length > 1) {
        const history = messages.slice(-5, -1).map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }));
        contents.unshift(...history);
      }

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`;
      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 500
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
        return res.status(200).json({ reply });
      } else {
        const errorText = await response.text();
        console.error('Gemini API error:', errorText);
      }
    }

    // 2. If Groq API key is configured (Free Tier)
    if (groqKey) {
      const formattedMessages = [
        { role: 'system', content: LEX_KNOWLEDGE },
        ...messages.slice(-6)
      ];

      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${groqKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: formattedMessages,
          temperature: 0.3,
          max_tokens: 500
        })
      });

      if (groqResponse.ok) {
        const groqData = await groqResponse.json();
        const reply = groqData.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
        return res.status(200).json({ reply });
      } else {
        const groqError = await groqResponse.text();
        console.error('Groq API error:', groqError);
      }
    }

    // 3. Fallback response if neither key is set in environment yet
    const query = lastUserMessage.toLowerCase();
    let fallbackReply = "I am Lex Matondo's portfolio assistant! I can tell you about his projects (ChemLab System, COE LGU System, PMAEE CadetCoach), his tech stack (Java, SQL, JS, Kotlin), education at Cor Jesu College, or his photography work at Leavian Visuals.";

    if (query.includes('project') || query.includes('build') || query.includes('work')) {
      fallbackReply = "Lex has built and deployed several major systems:\n\n• **ChemLab System** (https://chemlab-system.me): Chemistry lab scheduling and apparatus management.\n• **COE LGU System** (https://www.coelgu-system.engineer): College of Engineering financial transparency portal with grade tracking.\n• **PMAEE CadetCoach** (https://reviewer-coach.onrender.com): AI prep portal for PMA entrance exams.\n• **Content-Creation-Manager** & **eBarangay-Portal** on GitHub (https://github.com/CodeWithLex).";
    } else if (query.includes('stack') || query.includes('language') || query.includes('tech') || query.includes('skill')) {
      fallbackReply = "Lex's core tech stack includes:\n\n• **Languages:** Java, JavaScript, Kotlin, SQL, HTML/CSS, Python\n• **Frameworks & Databases:** Node.js, Express, Supabase, PostgreSQL, MySQL, Java Swing, JavaFX, Android Jetpack Compose\n• **Tools:** Git/GitHub, Figma, Android Studio, VS Code, Photoshop, After Effects";
    } else if (query.includes('photo') || query.includes('camera') || query.includes('picture') || query.includes('visual')) {
      fallbackReply = "Lex is also an event and portrait photographer under **Leavian Visuals**! He covers weddings, portraits, and christenings, and shoots for his college engineering events and student publication. Check out his work on TikTok (@edrickvisuals.mov) or Facebook (Lowbudphotography27).";
    } else if (query.includes('who') || query.includes('about') || query.includes('lex') || query.includes('school') || query.includes('college')) {
      fallbackReply = "Lex (Lex Edrick Asherjesse C. Matondo) is a Computer Engineering (BSCPE) student at Cor Jesu College in Digos City, Philippines. His philosophy is **CODE × CREATE** — building robust software while pursuing visual storytelling through photography.";
    } else if (query.includes('contact') || query.includes('email') || query.includes('social') || query.includes('github')) {
      fallbackReply = "You can connect with Lex on:\n\n• **GitHub:** https://github.com/CodeWithLex\n• **TikTok:** https://www.tiktok.com/@edrickvisuals.mov\n• **Photography FB:** https://www.facebook.com/Lowbudphotography27/\n• **YouTube:** https://www.youtube.com/@lexmatondo27";
    } else if (!query.includes('lex') && (query.includes('recipe') || query.includes('weather') || query.includes('poem') || query.includes('joke') || query.includes('math') || query.includes('python code'))) {
      fallbackReply = "I am Lex's portfolio assistant, so I can only answer questions regarding Lex Matondo, his projects, skills, education, and photography.";
    }

    return res.status(200).json({
      reply: fallbackReply,
      note: !geminiKey && !groqKey ? 'API key not detected on Vercel yet; serving local knowledge base.' : undefined
    });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    return res.status(500).json({ error: 'Failed to process request.' });
  }
}
