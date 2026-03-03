const terminal = document.getElementById('terminal');
const screen = document.querySelector('.screen');

let percent = document.querySelector('.percent');
let progress = document.querySelector('.progress');
const progressbar = document.querySelector('.progress-bar');
let count = 4;
let per = 16;
let loading = setInterval(animate, 50);

// Terminal messages with delays
const bootSequence = [
    { text: 'Initializing profile load......', delay: 30 },
    { text: 'Loaded successfully...', delay: 30 },
    { text: 'Welcome esteemed guest User..... Hope you are doing well!', delay: 60 },
];

const systemInfo = [
    'Portfolio Access: Success',
    'User: Guest',
    'Welcome to P-Access Terminal',
    'Enter system commands',
    `Need help? Type 'help'`
];

const helpInfo = [
    'help - displays all commands with instructions',
    'profile - displays profile information',
    'skills - opens a separate skills window',
    'clear - clears terminal'
];

let currentLine = 0;
let currentChar = 0;

// Create a new line element
function createLine() {
    const line = document.createElement('div');
    line.className = 'line';
    terminal.appendChild(line);
    return line;
}

//Progress bar animation
function animate() {
    if (count == 100 && per == 400) {
        clearInterval(loading);
        percent.style.display = 'none';
        progress.style.display = 'none';
        progressbar.style.display = 'none';
        setTimeout(bootTerminal, 500);

    }
    else {
        per = per + 8;
        count = count + 2;
        progress.style.width = per + 'px';

    }
}

// Type out text character by character
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

// Process boot sequence
function bootTerminal() {
    if (currentLine < bootSequence.length) {
        const line = createLine();
        const { text, delay } = bootSequence[currentLine];

        typeText(line, text, delay, () => {
            currentLine++;
            setTimeout(bootTerminal, 200); // Pause between lines
        });
    } else {
        // Boot sequence complete

        setTimeout(() => {
            // screen.classList.remove('boot');

            clearTerminal();
            printStatic(systemInfo);


            const blank = createLine();
            blank.innerHTML = '&nbsp';
            showPrompt();
        }, 500);
    }
}

function printStatic(lines) {
    lines.forEach(text => {
        const line = createLine();
        line.textContent = text;
    });
}

function clearTerminal() {
    terminal.innerHTML = '';
}

// Show the command prompt
function showPrompt() {
    const blankLine = createLine();
    blankLine.innerHTML = '&nbsp;';

    const promptLine = createLine();
    promptLine.className = 'line prompt active';
    promptLine.innerHTML = 'profile@terminal: ~$ <span class="cursor"></span>';

    // Make it interactive
    setupInput(promptLine);
}

// Setup interactive input
function setupInput(promptLine) {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'user-input';

    // Replace cursor with input field
    const cursor = promptLine.querySelector('.cursor');
    cursor.replaceWith(input);

    input.focus();

    // Handle enter key
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const command = input.value.trim();

            if (command) {
                const normalizedCommand = command.toLowerCase();

                switch (normalizedCommand) {
                    case 'help':
                        displayHelp();
                        break;
                    case 'clear':
                        clearTerminal();
                        break;
                    case 'skills':
                        openSkillsWindow();
                        break;
                    default:
                        alert('wrong command');
                }

                showPrompt();
            }
        }
    });
}

function displayHelp() {
    printStatic(helpInfo);
}

function openSkillsWindow() {
    const skillsWindow = window.open('', '_blank', 'width=500,height=400');

    if (!skillsWindow) {
        alert('Popup blocked. Please allow popups and try again.');
        return;
    }

    skillsWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Skills</title>
            <style>
                body {
                    margin: 0;
                    padding: 24px;
                    background: #000;
                    color: #00ff00;
                    font-family: 'Courier New', monospace;
                }

                h1 {
                    margin-bottom: 16px;
                    text-shadow: 0 0 8px #00ff00;
                }

                ul {
                    margin: 0;
                    padding-left: 22px;
                }

                li {
                    margin-bottom: 8px;
                }
            </style>
        </head>
        <body>
            <h1>Skills</h1>
            <ul>
                <li>Java</li>
                <li>C</li>
                <li>HTML</li>
                <li>CSS</li>
                <li>JavaScript</li>
            </ul>
        </body>
        </html>
    `);
    skillsWindow.document.close();
}

// Start boot sequence on page load
window.addEventListener('load', () => {
    setTimeout(animate, 500);
});
