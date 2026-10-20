/* ================= ELEMENTS + STATE ================= */

const terminal    = document.getElementById('terminal');
const screen      = document.querySelector('.screen');
const percent     = document.querySelector('.percent');
const progress    = document.querySelector('.progress');
const progressbar = document.querySelector('.progress-bar');

const titleScreen = document.getElementById('title-screen');
const loginScreen = document.getElementById('login-screen');
const loginForm   = document.getElementById('login-form');
const userInput   = document.getElementById('login-user');
const passInput   = document.getElementById('login-pass');
const loginMsg    = document.getElementById('login-msg');
const menuScreen  = document.getElementById('menu-screen');
const menuUser    = document.getElementById('menu-user');
const menuButtons = document.getElementById('menu-buttons');
const modeSimpleBtn   = document.getElementById('mode-simple');
const modeTerminalBtn = document.getElementById('mode-terminal');
const modeHint        = document.getElementById('mode-hint');
const winFooter = document.getElementById('win-footer');

let count = 4;
let per = 16;
let loading;
let currentUser = 'Guest';
let booted = false;
let mode = 'terminal';   // 'terminal' or 'simple'
let currentLine = 0;

/* ================= CONTENT (edit these) ================= */

const skills = ['Java', 'C', 'HTML', 'CSS', 'JavaScript'];

const profileInfo = [
    'Name: Arwin',
    'Education: B.S. Computer Science, Temple University',
    { label: 'GitHub',   url: 'https://github.com/Arwin-j' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/arwin-johnson-64718a256/' },
    // add more lines here
];


// Education: one object per school
const education = [
    {
        school:   'Temple University',
        period:   'Aug 2022 - May 2026',
        status:   'Graduated',            // or 'In progress'
        location: 'Philadelphia, PA',
        degree:   'Bachelor of Science in Computer Science'
    },
];

// Certifications: one object per certificate (EDIT these placeholders)
const certifications = [
    {
        name:     'Python Developer',
        date:     '05 2026',
        provider: 'freeCodeCamp',
        url:      'https://www.freecodecamp.org/certification/arwinjasperjohnson/python-v9'
    },
    {
        name:     'Certificate of completion: Claude 101',
        date:     '06 2026',
        provider: 'Anthropic',
        url:      'https://verify.skilljar.com/c/e2b3grfim2h7'
    }
];

// Scrolls across the top of the Simple-mode menu (one line)
const introTicker = "Hello! I'm Arwin, a recent Computer Science graduate on a mission to master AI Engineering and Game Development. I love turning complex logic into interactive experiences. Explore my portfolio to see how I bridge the gap between intelligent data and gameplay!";

// Types out slowly after the ticker has passed (EDIT this to your own words)
const ambitionText = 'My ambition is to build and create meaningful software that simplifies lives and solves real-world problems.';

// Shown in the big Introduction window (/intro in Terminal mode)
const introParagraphs = [
    "Hi, I'm Arwin.",
    'I am a Computer Science graduate from Temple University.',
    'This portfolio is built as a retro terminal. Type help to see what else you can open.',
    // add more paragraphs here
];

const helpInfo = [
    'help - displays all commands with instructions',
    'intro - opens the introduction window',
    'education (or edu) - opens the education window',
    'clear - clears terminal',
    'exit - returns to the title screen'
];

function getBootSequence() {
    return [
        { text: 'Initializing profile load......', delay: 30 },
        { text: 'Loaded successfully...', delay: 30 },
        { text: `Welcome esteemed ${currentUser} User..... Hope you are doing well!`, delay: 60 },
    ];
}

function getSystemInfo() {
    return [
        'Portfolio Access: Success',
        `User: ${currentUser}`,
        'Welcome to P-Access Terminal',
        'Enter system commands',
        `Need help? Type 'help'`
    ];
}

/* ================= TERMINAL HELPERS ================= */

function createLine() {
    const line = document.createElement('div');
    line.className = 'line';
    terminal.appendChild(line);
    return line;
}

function printStatic(lines) {
    lines.forEach(text => {
        createLine().textContent = text;
    });
}

function clearTerminal() {
    terminal.innerHTML = '';
}

function typeText(element, text, speed, callback) {
    let i = 0;
    const typing = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typing);
            if (callback) callback();
        }
    }, speed);
    return typing;
}

