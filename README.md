<div align="center">

```
 ____         _    ____ ____ _____ ____ ____
|  _ \       / \  / ___/ ___| ____/ ___/ ___|
| |_) |____ / _ \| |  | |   |  _| \___ \___ \
|  __/_____/ ___ \ |__| |___| |___ ___) |__) |
|_|       /_/   \_\____\____|_____|____/____/

 _____ _____ ____  __  __ ___ _   _    _    _
|_   _| ____|  _ \|  \/  |_ _| \ | |  / \  | |
  | | |  _| | |_) | |\/| || ||  \| | / _ \ | |
  | | | |___|  _ <| |  | || || |\  |/ ___ \| |___
  |_| |_____|_| \_\_|  |_|___|_| \_/_/   \_\_____|
```

**A retro CRT-monitor portfolio. Type commands, or just tap buttons.**

![HTML5](https://img.shields.io/badge/HTML5-000000?style=flat-square&logo=html5&logoColor=39ff14)
![CSS3](https://img.shields.io/badge/CSS3-000000?style=flat-square&logo=css3&logoColor=39ff14)
![JavaScript](https://img.shields.io/badge/JavaScript-000000?style=flat-square&logo=javascript&logoColor=39ff14)
![Dependencies](https://img.shields.io/badge/dependencies-none-000000?style=flat-square&labelColor=000000&color=39ff14)
![GitHub Pages](https://img.shields.io/badge/hosted_on-GitHub_Pages-000000?style=flat-square&logo=github&logoColor=39ff14)

[**>> LAUNCH THE LIVE SITE <<**](https://arwin-j.github.io/YOUR-REPO/)

</div>

---

```
> Initializing profile load......
> Loaded successfully...
> Welcome esteemed guest User..... Hope you are doing well!
```

## [ 01 ] OVERVIEW

This is my personal portfolio, styled as an old green-phosphor terminal. It is a
**static site** (plain HTML, CSS and JavaScript). There is no framework, no build
step, no backend and no database, so it runs for free on GitHub Pages.

Visitors choose how they want to explore:

| Mode         | Who it is for                    | What it feels like                                  |
| ------------ | -------------------------------- | --------------------------------------------------- |
| **Terminal** | People comfortable with a shell  | A boot-up animation, then a prompt where you type commands |
| **Simple**   | Everyone else (default on phones) | A menu of buttons, with a scrolling intro and no typing |

The toggle sits at the top of the welcome screen, and the choice is remembered
on that device.

<!--
SCREENSHOTS: add one or two images to a /docs folder, then uncomment:

![Welcome screen](docs/welcome.png)
![Projects window](docs/projects.png)
-->

## [ 02 ] FEATURES

```
[ OK ] Welcome screen with a flickering CRT "twitch" effect
[ OK ] Two modes: Terminal (commands) and Simple (buttons)
[ OK ] Boot sequence with progress bar  -  skip with Space x2 or a double-tap
[ OK ] CRT-style pop-up windows: draggable, closable, turn-on animation
[ OK ] Tabs inside windows (Experiences / Skills / one tab per project)
[ OK ] Scrolling intro line + slow-typed ambition line (Simple mode)
[ OK ] "Connect with me" links as ASCII icons
[ OK ] Phone-friendly layout
[ OK ] Optional client-side admin login (3 tries)
```

### Pop-up windows

Every section opens in the same retro window:

- Plays a short CRT "turn-on" animation when it opens
- Drag it by the title bar, close it with the **x** button or the **Esc** key
- The page behind is dimmed and locked until the window is closed
- Tabs can sit in the title bar (Experiences / Skills) or in a strip under it (Projects)
- The Education window has a **Certifications** button at the bottom that swaps to the certificates

### Simple mode

After pressing **Guest**, the menu page:

1. Slides a one-line introduction across the top, right to left
2. Slowly types out an ambition line once the introduction has passed
3. Shows a button for each section (Profile, Skills, Projects, Experiences, Education)
4. Ends with a **Connect with me** footer of ASCII icons (LinkedIn, GitHub, YouTube, Instagram, Gmail)

### Terminal mode

After the boot sequence, a **Connect with me** window pops up and the prompt appears.

```
profile@terminal: ~$ help
```

| Command                      | What it does                                   |
| ---------------------------- | ---------------------------------------------- |
| `help`                       | Lists every command                            |
| `profile`                    | Opens the profile window (with GitHub and LinkedIn links) |
| `skills`                     | Opens the skills window, grouped by category   |
| `intro`                      | Opens the large introduction window            |
| `projects` / `project`       | Opens the projects window, one tab per project |
| `experience` / `exp`         | Opens the experiences window (Experiences and Skills tabs) |
| `education` / `edu`          | Opens the education window                     |
| `certifications` / `certs`   | Opens the certifications window                |
| `connect` / `contact` / `social` | Opens the "Connect with me" window         |
| `clear`                      | Clears the terminal                            |
| `exit`                       | Returns to the welcome screen                  |

A leading slash works too, for example `/projects`. Commands are not case sensitive.

**Skip the boot:** press **Space twice** (desktop) or **double-tap** (phone) while it is loading.

## [ 03 ] PROJECT STRUCTURE

```
.
├── index.html    page structure: welcome, login, menu, terminal, pop-up window
├── index.css     CRT look: glow, scanlines, animations, layouts, phone styles
└── index.js      all behavior and all of the content (see below)
```

No packages to install and nothing to compile.

## [ 04 ] RUN IT LOCALLY

The site is static, but it should be served over `http://localhost` rather than opened
as a `file://` page, because the optional admin login uses the browser's `crypto`
features, which need a secure context.

```bash
# from the project folder, pick one:
python3 -m http.server 8000      # then open http://localhost:8000
npx serve                        # or: use the VS Code "Live Server" extension
```

## [ 05 ] DEPLOY TO GITHUB PAGES

1. Push `index.html`, `index.css` and `index.js` to the repository root.
2. Go to **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, then your main branch and the `/ (root)` folder.
4. Wait a minute or two. Your site appears at `https://YOUR-USERNAME.github.io/YOUR-REPO/`.

Things that commonly go wrong:

- **File names are case sensitive** on GitHub Pages. `index.css` and `Index.css` are different files.
- **A broken or unstyled page** usually means the CSS file did not load, or an old copy is cached. Hard refresh with `Ctrl+Shift+R` (`Cmd+Shift+R` on a Mac).

## [ 06 ] CUSTOMIZE IT

All of the content is stored as plain data at the top of `index.js`. You do not need to
touch any layout code to update the site.

| To change...               | Edit this in `index.js`                         |
| -------------------------- | ----------------------------------------------- |
| Profile window lines and links | `profileInfo`                               |
| Skills (by category)       | `skills`                                        |
| Sliding intro line (Simple mode) | `introTicker`                             |
| Slowly typed ambition line | `ambitionText`                                  |
| Big introduction window    | `introParagraphs`                               |
| Jobs                       | `experiences`                                   |
| Schools                    | `education`                                     |
| Certificates               | `certifications`                                |
| Projects (tabs, art, links)| `projects`                                      |
| Social icons and links     | `socials`                                       |
| Command list text          | `helpInfo`                                      |

### Add a new window or command

Windows are registered in one list called `infoWindows`. Each entry becomes both a
terminal command and a Simple-mode menu button:

```js
const infoWindows = {
    skills: { title: 'Skills', items: [], options: { wide: true, render: renderSkills } },
    // add more here
};
```

Useful options on an entry:

| Option                    | Effect                                                      |
| ------------------------- | ----------------------------------------------------------- |
| `aliases: ['edu']`        | Extra command names for the same window                     |
| `inMenu: false`           | Hide it from the Simple-mode buttons (command still works)  |
| `options.wide / large / big` | Window size presets                                      |
| `options.tabs`            | Tabs inside the window (`tabsBelow: true` puts them under the title bar) |
| `options.footer`          | Buttons along the bottom of the window                      |

### Colors and fonts

The palette and font are CSS variables at the top of `index.css`:

```css
:root {
  --terminal-font: 'Courier New', Courier, monospace;
  --green: #39ff14;
  --green-dim: #00ff00;
}
```

Swap the greens for amber (`#ffb000`) for a different phosphor color.

### Projects with ASCII art and downloads

Each project can have an ASCII drawing, a short description, resume-style bullet points,
a one-line skills list and links. Keep the drawing inside `String.raw` so slashes and
backslashes are kept as typed. For files you host in this repo, add `download: true`:

```js
{ label: 'Download', url: 'downloads/my-app.zip', download: true }
```

## [ 07 ] ADMIN LOGIN (OPTIONAL)

The code includes a small Guest / Admin flow: an Admin button opens a **LOGIN / PASSWORD**
box, allows **3 tries**, then returns to the welcome screen. The button is currently
commented out in `index.html`.

> **This is a UI gate, not security.** Everything runs in the visitor's browser, so
> anyone can read the check in DevTools. Never reuse a real password here, and do not
> store anything private behind it. If you turn it on, generate your own hash in the
> browser console with `sha256('yourPassword').then(console.log)` and replace the stored one.

## [ 08 ] ACCESSIBILITY

- Keyboard friendly: `Esc` closes windows, arrow keys switch tabs, buttons show a focus style
- While a window is open, the page behind it cannot be clicked or tabbed to
- Visitors who prefer reduced motion do not get the flicker, sliding or turn-on animations
- The sliding intro is also available as a full, readable window

## [ 09 ] KNOWN LIMITS

- GitHub Pages only serves static files, so there is no server-side login or database
- Custom mouse cursors only apply on devices that have a mouse
- A real CRT look (curvature, true scanlines) is approximated with CSS only

## [ 10 ] CONTACT

Find the links on the live site under **Connect with me**, or in the `socials` list.

---

<div align="center">

```
> End of file.  Thanks for visiting.
> _
```

</div>
