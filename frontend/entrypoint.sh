#!/bin/sh

# Create SSL directory if it doesn't exist
mkdir -p /etc/nginx/ssl

# Generate SSL certificate and private key
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/privateKey.key \
    -out /etc/nginx/ssl/certificate.crt \
    -subj '/C=FR/ST=Alsace/L=Mulhouse/O=42/CN=localhost'

# Replace environment variables and move nginx config
envsubst '${API_PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/conf.d/default.conf

# Start nginx
exec nginx -g 'daemon off;'
