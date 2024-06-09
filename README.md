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
│   ├── Dockerfile
│   └── app
│       ├── app
│       │   ├── __init__.py
│       │   ├── asgi.py
│       │   ├── routing.py
│       │   ├── settings.py
│       │   ├── urls.py
│       │   └── wsgi.py
│       ├── db.sqlite3
│       ├── game
│       │   ├── __init__.py
│       │   ├── admin.py
│       │   ├── apps.py
│       │   ├── models.py
│       │   ├── tests.py
│       │   └── views.py
│       ├── manage.py
│       ├── requirements.txt
│       ├── templates
│       └── users
│           ├── __init__.py
│           ├── admin.py
│           ├── apps.py
│           ├── models.py
│           ├── serlializers.py
│           ├── tests.py
│           ├── urls.py
│           └── views.py
├── docker-compose.yml
└── frontend
    ├── Dockerfile
    ├── components
    │   ├── body
    │   │   ├── history.mjs
    │   │   ├── home.mjs
    │   │   ├── touramentComponents
    │   │   │   ├── createTournament.mjs
    │   │   │   └── setPlayersNames.mjs
    │   │   └── tournament.mjs
    │   └── header
    ├── index.html
    ├── languages
    │   ├── en
    │   │   ├── history.json
    │   │   ├── home.json
    │   │   ├── navbar.json
    │   │   └── tournament.json
    │   └── fr
    │       ├── history.json
    │       ├── home.json
    │       ├── navbar.json
    │       └── tournament.json
    ├── package.json
    ├── server.js
    └── static
        └── js
            ├── bot.js
            ├── game.js
            ├── language.mjs
            ├── render.mjs
            ├── router.js
            ├── routes.mjs
            ├── theme.mjs
            └── tournament.js

```

## Pong - How to play

Player 1 (left):
- [W] -> GO UP
- [S] -> GO DOWN

Player 2 (right):
- [ARROW UP] -> GO UP
- [ARROW DOWN] -> GO DOWN