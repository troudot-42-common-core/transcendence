FROM node:22-alpine3.20 as build

RUN mkdir -p /node
WORKDIR /node

ADD package.json /node/package.json
ADD package-lock.json /node/package-lock.json
RUN npm ci


FROM node:22-alpine3.20 as runtime

RUN apk add --no-cache curl

# Create app directory
RUN mkdir -p /app
ADD app /app
WORKDIR /app

COPY --from=build /node/. /app/.

# UnRoot User
RUN addgroup -S app && adduser -S app -G app
RUN chown -R app:app /app
USER app

ENTRYPOINT ["npm", "run", "dev"]