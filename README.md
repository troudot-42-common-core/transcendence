# Transcendence

### Install
```zsh
git clone git@github.com:0x21x/ft_transcendence.git
```
### Dependencies
Be sure to have [node.js](https://nodejs.org/en/download/package-manager) before trying somes commands, npm is automatically installed with node.js 
```zsh
npm install
```
### Run
```zsh
npm run dev
```

## Project Structure

```zsh
├── README.md
├── backend
├── frontend
│   ├── components
│   │   ├── body
│   │   │   ├── about.mjs
│   │   │   ├── history.mjs
│   │   │   └── home.mjs
│   │   └── header
│   ├── index.html
│   ├── languages
│   │   ├── en
│   │   │   ├── about.json
│   │   │   ├── history.json
│   │   │   ├── home.json
│   │   │   └── navbar.json
│   │   └── fr
│   │       ├── about.json
│   │       ├── history.json
│   │       ├── home.json
│   │       └── navbar.json
│   └── static
│       └── js
│           ├── game.js
│           ├── language.mjs
│           ├── render.mjs
│           ├── router.js
│           ├── routes.mjs
│           └── theme.mjs
├── package-lock.json
├── package.json
└── server.js
```

## Pong - How to play

Player 1 (left):
- [W] -> GO UP
- [S] -> GO DOWN

Player 2 (right):
- [ARROW UP] -> GO UP
- [ARROW DOWN] -> GO DOWN