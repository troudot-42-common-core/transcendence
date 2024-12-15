# Transcendence

### Modules

- [x] Frontend Framework
- [x] Backend Framework
- [x] User Gestion
- [x] 42 Oauth
- [x] 2FA & JWT Tokens
- [x] PostgreSQL DB 
- [x] Remote players
- [x] Game server side
- [x] Blockchain
- [x] Multi-languages
- [x] Multi-platforms

### Install
```zsh
git clone git@github.com:0x21x/ft_transcendence.git
```

### Run

#### Generate required certificates
```zsh
mkdir -p frontend/certs

openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout ./frontend/certs/privateKey.key -out ./frontend/certs/certificate.crt
```

### # Development
```zsh
docker-compose --file docker-compose-dev.yml up --build --watch
```
### # Production
```zsh
docker-compose up --build
```

### Stop
```zsh
docker-compose down
```

## Pong - How to play
- [A] -> GO UP
- [D] -> GO DOWN
<details><summary> 💡</summary>
These commands can be edited at 'frontend/app/components/game.js' line 80.
</details>
