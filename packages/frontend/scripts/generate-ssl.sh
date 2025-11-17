#!/bin/bash
# Gera certificados SSL autoassinados para uso local
set -e
mkdir -p ../certs
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ../certs/localhost.key \
  -out ../certs/localhost.crt \
  -subj "/C=BR/ST=SP/L=Localhost/O=Dev/OU=Dev/CN=localhost"
echo "Certificados gerados em packages/frontend/certs/"
