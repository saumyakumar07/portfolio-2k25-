/* ===== MATRIX RAIN ===== */
(function () {
  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas.getContext('2d');
  let cols, drops;
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width / 20);
    drops = Array(cols).fill(1);
  }
  resize();
  window.addEventListener('resize', resize);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()!<>/\\|{}[]';
  function draw() {
    ctx.fillStyle = 'rgba(4,13,8,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff41';
    ctx.font = '14px JetBrains Mono, monospace';
    for (let i = 0; i < drops.length; i++) {
      ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 20, drops[i] * 20);
      if (drops[i] * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }
  setInterval(draw, 60);
})();

/* ===== NAVBAR SCROLL ===== */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
});

/* ===== ACTIVE NAV LINK ===== */
window.addEventListener('scroll', () => {
  let current = '';
  document.querySelectorAll('section[id]').forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--green)' : '';
  });
});

/* ===== INTERSECTION OBSERVER (skill bars + fade) ===== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    entry.target.querySelectorAll('.skill-fill').forEach(b => b.style.width = b.dataset.w + '%');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.1 });
document.querySelectorAll('section').forEach(s => { s.classList.add('fade-in'); observer.observe(s); });
const hero = document.getElementById('hero');
if (hero) hero.classList.add('visible');

/* ═══════════════════════════════════════════════
   INTERACTIVE TERMINAL ENGINE
═══════════════════════════════════════════════ */
(function () {
  const output    = document.getElementById('termOutput');
  const input     = document.getElementById('termInput');
  const body      = document.getElementById('itermBody');
  const window_el = document.getElementById('itermWindow');

  if (!output || !input) return;

  let history = [];
  let histIdx  = -1;

  const COMMANDS = ['help','whoami','skills','certs','certifications','projects',
    'project','research','publications','contact','social','ls','clear',
    'banner','neofetch','date','pwd','sudo','exit','cd'];

  /* ── helpers ─────────────────────────────── */
  function h(tag, cls, html) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (html !== undefined) el.innerHTML = html;
    return el;
  }
  function line(html, cls = '') {
    output.appendChild(h('span', 't-line ' + cls, html));
  }
  function gap() { output.appendChild(h('span', 't-gap')); }
  function scrollBottom() {
    requestAnimationFrame(() => { body.scrollTop = body.scrollHeight; });
  }
  function echoCmd(cmd) {
    const row = h('div', 'term-echo');
    row.innerHTML = `<span class="term-prompt">root@saumya:~$&nbsp;</span><span class="term-echo-cmd">${escHtml(cmd)}</span>`;
    output.appendChild(row);
  }
  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
  function unknown(cmd) {
    gap();
    line(`<span class="t-red">bash: ${escHtml(cmd)}: command not found</span>`);
    line(`<span class="t-dim">Type <span class="t-green">help</span> to see available commands.</span>`);
    gap();
  }
  function divider(char = '─', len = 58) {
    line(`<span class="t-dim">${char.repeat(len)}</span>`);
  }

  /* ── COMMANDS ────────────────────────────── */

  function cmdBanner() {
    gap();
    output.appendChild(h('div', 't-banner',
`███████╗ █████╗ ██╗   ██╗███╗   ███╗██╗   ██╗ █████╗
██╔════╝██╔══██╗██║   ██║████╗ ████║╚██╗ ██╔╝██╔══██╗
███████╗███████║██║   ██║██╔████╔██║ ╚████╔╝ ███████║
╚════██║██╔══██║██║   ██║██║╚██╔╝██║  ╚██╔╝  ██╔══██║
███████║██║  ██║╚██████╔╝██║ ╚═╝ ██║   ██║   ██║  ██║
╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝   ╚═╝   ╚═╝  ╚═╝`));
    const g = h('div','t-banner');
    g.style.fontSize = '0.62rem';
    g.style.letterSpacing = '0';
    g.textContent =
`██╗  ██╗██╗   ██╗███╗   ███╗ █████╗ ██████╗
██║ ██╔╝██║   ██║████╗ ████║██╔══██╗██╔══██╗
█████╔╝ ██║   ██║██╔████╔██║███████║██████╔╝
██╔═██╗ ██║   ██║██║╚██╔╝██║██╔══██║██╔══██╗
██║  ██╗╚██████╔╝██║ ╚═╝ ██║██║  ██║██║  ██║
╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝`;
    output.appendChild(g);
    gap();
    line(`<span class="t-green t-bold">  ⚡ SAUMYA KUMAR</span> <span class="t-dim">·</span> <span class="t-cyan">Cyber Guardian</span> <span class="t-dim">·</span> Research Engineer @ IIT Kanpur`);
    line(`  <span class="t-dim">CEH v12  ·  CompTIA Security+  ·  ISO 27001</span>`);
    gap();
    line(`  <span class="t-dim">Type </span><span class="t-green">help</span><span class="t-dim"> to explore this portfolio via terminal.</span>`);
    gap();
  }

  function cmdHelp() {
    gap();
    line(`<span class="t-green t-bold">AVAILABLE COMMANDS</span>`);
    divider();
    const cmds = [
      ['help',           'Show this help menu'],
      ['whoami',         'About Saumya Kumar'],
      ['skills',         'Technical skill matrix'],
      ['certs',          'View certifications (CEH, Security+, ISO 27001)'],
      ['projects',       'List all projects'],
      ['project &lt;name&gt;', 'View project details  (e.g. project aws)'],
      ['research',       'Research publications'],
      ['contact',        'Get in touch'],
      ['social',         'Social media & profile links'],
      ['ls',             'List all portfolio sections'],
      ['neofetch',       'System info card'],
      ['banner',         'Show welcome banner'],
      ['date',           'Current date & time'],
      ['clear',          'Clear the terminal'],
    ];
    const tbl = h('div','help-table');
    cmds.forEach(([cmd, desc]) => {
      const row = h('div','help-row');
      row.innerHTML = `<span class="help-cmd">${cmd}</span><span class="help-desc t-dim">${desc}</span>`;
      tbl.appendChild(row);
    });
    output.appendChild(tbl);
    divider();
    line(`<span class="t-dim">Tip: use </span><span class="t-green">↑ ↓</span><span class="t-dim"> for command history  ·  </span><span class="t-green">Tab</span><span class="t-dim"> to autocomplete</span>`);
    gap();
  }

  function cmdWhoami() {
    gap();
    line(`<span class="t-green t-bold">❯ SAUMYA KUMAR</span>`);
    divider();
    line(`<span class="t-cyan">Role    </span> Research Engineer @ IIT Kanpur`);
    line(`<span class="t-cyan">Location</span> Kanpur, India`);
    line(`<span class="t-cyan">Focus   </span> Cybersecurity · GRC · VAPT · Cloud Security · Digital Forensics`);
    line(`<span class="t-cyan">Certs   </span> CEH v12 · CompTIA Security+ · ISO 27001`);
    line(`<span class="t-cyan">Papers  </span> 2 peer-reviewed publications (IJIRT & IJSDR)`);
    gap();
    line(`A passionate cybersecurity professional and software developer dedicated`);
    line(`to building a safer digital world. I specialize in GRC, VAPT, and`);
    line(`cloud security — bridging offensive knowledge with defensive strategy.`);
    gap();
    line(`<span class="t-dim">→ Type </span><span class="t-green">skills</span><span class="t-dim"> or </span><span class="t-green">projects</span><span class="t-dim"> to keep exploring.</span>`);
    gap();
  }

  function cmdSkills() {
    gap();
    line(`<span class="t-green t-bold">❯ SKILL MATRIX</span>`);
    divider();
    const cats = [
      { label: '⚔  Offensive Security', color: 't-red', skills: [
        ['VAPT', 88], ['Phishing Simulation', 82], ['OSINT', 85], ['Digital Forensics', 80]
      ]},
      { label: '🛡  Governance & Compliance', color: 't-cyan', skills: [
        ['ISO 27001', 90], ['NIST CSF', 85], ['CIS Controls', 82], ['IT Audit', 78]
      ]},
      { label: '☁  Cloud & Infrastructure', color: 't-yellow', skills: [
        ['AWS', 85], ['Linux', 88], ['OpenSearch / Kibana', 78], ['Raspberry Pi / NAS', 75]
      ]},
      { label: '</> Development', color: 't-green', skills: [
        ['Python', 90], ['JavaScript', 80], ['Flask / Django', 78], ['Bash Scripting', 82]
      ]},
    ];
    cats.forEach(cat => {
      gap();
      line(`<span class="${cat.color} t-bold">${cat.label}</span>`);
      cat.skills.forEach(([name, pct]) => {
        const bar = h('div', 't-skill-row');
        bar.innerHTML = `
          <span class="t-skill-name">${name}</span>
          <span class="t-skill-bar"><span class="t-skill-fill" style="width:0%" data-w="${pct}"></span></span>
          <span class="t-skill-pct">${pct}%</span>`;
        output.appendChild(bar);
        requestAnimationFrame(() => {
          setTimeout(() => {
            bar.querySelector('.t-skill-fill').style.width = pct + '%';
          }, 100);
        });
      });
    });
    gap();
  }

  function cmdCerts() {
    gap();
    line(`<span class="t-green t-bold">❯ CERTIFICATIONS</span>`);
    divider();
    const certs = [
      { badge:'EC-Council', name:'CEH v12', full:'Certified Ethical Hacker', color:'t-red',
        desc:'Mastery of offensive techniques, footprinting, scanning, exploitation & post-exploitation.' },
      { badge:'CompTIA', name:'Security+', full:'CompTIA Security+', color:'t-cyan',
        desc:'Threats, vulnerabilities, architecture, implementation, operations & compliance.' },
      { badge:'ISO / IEC', name:'ISO 27001', full:'Information Security Management', color:'t-yellow',
        desc:'Implementing & managing an ISMS aligned with international standards.' },
    ];
    certs.forEach(c => {
      gap();
      line(`<span class="${c.color} t-bold">[${c.badge}]</span>  <span class="t-white t-bold">${c.name}</span>  <span class="t-dim">— ${c.full}</span>`);
      line(`  <span class="t-dim">${c.desc}</span>`);
    });
    gap();
  }

  function cmdProjects() {
    gap();
    line(`<span class="t-green t-bold">❯ PROJECTS</span>`);
    divider();
    line(`<span class="t-dim">Use </span><span class="t-green">project &lt;name&gt;</span><span class="t-dim"> for details. Available names:</span>`);
    gap();
    const projs = [
      ['stega',    'Stega Secure',              'SECURITY TOOL', 't-red'],
      ['aws',      'AWS Log Analytics Solution', 'CLOUD / AWS',   't-cyan'],
      ['auditrite','AUditRite',                  'GRC / AUDIT',   't-yellow'],
      ['pinas',    'PiNAS',                      'HARDWARE',      't-dim'],
    ];
    projs.forEach(([key, name, type, color]) => {
      line(`  <span class="t-green">project ${key.padEnd(12)}</span> <span class="${color}">[${type}]</span>  <span class="t-white">${name}</span>`);
    });
    gap();
  }

  const PROJECT_DATA = {
    stega: {
      title: 'Stega Secure', type: 'SECURITY TOOL', color: 't-red',
      desc: 'A steganography encryption tool that hides sensitive data inside image files.\nCombines cryptographic techniques with image steganography for covert communication.',
      stack: ['Python', 'Cryptography', 'Pillow', 'Steganography'],
      link: 'https://github.com/saumyakumar07'
    },
    aws: {
      title: 'AWS Log Analytics Solution', type: 'CLOUD / AWS', color: 't-cyan',
      desc: 'Scalable cloud log analytics pipeline processing 10M+ logs/day.\nBuilt on Kinesis Firehose, Apache Flink & OpenSearch with real-time Kibana dashboards.',
      stack: ['AWS', 'Kinesis Firehose', 'Apache Flink', 'OpenSearch', 'Kibana'],
      link: 'https://github.com/saumyakumar07/Log-Analytics-Solution-AWS'
    },
    auditrite: {
      title: 'AUditRite', type: 'GRC / AUDIT', color: 't-yellow',
      desc: 'Automated IT audit system streamlining compliance processes.\nGenerates audit trails, risk assessments & reports aligned with ISO 27001 and NIST.',
      stack: ['Python', 'Django', 'ISO 27001', 'NIST'],
      link: 'https://github.com/saumyakumar07'
    },
    pinas: {
      title: 'PiNAS', type: 'HARDWARE', color: 't-dim',
      desc: 'Self-hosted Network Attached Storage built on Raspberry Pi with OpenMediaVault.\nSecure, private cloud storage with SSH access and data encryption at rest.',
      stack: ['Raspberry Pi', 'OpenMediaVault', 'Linux', 'SSH'],
      link: 'https://github.com/saumyakumar07/PiNAS'
    },
  };

  function cmdProject(arg) {
    const key = arg ? arg.toLowerCase().replace(/[^a-z0-9]/g,'') : '';
    if (!key || !PROJECT_DATA[key]) {
      gap();
      if (key) line(`<span class="t-red">Project "${escHtml(arg)}" not found.</span>`);
      line(`<span class="t-dim">Available: </span><span class="t-green">stega, aws, auditrite, pinas</span>`);
      gap();
      return;
    }
    const p = PROJECT_DATA[key];
    gap();
    const card = h('div', 't-proj-card');
    card.innerHTML = `
      <div style="margin-bottom:6px">
        <span class="${p.color} t-bold">[${p.type}]</span>
        <span class="t-white t-bold" style="margin-left:10px;font-size:0.95rem">${p.title}</span>
      </div>
      <div class="t-dim" style="font-size:0.82rem;line-height:1.7;white-space:pre-wrap">${p.desc}</div>
      <div style="margin-top:8px">
        ${p.stack.map(s=>`<span style="border:1px solid #0f3d1f;padding:1px 8px;font-size:0.7rem;color:var(--text-dim);margin-right:5px">${s}</span>`).join('')}
      </div>
      <div style="margin-top:8px">
        <a href="${p.link}" target="_blank" class="t-cyan" style="font-size:0.78rem;text-decoration:none">⎋ View on GitHub →</a>
      </div>`;
    output.appendChild(card);
    gap();
  }

  function cmdResearch() {
    gap();
    line(`<span class="t-green t-bold">❯ RESEARCH PUBLICATIONS</span>`);
    divider();
    gap();
    line(`<span class="t-cyan t-bold">[1]  IJIRT</span>  <span class="t-dim">· Peer-Reviewed</span>`);
    line(`     <span class="t-white">Research Paper on Cloud Security</span>`);
    line(`     <span class="t-dim">Explores emerging cloud threats & proposes a layered defense framework.</span>`);
    line(`     <span class="t-dim">Tags: Cloud Security · AWS · Threat Modeling</span>`);
    line(`     <a href="https://ijirt.org/article?manuscript=154508" target="_blank" class="t-cyan" style="text-decoration:none;font-size:0.8rem">↗ Read Paper</a>`);
    gap();
    line(`<span class="t-cyan t-bold">[2]  IJSDR</span>  <span class="t-dim">· Peer-Reviewed</span>`);
    line(`     <span class="t-white">Research Paper on Cyber Law</span>`);
    line(`     <span class="t-dim">Analyzes cybersecurity & legal frameworks; cross-border cybercrime jurisdiction.</span>`);
    line(`     <span class="t-dim">Tags: Cyber Law · Compliance · Jurisdiction</span>`);
    line(`     <a href="https://www.ijsdr.org/viewpaperforall.php?paper=IJSDR2304266" target="_blank" class="t-cyan" style="text-decoration:none;font-size:0.8rem">↗ Read Paper</a>`);
    gap();
  }

  function cmdContact() {
    gap();
    line(`<span class="t-green t-bold">❯ CONTACT</span>`);
    divider();
    line(`Open to cybersecurity roles, consulting, and research collaborations.`);
    line(`The best way to reach me is directly via email.`);
    gap();
    line(`<span class="t-cyan">Email   </span>  <a href="mailto:saumyakumar8935@gmail.com" class="t-white" style="text-decoration:none">saumyakumar8935@gmail.com</a>`);
    gap();
    line(`<span class="t-dim">Or use </span><span class="t-green">social</span><span class="t-dim"> to see all profile links.</span>`);
    gap();
  }

  function cmdSocial() {
    gap();
    line(`<span class="t-green t-bold">❯ SOCIAL LINKS</span>`);
    divider();
    line(`<span class="t-cyan">GitHub    </span>  <a href="https://github.com/saumyakumar07" target="_blank" class="t-white" style="text-decoration:none">github.com/saumyakumar07</a>`);
    line(`<span class="t-cyan">LinkedIn  </span>  <a href="https://www.linkedin.com/in/saumyakumar4321/" target="_blank" class="t-white" style="text-decoration:none">linkedin.com/in/saumyakumar4321</a>`);
    line(`<span class="t-cyan">TryHackMe </span>  <a href="https://tryhackme.com" target="_blank" class="t-white" style="text-decoration:none">tryhackme.com</a>`);
    line(`<span class="t-cyan">Email     </span>  <a href="mailto:saumyakumar8935@gmail.com" class="t-white" style="text-decoration:none">saumyakumar8935@gmail.com</a>`);
    gap();
  }

  function cmdLS() {
    gap();
    line(`<span class="t-green t-bold">❯ PORTFOLIO SECTIONS</span>`);
    divider();
    const sections = [
      ['about',        'whoami',       'About & background'],
      ['skills',       'skill_matrix', 'Technical skills'],
      ['certs',        'certs',        'Certifications'],
      ['projects',     'projects',     'Project showcase'],
      ['publications', 'research',     'Research papers'],
      ['contact',      'contact',      'Get in touch'],
    ];
    sections.forEach(([href, cmd, label]) => {
      line(`  <span class="t-cyan">drwxr-xr-x</span>  <a href="#${href}" class="t-green" style="text-decoration:none">${cmd.padEnd(16)}</a> <span class="t-dim">${label}</span>`);
    });
    gap();
    line(`<span class="t-dim">Click section name to jump there, or type the command.</span>`);
    gap();
  }

  function cmdNeofetch() {
    gap();
    const ascii = [
      `  <span class="t-green">██████╗</span>  `,
      `  <span class="t-green">██╔════╝</span> `,
      `  <span class="t-green">╚█████╗ </span> `,
      `  <span class="t-green"> ╚════██╗</span>`,
      `  <span class="t-green">██████╔╝</span> `,
      `  <span class="t-green">╚═════╝ </span> `,
    ];
    const info = [
      `<span class="t-green t-bold">saumyakumar</span><span class="t-dim">@</span><span class="t-green t-bold">portfolio</span>`,
      `<span class="t-dim">─────────────────────────</span>`,
      `<span class="t-cyan">OS      </span> Kali Linux 2024 (Cyber Mode)`,
      `<span class="t-cyan">Shell   </span> zsh 5.9 + oh-my-zsh`,
      `<span class="t-cyan">Role    </span> Research Engineer @ IIT Kanpur`,
      `<span class="t-cyan">Certs   </span> CEH v12 · Security+ · ISO 27001`,
      `<span class="t-cyan">Tools   </span> Burp Suite · Nmap · Metasploit · Wireshark`,
      `<span class="t-cyan">Cloud   </span> AWS (EC2, S3, Kinesis, OpenSearch)`,
      `<span class="t-cyan">Focus   </span> GRC · VAPT · Digital Forensics`,
      `<span class="t-cyan">Papers  </span> 2 peer-reviewed publications`,
      `<span class="t-dim">─────────────────────────</span>`,
      `<span style="color:#ff5f56">███</span><span style="color:#ffbd2e">███</span><span style="color:#27c93f">███</span><span style="color:#00d4ff">███</span><span style="color:#a855f7">███</span><span style="color:#ff2244">███</span>`,
    ];
    const maxRows = Math.max(ascii.length, info.length);
    for (let i = 0; i < maxRows; i++) {
      const a = ascii[i] || '           ';
      const b = info[i]  || '';
      line(`${a}  ${b}`);
    }
    gap();
  }

  function cmdDate() {
    gap();
    const now = new Date();
    line(`<span class="t-cyan">${now.toDateString()}</span>  <span class="t-dim">${now.toTimeString().split(' ')[0]}</span>  <span class="t-dim">${Intl.DateTimeFormat().resolvedOptions().timeZone}</span>`);
    gap();
  }

  function cmdPwd() {
    gap();
    line(`<span class="t-green">/home/saumya/portfolio</span>`);
    gap();
  }

  function cmdSudo(arg) {
    gap();
    if (!arg) {
      line(`<span class="t-red">usage: sudo &lt;command&gt;</span>`);
    } else {
      line(`<span class="t-yellow">[sudo] password for saumya: </span>`);
      setTimeout(() => {
        line(`<span class="t-red">Sorry, try again.</span>`);
        setTimeout(() => {
          line(`<span class="t-red">Sorry, try again.</span>`);
          setTimeout(() => {
            line(`<span class="t-red">sudo: 3 incorrect password attempts</span>`);
            line(`<span class="t-dim">(Nice try 😏)</span>`);
            gap();
            scrollBottom();
          }, 900);
          scrollBottom();
        }, 900);
        scrollBottom();
      }, 700);
    }
    gap();
  }

  function cmdExit() {
    gap();
    line(`<span class="t-dim">Logging out...</span>`);
    setTimeout(() => {
      line(`<span class="t-green">Connection closed. Thanks for visiting!</span>`);
      gap();
      scrollBottom();
    }, 600);
    gap();
  }

  function cmdCd(arg) {
    gap();
    if (!arg || arg === '~') {
      line(`<span class="t-green">/home/saumya/portfolio</span>`);
    } else {
      line(`<span class="t-red">bash: cd: ${escHtml(arg)}: Permission denied</span>`);
      line(`<span class="t-dim">(This is a portfolio, not a real filesystem 😄)</span>`);
    }
    gap();
  }

  /* ── Process a command ───────────────────── */
  function process(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return;

    history.unshift(trimmed);
    histIdx = -1;

    echoCmd(trimmed);

    const [cmd, ...args] = trimmed.split(/\s+/);
    const arg = args.join(' ');

    switch (cmd.toLowerCase()) {
      case 'help':           cmdHelp();        break;
      case 'whoami':         cmdWhoami();      break;
      case 'skills':         cmdSkills();      break;
      case 'certs':
      case 'certifications': cmdCerts();       break;
      case 'projects':       cmdProjects();    break;
      case 'project':        cmdProject(arg);  break;
      case 'research':
      case 'publications':   cmdResearch();    break;
      case 'contact':        cmdContact();     break;
      case 'social':         cmdSocial();      break;
      case 'ls':             cmdLS();          break;
      case 'neofetch':       cmdNeofetch();    break;
      case 'banner':         cmdBanner();      break;
      case 'date':           cmdDate();        break;
      case 'pwd':            cmdPwd();         break;
      case 'sudo':           cmdSudo(arg);     break;
      case 'exit':
      case 'quit':           cmdExit();        break;
      case 'cd':             cmdCd(arg);       break;
      case 'clear':
        output.innerHTML = '';
        break;
      default:
        unknown(cmd);
    }
    scrollBottom();
  }

  /* ── Input events ────────────────────────── */
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const val = input.value;
      input.value = '';
      process(val);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (histIdx < history.length - 1) {
        histIdx++;
        input.value = history[histIdx];
        setTimeout(() => { input.selectionStart = input.selectionEnd = input.value.length; }, 0);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx > 0) {
        histIdx--;
        input.value = history[histIdx];
      } else {
        histIdx = -1;
        input.value = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const partial = input.value.trim().toLowerCase();
      const matches = COMMANDS.filter(c => c.startsWith(partial));
      if (matches.length === 1) {
        input.value = matches[0] + ' ';
      } else if (matches.length > 1) {
        echoCmd(input.value);
        line(matches.map(m => `<span class="t-green">${m}</span>`).join('  '));
        gap();
        scrollBottom();
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      output.innerHTML = '';
    }
  });

  /* Focus input on any click inside terminal */
  document.getElementById('itermWindow').addEventListener('click', () => input.focus());

  /* ── Boot sequence ───────────────────────── */
  function boot() {
    cmdBanner();
    scrollBottom();
    setTimeout(() => input.focus(), 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