/* ================= BOOT ================= */

function animate() {
    if (count >= 100) {
        clearInterval(loading);
        percent.style.display = 'none';
        progress.style.display = 'none';
        progressbar.style.display = 'none';
        setTimeout(bootTerminal, 500);
    } else {
        per += 8;
        count += 2;
        progress.style.width = per + 'px';
        percent.textContent = count + '%';
    }
}

function bootTerminal() {
    const sequence = getBootSequence();

    if (currentLine < sequence.length) {
        const line = createLine();
        const { text, delay } = sequence[currentLine];

        typeText(line, text, delay, () => {
            currentLine++;
            setTimeout(bootTerminal, 200);
        });
    } else {
        setTimeout(() => {
            clearTerminal();
            printStatic(getSystemInfo());
            showPrompt();
        }, 500);
    }
}

/* ================= COMMANDS ================= */

// Each entry becomes a terminal command AND a button in Simple mode.
// To add another pop-up page, add one line here.
const infoWindows = {
    profile: { title: 'Profile', items: profileInfo, inMenu: false},
    skills:  { title: 'Skills',  items: skills, inMenu: false},
    intro:   { title: 'Introduction', items: introParagraphs, inMenu: false, options: { large: true, paragraphs: true } },
    education: {
        title: 'Education',
        aliases: ['edu'],
        items: [],
        options: {
            wide: true,
            render: renderEducation,
            footer: [{ label: 'Certifications', onClick: () => openInfo('certifications') }]
        }
    },
    certifications: {
        title: 'Certifications',
        aliases: ['certs'],
        inMenu: false,                   // reached from the Education window instead
        items: [],
        options: {
            wide: true,
            render: renderCertifications,
            footer: [{ label: 'Back to Education', onClick: () => openInfo('education') }]
        }
    },
};

function openInfo(key) {
    const w = infoWindows[key];
    openWindow(w.title, w.items, w.options);
}

// every entry (and its aliases) becomes a terminal command
const windowCommands = {};
Object.entries(infoWindows).forEach(([name, w]) => {
    [name, ...(w.aliases || [])].forEach(cmd => { windowCommands[cmd] = () => openInfo(name); });
});

const commands = {
    help:  () => printStatic(helpInfo),
    clear: clearTerminal,
    exit:  () => location.reload(),      // fresh start at the title screen
    ...windowCommands,
};


function runCommand(raw) {
        const key = raw.toLowerCase().replace(/^\//, '');
    if (Object.hasOwn(commands, key)) commands[key]();
    else printStatic([`Command not found: ${raw}. Type 'help'.`]);
}

function showPrompt() {
    const blankLine = createLine();
    blankLine.innerHTML = '&nbsp;';

    const promptLine = createLine();
    promptLine.className = 'line prompt active';
    promptLine.innerHTML = 'profile@terminal: ~$ <span class="cursor"></span>';

    setupInput(promptLine);
}

function setupInput(promptLine) {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'user-input';
    input.autocomplete = 'off';
    input.spellcheck = false;

    promptLine.querySelector('.cursor').replaceWith(input);
    input.focus();
    input.scrollIntoView({ block: 'nearest' });

    input.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();      // stops this Enter from also "clicking" a button we focus next
        const command = input.value.trim();
        if (!command) return;

        input.disabled = true;   // freeze the old line
        runCommand(command);
        showPrompt();
    });
}

// One global refocus listener (added once)
document.addEventListener('click', () => {
    if (screen.classList.contains('hidden') || isWindowOpen()) return;
    document.querySelector('.user-input:not(:disabled)')?.focus();
});

/* ================= POP-UP WINDOW ================= */

