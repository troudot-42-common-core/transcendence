FROM python:3.12.4-alpine3.20 as build

RUN apk update && apk upgrade && apk add --no-cache \
    libffi-dev                                       \
    gcc                                             \
    musl-dev                                        \
    make                                            \
    curl

# Create app directory
RUN mkdir -p /app
ADD app /app

# UnRoot User
RUN addgroup -S app && adduser -S app -G app
RUN chown -R app:app /app
USER app

WORKDIR /app

RUN pip install -r requirements.txt --no-cache-dir

EXPOSE $PORT

FROM build as dev
VOLUME /app
CMD ["python", "manage.py", "runserver"]

FROM build as prod
CMD ["python", "manage.py", "runserver"]

