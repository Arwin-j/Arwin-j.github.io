const terminal = document.getElementById('terminal');
const screen = document.querySelector('.screen');

// Terminal messages with delays
const bootSequence = [
    { text: 'Initializing terminal......', delay: 50 },
    { text: 'Initializing profile load......', delay: 50 },
    { text: 'Loaded successfully...', delay: 50 },
    { text: 'Welcome guest User..... Hope you are doing well!', delay: 40 },
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
            setTimeout(bootTerminal, 300); // Pause between lines
        });
    } else {
        // Boot sequence complete
        setTimeout(() => {
            screen.classList.remove('boot'); // Stop flicker
            showPrompt();
        }, 500);
    }
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
                // Display the command that was entered
                promptLine.innerHTML = `profile@terminal: ~$ ${command}`;

                // Create response
                const response = createLine();
                response.textContent = `Command "${command}" executed. (Add your command logic here!)`;

                // Create new prompt
                showPrompt();
            }
        }
    });
}

// Start boot sequence on page load
window.addEventListener('load', () => {
    setTimeout(bootTerminal, 500);
});