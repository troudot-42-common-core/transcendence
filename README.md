# Transcendence

### Install
```zsh
git clone git@github.com:0x21x/ft_transcendence.git
```

### Run

### @ Development
```zsh
docker-compose --file docker-compose-dev.yml up --build --watch
```
### @ Production
```zsh
docker-compose up --build
```

### Stop
```zsh
docker-compose down
```

## Project Structure

```zsh
├── README.md
├── .env
├── docker-compose.yml
├── docker-compose-dev.yml
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
│       ├── entrypoint.sh
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
└── frontend
    ├── Dockerfile
    ├── app
    │   ├── components
    │   │   ├── body
    │   │   │   ├── history.mjs
    │   │   │   ├── home.mjs
    │   │   │   ├── touramentComponents
    │   │   │   │   ├── createTournament.mjs
    │   │   │   │   └── setPlayersNames.mjs
    │   │   │   └── tournament.mjs
    │   │   └── header
    │   ├── index.html
    │   ├── languages
    │   │   ├── en
    │   │   │   ├── history.json
    │   │   │   ├── home.json
    │   │   │   ├── navbar.json
    │   │   │   └── tournament.json
    │   │   └── fr
    │   │       ├── history.json
    │   │       ├── home.json
    │   │       ├── navbar.json
    │   │       └── tournament.json
    │   ├── server.js
    │   └── static
    │       └── js
    │           ├── bot.js
    │           ├── game.js
    │           ├── language.mjs
    │           ├── render.mjs
    │           ├── router.js
    │           ├── routes.mjs
    │           ├── theme.mjs
    │           └── tournament.js
    └── package.json

```

## Pong - How to play

Player 1 (left):
- [W] -> GO UP
- [S] -> GO DOWN

Player 2 (right):
- [ARROW UP] -> GO UP
- [ARROW DOWN] -> GO DOWN