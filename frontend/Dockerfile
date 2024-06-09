FROM node:22-alpine3.19 as build

# Create app directory
RUN mkdir -p /app
ADD . /app

# UnRoot User
RUN addgroup -S app && adduser -S app -G app
RUN chown -R app:app /app
USER app

WORKDIR /app

RUN npm install

FROM build as dev
VOLUME /app
CMD ["npm", "run", "dev"]

FROM build as prod
CMD ["npm", "run", "prod"]