const modal    = document.getElementById('modal-backdrop');
const win      = modal.querySelector('.crt-window');
const winBar   = document.getElementById('win-bar');
const winTitle = document.getElementById('win-title');
const winBody  = document.getElementById('win-body');
const winClose = document.getElementById('win-close');

function isWindowOpen() {
    return !modal.classList.contains('hidden');
}

let lastFocus = null;

function setBackgroundInert(value) {
    screen.inert = value;                      // nothing behind is clickable or focusable
    menuScreen.inert = value;
}

function make(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

function renderEducation() {
    const wrap = make('div', 'entries');
    education.forEach(e => {
        const entry = make('div', 'entry');

        const top = make('div', 'entry-row');
        top.append(make('span', 'entry-title', e.school), make('span', 'entry-line'), make('span', 'entry-date', e.period));

        const sub = make('div', 'entry-row entry-sub');
        sub.append(make('span', '', e.location), make('span', 'entry-status', e.status));

        entry.append(top, sub, make('div', 'entry-detail', e.degree));
        wrap.appendChild(entry);
    });
    return wrap;
}

function renderCertifications() {
    const wrap = make('div', 'entries');
    if (!certifications.length) {
        wrap.appendChild(make('p', '', 'No certifications listed yet.'));
        return wrap;
    }
    certifications.forEach(c => {
        const entry = make('div', 'entry');

        const top = make('div', 'entry-row');
        top.append(make('span', 'entry-title', c.name), make('span', 'entry-date', c.date));
        entry.append(top, make('div', 'entry-detail', c.provider));

        if (c.url) {
            const credential = make('div', 'entry-detail', 'Credential: ');
            const link = make('a', '', 'View credential');
            link.href = c.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            credential.appendChild(link);
            entry.appendChild(credential);
        }
        wrap.appendChild(entry);
    });
    return wrap;
}

function openWindow(title, items, options = {}) {
    if (!isWindowOpen()) lastFocus = document.activeElement;   // keep the original opener when switching windows
    winTitle.textContent = title;
    win.classList.toggle('large', Boolean(options.large));
    win.classList.toggle('wide', Boolean(options.wide));

    if (options.render) {
        winBody.replaceChildren(options.render());
    } else {
        const list = document.createElement(options.paragraphs ? 'div' : 'ul');
        items.forEach(item => {
            const el = document.createElement(options.paragraphs ? 'p' : 'li');
            if (typeof item === 'string') {
                el.textContent = item;
            } else {                                   // { label, url } becomes a link
                el.append(`${item.label}: `);
                const a = document.createElement('a');
                a.textContent = item.url.replace(/^https?:\/\//, '');
                a.href = item.url;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                el.appendChild(a);
            }
            list.appendChild(el);
        });
        winBody.replaceChildren(list);
    }

    const footer = options.footer || [];
    winFooter.replaceChildren(...footer.map(b => {
        const btn = make('button', 'menu-btn small', b.label);
        btn.type = 'button';
        btn.addEventListener('click', b.onClick);
        return btn;
    }));
    winFooter.classList.toggle('hidden', footer.length === 0);

    modal.classList.remove('hidden');
    setBackgroundInert(true);

    // center it, then play the CRT turn-on animation
    win.style.left = Math.max(0, (window.innerWidth  - win.offsetWidth)  / 2) + 'px';
    win.style.top  = Math.max(0, (window.innerHeight - win.offsetHeight) / 2) + 'px';
    win.classList.remove('pop');
    void win.offsetWidth;                      // restart the animation
    win.classList.add('pop');

    setTimeout(() => winClose.focus(), 0);     // after the Enter keypress has finished
}

function closeWindow() {
    if (!isWindowOpen()) return;
    modal.classList.add('hidden');
    setBackgroundInert(false);
    if (mode === 'simple') lastFocus?.focus();
    else document.querySelector('.user-input:not(:disabled)')?.focus();
}

winClose.addEventListener('click', closeWindow);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeWindow();
});

// Drag by the title bar (mouse, touch and pen)
let drag = null;

