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
node server.js
```

## Project Structure

```zsh
├── README.md
├── backend
├── frontend
│   ├── components
│   │   ├── body
│   │   │   ├── about.mjs
│   │   │   ├── contact.mjs
│   │   │   └── home.mjs
│   │   └── header
│   ├── index.html
│   ├── languages
│   │   ├── en
│   │   │   ├── about.json
│   │   │   ├── contact.json
│   │   │   ├── home.json
│   │   │   └── navbar.json
│   │   └── fr
│   │       ├── about.json
│   │       ├── contact.json
│   │       ├── home.json
│   │       └── navbar.json
│   └── static
│       └── js
│           ├── language.mjs
│           ├── render.mjs
│           ├── router.js
│           ├── routes.mjs
│           └── theme.mjs
├── package-lock.json
├── package.json
└── server.js
```