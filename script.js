/* Portfolio Lex — Interactive Terminal CLI & Motion Engine
   Lex Matondo · Computer Engineering · Full-Stack & Photography */

(function () {
  "use strict";

  /* ---- Terminal CLI Engine ---- */
  var terminalForm = document.getElementById("terminal-form");
  var terminalInput = document.getElementById("terminal-input");
  var terminalHistory = document.getElementById("terminal-history");
  var terminalBody = document.getElementById("terminal-screen");
  var shortcutBtns = document.querySelectorAll(".ts-btn");

  var commandHistory = [];
  var historyIndex = -1;

  var commands = {
    help: function () {
      return [
        '<div class="t-out-title">AVAILABLE COMMANDS:</div>',
        '<div class="t-out-row"><span class="t-tag">&gt; explore</span> Launch the full portfolio GUI (portfolio.html)</div>',
        '<div class="t-out-row"><span class="t-tag">projects</span> Inspect live production portals &amp; hardware systems</div>',
        '<div class="t-out-row"><span class="t-tag">skills</span> View Computer Engineering &amp; software toolchain</div>',
        '<div class="t-out-row"><span class="t-tag">photo</span> View LowBud Photography highlights &amp; gear specs</div>',
        '<div class="t-out-row"><span class="t-tag">about</span> Read developer credentials &amp; background</div>',
        '<div class="t-out-row"><span class="t-tag">contact</span> View direct contact endpoints &amp; social profiles</div>',
        '<div class="t-out-row"><span class="t-tag">clear</span> Clear terminal screen buffer</div>'
      ].join("");
    },

    explore: function () {
      setTimeout(function () {
        window.location.href = "portfolio.html";
      }, 700);
      return '<span class="t-highlight">✓ Launching full portfolio GUI... Loading portfolio.html...</span>';
    },

    open: function () {
      return commands.explore();
    },

    projects: function () {
      return [
        '<div class="t-out-title">PRODUCTION SYSTEMS &amp; HARDWARE:</div>',
        '<div class="t-out-row">1. <strong class="t-highlight">ChemLab System</strong> <span class="t-tag">LIVE</span> — chemlab-system.me (QR-deposit chemistry laboratory portal)</div>',
        '<div class="t-out-row">2. <strong class="t-highlight">COE LGU Portal</strong> <span class="t-tag">CAMPUS DEPLOYED</span> — coelgu-system.engineer (Finance, events, audit log)</div>',
        '<div class="t-out-row">3. <strong class="t-highlight">eBarangay Portal</strong> <span class="t-tag">CIVIC TECH</span> — Digital governance &amp; citizen services</div>',
        '<div class="t-out-row">4. <strong class="t-highlight">Medicine Dispenser</strong> <span class="t-tag">EMBEDDED</span> — Java Swing GUI driving Arduino microcontroller hardware</div>',
        '<div class="t-out-row">5. <strong class="t-highlight">PMAEE CadetCoach</strong> <span class="t-tag">AI PORTAL</span> — reviewer-coach.onrender.com (PMA exam prep AI)</div>',
        '<div class="t-out-row">6. <strong class="t-highlight">Content Creation Manager</strong> <span class="t-tag">UTILITY</span> — Java desktop file I/O &amp; preset workflow tool</div>',
        '<div class="t-out-row">7. <strong class="t-highlight">F.R.I.D.A.Y</strong> <span class="t-tag">PROTOTYPE</span> — Python NLP interactive voice &amp; vision assistant</div>',
        '<div class="t-out-row" style="margin-top:6px; color:#fff;">👉 Type <span class="t-highlight">explore</span> to view full screenshots &amp; live demos.</div>'
      ].join("");
    },

    skills: function () {
      return [
        '<div class="t-out-title">CORE ENGINEERING TOOLCHAIN:</div>',
        '<div class="t-out-row"><strong>Languages:</strong> <span class="t-tag">PHP</span> <span class="t-tag">Java</span> <span class="t-tag">JavaScript</span> <span class="t-tag">Python</span> <span class="t-tag">C++ (Arduino)</span> <span class="t-tag">SQL</span></div>',
        '<div class="t-out-row"><strong>Hardware &amp; Embedded:</strong> Arduino Uno, sensor arrays, stepper motor actuators, serial I/O, circuit prototyping</div>',
        '<div class="t-out-row"><strong>Frameworks &amp; Web:</strong> Node.js, Express, Java Swing, REST APIs, MySQL, GSAP, CSS3 Custom Properties</div>',
        '<div class="t-out-row"><strong>Creative Suite:</strong> Adobe Lightroom, Photoshop, Premiere Pro, Davinci Resolve</div>'
      ].join("");
    },

    photo: function () {
      return [
        '<div class="t-out-title t-accent">LOWBUD PHOTOGRAPHY · VISUAL STORYTELLING:</div>',
        '<div class="t-out-row"><strong>Brand:</strong> LowBud Photography (facebook.com/Lowbudphotography27/)</div>',
        '<div class="t-out-row"><strong>Focus:</strong> Weddings, Christenings, Portraits, Student Publication &amp; College of Engineering Photojournalism</div>',
        '<div class="t-out-row"><strong>Optics:</strong> Prime lens documentary (85mm ƒ/1.4, 50mm ƒ/1.8, 35mm ƒ/1.8) · Natural light &amp; intimate ceremony captures</div>',
        '<div class="t-out-row" style="margin-top:6px;">👉 Type <span class="t-accent">explore</span> and switch to <em>Create</em> mode to view the interactive 3D Photo Deck &amp; Full Archive.</div>'
      ].join("");
    },

    about: function () {
      return [
        '<div class="t-out-title">ABOUT LEX MATONDO:</div>',
        '<div class="t-out-row">Computer Engineering student at Cor Jesu College (CJC) · Developer &amp; Visual Storyteller.</div>',
        '<div class="t-out-row">Specialized in building full-stack portals, embedded micro-controller systems, and documentary photography.</div>',
        '<div class="t-out-row">Ethos: <em>"Build what serves the community first — whether it is replacing manual paper queues with instant digital portals, or preserving authentic life milestones frame by frame."</em></div>'
      ].join("");
    },

    contact: function () {
      return [
        '<div class="t-out-title">CONTACT &amp; PROFILES:</div>',
        '<div class="t-out-row">Email: <a href="mailto:lexmatondo@g.cjc.edu.ph" class="t-highlight">lexmatondo@g.cjc.edu.ph</a></div>',
        '<div class="t-out-row">GitHub: <a href="https://github.com/CodeWithLex" target="_blank" class="t-highlight">github.com/CodeWithLex</a></div>',
        '<div class="t-out-row">Facebook: <a href="https://www.facebook.com/Lowbudphotography27/" target="_blank" class="t-accent">LowBud Photography</a></div>',
        '<div class="t-out-row">TikTok: <a href="https://www.tiktok.com/@edrickvisuals.mov" target="_blank" class="t-accent">@edrickvisuals.mov</a></div>',
        '<div class="t-out-row">YouTube: <a href="https://www.youtube.com/@lexmatondo27" target="_blank" class="t-accent">@lexmatondo27</a></div>'
      ].join("");
    },

    clear: function () {
      if (terminalHistory) terminalHistory.innerHTML = "";
      return null;
    },

    sudo: function () {
      return '<span style="color:#ef4444;">lex is already root in this workspace. Permission granted.</span>';
    },

    ls: function () {
      return '<span class="t-tag">projects.md</span> <span class="t-tag">skills.json</span> <span class="t-tag">photo_archive/</span> <span class="t-tag">portfolio.html</span> <span class="t-tag">resume.pdf</span>';
    },

    whoami: function () {
      return '<strong class="t-highlight">Lex Matondo</strong> — Computer Engineering student &amp; developer.';
    }
  };

  function executeCommand(rawCmd) {
    var cmd = (rawCmd || "").trim().toLowerCase();
    if (!cmd) return;

    commandHistory.push(rawCmd);
    historyIndex = commandHistory.length;

    var outputHtml = "";
    if (commands[cmd]) {
      outputHtml = commands[cmd]();
    } else {
      outputHtml = '<span style="color:#f87171;">command not found: ' + escapeHtml(cmd) + '. Type <strong style="color:#fff;">help</strong> or <strong style="color:#4ade80;">explore</strong>.</span>';
    }

    if (outputHtml !== null && terminalHistory) {
      var entry = document.createElement("div");
      entry.className = "t-entry";
      entry.innerHTML = [
        '<div class="t-entry-cmd">',
        '  <span class="t-user">lex@cjc</span><span class="t-sep">:</span><span class="t-path">~</span><span class="t-dollar">$</span>',
        '  <span>' + escapeHtml(rawCmd) + '</span>',
        '</div>',
        '<div class="t-entry-out">' + outputHtml + '</div>'
      ].join("");
      terminalHistory.appendChild(entry);
    }

    if (terminalBody) {
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function (m) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m];
    });
  }

  if (terminalForm && terminalInput) {
    terminalForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var val = terminalInput.value;
      terminalInput.value = "";
      executeCommand(val);
    });

    terminalInput.addEventListener("keydown", function (e) {
      if (e.key === "ArrowUp") {
        if (commandHistory.length && historyIndex > 0) {
          historyIndex--;
          terminalInput.value = commandHistory[historyIndex];
        }
        e.preventDefault();
      } else if (e.key === "ArrowDown") {
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          terminalInput.value = commandHistory[historyIndex];
        } else {
          historyIndex = commandHistory.length;
          terminalInput.value = "";
        }
        e.preventDefault();
      } else if (e.key === "Tab") {
        e.preventDefault();
        var cur = terminalInput.value.trim().toLowerCase();
        var match = Object.keys(commands).find(function (k) { return k.startsWith(cur); });
        if (match) terminalInput.value = match;
      }
    });

    // Clicking anywhere on terminal body focuses input
    if (terminalBody) {
      terminalBody.addEventListener("click", function (e) {
        if (!e.target.closest("a") && !e.target.closest("button")) {
          terminalInput.focus();
        }
      });
    }
  }

  // Quick shortcuts
  shortcutBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cmd = btn.getAttribute("data-cmd");
      if (terminalInput) terminalInput.value = cmd;
      executeCommand(cmd);
      if (terminalInput) terminalInput.value = "";
    });
  });

  /* ---- Page entrance animations ---- */
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced || !window.gsap) return;

  gsap
    .timeline({ defaults: { duration: 0.35, ease: "power2.out" } })
    .from(".topbar", { y: -12, autoAlpha: 0, clearProps: "all" })
    .from(".card-shell", { y: 16, autoAlpha: 0, clearProps: "transform" }, "-=0.15")
    .from(".cta-row .btn", { y: 8, autoAlpha: 0, stagger: 0.08, clearProps: "all" }, "-=0.1")
    .from(".site-footer", { autoAlpha: 0, clearProps: "all" }, "-=0.1");

})();