winBar.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.win-close')) return;
    drag = { dx: e.clientX - win.offsetLeft, dy: e.clientY - win.offsetTop };
    winBar.setPointerCapture(e.pointerId);
    winBar.classList.add('dragging');
});

winBar.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const x = Math.min(Math.max(0, e.clientX - drag.dx), window.innerWidth  - win.offsetWidth);
    const y = Math.min(Math.max(0, e.clientY - drag.dy), window.innerHeight - win.offsetHeight);
    win.style.left = x + 'px';
    win.style.top  = y + 'px';
});

['pointerup', 'pointercancel'].forEach(type =>
    winBar.addEventListener(type, () => {
        drag = null;
        winBar.classList.remove('dragging');
    })
);

// keep the window on screen if the browser is resized
window.addEventListener('resize', () => {
    if (!isWindowOpen()) return;
    win.style.left = Math.min(win.offsetLeft, Math.max(0, window.innerWidth  - win.offsetWidth))  + 'px';
    win.style.top  = Math.min(win.offsetTop,  Math.max(0, window.innerHeight - win.offsetHeight)) + 'px';
});

/* ================= TITLE + ADMIN LOGIN ================= */

const ADMIN_USER = 'arwin';
// Generate in the DevTools console:  sha256('yourNewPassword').then(console.log)
const ADMIN_PASS_HASH = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8';
const MAX_TRIES = 3;
let triesLeft = MAX_TRIES;
let lockTimer;
let loginPending = false;
let loginRequest = 0;
const loginSubmit = loginForm.querySelector('button[type="submit"]');

async function sha256(text) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function showView(view) {
    [titleScreen, loginScreen, menuScreen, screen].forEach(v => v.classList.add('hidden'));
    view.classList.remove('hidden');
}

function resetLogin() {
    clearTimeout(lockTimer);
    loginRequest++;
    loginPending = false;
    triesLeft = MAX_TRIES;
    loginForm.reset();
    loginMsg.textContent = '';
    userInput.disabled = passInput.disabled = false;
    loginSubmit.disabled = false;
}

function goToTitle() {
    resetLogin();
    showView(titleScreen);
}

function enterSite(role) {
    resetLogin();                 // clears password from the form
    currentUser = role;
    if (mode === 'simple') {
        showMenu();
        return;
    }
    showView(screen);
    if (!booted) {
        booted = true;
        loading = setInterval(animate, 50);
    }
}

document.getElementById('guest-btn')?.addEventListener('click', () => enterSite('Guest'));

document.getElementById('admin-btn')?.addEventListener('click', () => {
    resetLogin();
    showView(loginScreen);
    userInput.focus();
});

document.getElementById('back-btn').addEventListener('click', goToTitle);

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (userInput.disabled || loginPending) return;

    loginPending = true;
    const request = ++loginRequest;
    const username = userInput.value.trim();
    const password = passInput.value;
    userInput.disabled = passInput.disabled = true;
    loginSubmit.disabled = true;

    try {
        let hash;
        try {
            hash = await sha256(password);
        } catch (error) {
            if (request !== loginRequest || loginScreen.classList.contains('hidden')) return;
            console.error('Admin login verification failed:', error);
            loginMsg.textContent = 'Secure login is unavailable. Please try again in a supported browser.';
            return;
        }

        if (request !== loginRequest || loginScreen.classList.contains('hidden')) return;

        if (username === ADMIN_USER && hash === ADMIN_PASS_HASH) {
            enterSite('Admin');
            return;
        }

        triesLeft--;
        passInput.value = '';

        if (triesLeft <= 0) {
            loginMsg.textContent = 'Access denied. Returning to title screen...';
            lockTimer = setTimeout(goToTitle, 1500);
        } else {
            loginMsg.textContent = `Invalid credentials. ${triesLeft} ${triesLeft === 1 ? 'try' : 'tries'} left.`;
        }
    } finally {
        if (request === loginRequest && !loginScreen.classList.contains('hidden') && triesLeft > 0) {
            loginPending = false;
            userInput.disabled = passInput.disabled = false;
            loginSubmit.disabled = false;
            passInput.focus();
        }
    }
});

