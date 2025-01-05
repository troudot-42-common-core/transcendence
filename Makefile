build:
	@-mkdir -p frontend/certs
	@if [ ! -f frontend/certs/privateKey.key ] || [ ! -f frontend/certs/certificate.crt ]; then \
		echo "Generating new certificates..."; \
		openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout frontend/certs/privateKey.key -out frontend/certs/certificate.crt -config frontend/openssl.cnf; \
	else \
		echo "Certificates already exist, skipping generation."; \
	fi
	@-docker compose build

up: build
	@-docker compose up -d

down:
	@-docker compose down

logs:
	@-docker compose logs -f

clean:
	@-docker compose down --rmi all --volumes
	@-rm -rf frontend/certs

.PHONY: build up down clean
