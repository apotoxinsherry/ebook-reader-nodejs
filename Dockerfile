FROM node:current-alpine3.16

COPY . /code

WORKDIR /code

RUN npm install

EXPOSE 3000
VOLUME [ "/books" ]

ENV DOCKER=1

ENTRYPOINT [ "node" "app.js" ]
