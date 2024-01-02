FROM node:20-alpine3.19

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENV URL_DEPENDENCY=
ENV DRINK1=
ENV DESSERT1=
ENV DRINK2=
ENV DESSERT2=

CMD [ "node", "dependent-server.js" ]


# docker build -t dependent .
