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

let count = 4;
let per = 16;
let loading;
let currentUser = 'Guest';
let booted = false;
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

const helpInfo = [
    'help - displays all commands with instructions',
    'profile - opens the profile window',
    'skills - opens the skills window',
    'clear - clears terminal'
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

const commands = {
    help:    () => printStatic(helpInfo),
    clear:   clearTerminal,
    profile: () => openWindow('Profile', profileInfo),
    skills:  openSkillsWindow,
};

function runCommand(raw) {
    const key = raw.toLowerCase();
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

function openWindow(title, items) {
    winTitle.textContent = title;

    const list = document.createElement('ul');
    items.forEach(item => {
        const li = document.createElement('li');
        if (typeof item === 'string') {
            li.textContent = item;
        } else {                                   // { label, url } becomes a link
            li.append(`${item.label}: `);
            const a = document.createElement('a');
            a.textContent = item.url.replace(/^https?:\/\//, '');
            a.href = item.url;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            li.appendChild(a);
        }
        list.appendChild(li);
    });
    winBody.replaceChildren(list);

    modal.classList.remove('hidden');
    screen.inert = true;                       // nothing behind is clickable or focusable

    // center it, then play the CRT turn-on animation
    win.style.left = Math.max(0, (window.innerWidth  - win.offsetWidth)  / 2) + 'px';
    win.style.top  = Math.max(0, (window.innerHeight - win.offsetHeight) / 2) + 'px';
    win.classList.remove('pop');
    void win.offsetWidth;                      // restart the animation
    win.classList.add('pop');

    setTimeout(() => winClose.focus(), 0);   // after the Enter keypress has finished
}

function closeWindow() {
    if (!isWindowOpen()) return;
    modal.classList.add('hidden');
    screen.inert = false;
    document.querySelector('.user-input:not(:disabled)')?.focus();
}

function openSkillsWindow() {
    openWindow('Skills', skills);
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

async function sha256(text) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function showView(view) {
    [titleScreen, loginScreen, screen].forEach(v => v.classList.add('hidden'));
    view.classList.remove('hidden');
}

function resetLogin() {
    clearTimeout(lockTimer);
    triesLeft = MAX_TRIES;
    loginForm.reset();
    loginMsg.textContent = '';
    userInput.disabled = passInput.disabled = false;
}

function goToTitle() {
    resetLogin();
    showView(titleScreen);
}

function enterTerminal(role) {
    resetLogin();                 // clears password from the form
    currentUser = role;
    showView(screen);
    if (!booted) {
        booted = true;
        loading = setInterval(animate, 50);
    }
}

document.getElementById('guest-btn').addEventListener('click', () => enterTerminal('Guest'));

document.getElementById('admin-btn').addEventListener('click', () => {
    resetLogin();
    showView(loginScreen);
    userInput.focus();
});

document.getElementById('back-btn').addEventListener('click', goToTitle);

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (userInput.disabled) return;   // locked out, waiting to return

    const hash = await sha256(passInput.value);
    if (loginScreen.classList.contains('hidden')) return;   // user left during the check

    if (userInput.value.trim() === ADMIN_USER && hash === ADMIN_PASS_HASH) {
        enterTerminal('Admin');
        return;
    }

    triesLeft--;
    passInput.value = '';

    if (triesLeft <= 0) {
        loginMsg.textContent = 'Access denied. Returning to title screen...';
        userInput.disabled = passInput.disabled = true;
        lockTimer = setTimeout(goToTitle, 1500);
    } else {
        loginMsg.textContent = `Invalid credentials. ${triesLeft} ${triesLeft === 1 ? 'try' : 'tries'} left.`;
        passInput.focus();
    }
});