/* ================= SIMPLE MODE MENU ================= */

function makeMenuButton(label, onClick) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'menu-btn';
    btn.textContent = label;
    btn.addEventListener('click', onClick);
    return btn;
}

function buildMenu() {
    menuButtons.replaceChildren();
    Object.values(infoWindows).filter(w => w.inMenu !== false).forEach(w => {
        menuButtons.appendChild(makeMenuButton(w.title, () => openWindow(w.title, w.items, w.options)));
    });
    menuButtons.appendChild(makeMenuButton('Log out', goToTitle));
}

/* ================= MENU BANNER (intro ticker, then ambition) ================= */

const bannerTrack  = document.getElementById('intro-track');
const ambitionLine = document.getElementById('ambition-line');
const TICKER_SPEED = 110;          // pixels per second
let bannerTimer, ambitionTyping, bannerDone = true;

function finishBanner() {
    if (bannerDone) return;
    bannerDone = true;
    clearTimeout(bannerTimer);
    bannerTrack.classList.remove('run');
    bannerTrack.classList.add('hidden');
    ambitionLine.textContent = '';
    ambitionLine.classList.remove('hidden');
    ambitionTyping = typeText(ambitionLine, ambitionText, 90);   // slow typing
}

function playMenuBanner() {
    clearTimeout(bannerTimer);
    clearInterval(ambitionTyping);
    ambitionLine.textContent = '';
    ambitionLine.classList.add('hidden');
    bannerTrack.textContent = introTicker;
    bannerTrack.classList.remove('run', 'hidden', 'still');

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {                        // no sliding: show both lines straight away
        bannerDone = true;
        bannerTrack.classList.add('still');
        ambitionLine.textContent = ambitionText;
        ambitionLine.classList.remove('hidden');
        return;
    }

    bannerDone = false;
    const seconds = (window.innerWidth + bannerTrack.offsetWidth) / TICKER_SPEED;
    bannerTrack.style.animationDuration = seconds + 's';
    void bannerTrack.offsetWidth;              // restart the animation
    bannerTrack.classList.add('run');
    bannerTimer = setTimeout(finishBanner, seconds * 1000 + 800);   // safety net
}

bannerTrack.addEventListener('animationend', finishBanner);

function showMenu() {
    menuUser.textContent = `User: ${currentUser}`;
    showView(menuScreen);
    playMenuBanner();
    menuButtons.querySelector('button')?.focus();
}

/* ================= MODE TOGGLE ================= */

const MODE_KEY = 'portfolio-mode';
const MODE_HINTS = {
    simple:   'Tap buttons to explore. No typing needed.',
    terminal: "Type commands like in a shell. Try 'help'."
};

function setMode(next, remember) {
    mode = next;
    modeSimpleBtn.setAttribute('aria-pressed', String(next === 'simple'));
    modeTerminalBtn.setAttribute('aria-pressed', String(next === 'terminal'));
    modeHint.textContent = MODE_HINTS[next];
    if (remember) {
        try { localStorage.setItem(MODE_KEY, next); } catch { /* storage blocked: fine */ }
    }
}

function initialMode() {
    try {
        const saved = localStorage.getItem(MODE_KEY);
        if (saved === 'simple' || saved === 'terminal') return saved;
    } catch { /* ignore */ }
    // First visit: phones and touch screens start in Simple mode
    const small = window.matchMedia && window.matchMedia('(max-width: 700px), (pointer: coarse)').matches;
    return small ? 'simple' : 'terminal';
}

modeSimpleBtn.addEventListener('click',   () => setMode('simple', true));
modeTerminalBtn.addEventListener('click', () => setMode('terminal', true));

buildMenu();
setMode(initialMode(), false);

/* ================= START ON TITLE ================= */
// Don't rely on the HTML classes: always begin with only the title screen showing.
showView(titleScreen);
modal.classList.add('hidden');