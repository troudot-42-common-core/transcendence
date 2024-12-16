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
- [x] User and Game Stats Dashboards 
- [x] ELK Stack for Logging and Monitoring

### Install
```zsh
git clone git@github.com:0x21x/ft_transcendence.git
```

### Environment Setup
1. Copy the `.env.example` file to `.env`:
   ```
   cp .env.example .env
   ```
2. Edit the `.env` file and fill in all the required variables, including the ELK stack variables:
   - `ELASTICSEARCH_PORT`
   - `LOGSTASH_PORT`
   - `KIBANA_PORT` (This should be different from 5601, e.g., 5602)

### Generate required certificates
```zsh
mkdir -p frontend/certs

openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout ./frontend/certs/privateKey.key -out ./frontend/certs/certificate.crt
```

### Run

#### Development
```zsh
docker-compose --file docker-compose-dev.yml up --build --watch
```
#### Production
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

## ELK Stack Integration

This project includes an ELK (Elasticsearch, Logstash, Kibana) stack for centralized logging and monitoring.

### Accessing Kibana

Once the project is running, you can access Kibana through a dedicated Nginx server:

1. Open your web browser and go to `https://localhost:{PUBLIC_KIBANA_PORT}`
   - Replace `{PUBLIC_KIBANA_PORT}` with the port number you specified in your .env file (e.g., 4444)

2. After logging in, you'll be in the Kibana dashboard. To set up your index pattern:
   - Go to "Management" > "Stack Management" > "Index Patterns" in the left sidebar
   - Create an index pattern for `ft_transcendence-*`
   - Select "@timestamp" as the Time field
   - Click "Create index pattern"

3. Go to the "Discover" page to search and visualize logs from your application

### Log Types

The ELK stack is configured to collect and index the following types of logs:

- Django application logs
- Nginx access logs
- System logs from Docker containers

### Customizing Logging

To modify what gets logged or how it's processed:

1. Edit `logstash/pipeline/logstash.conf` to change Logstash filters or outputs
2. Modify `backend/app/app/settings.py` LOGGING configuration to adjust Django logging

## Authentication

The application uses JWT (JSON Web Tokens) for authentication. Here's a brief overview of the authentication flow:

1. User logs in with their credentials
2. Backend validates the credentials and issues a JWT token
3. Frontend stores the JWT token (cookie http-only)
4. For subsequent requests, the frontend includes the JWT token in the Authorization header
5. Backend verifies the JWT token for protected routes
6. The frontend handle the refreshing of tokens if needed
