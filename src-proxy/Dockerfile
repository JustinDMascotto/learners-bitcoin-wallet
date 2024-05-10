FROM node:20.11.0

EXPOSE 3001

WORKDIR /usr/src/app

COPY app.js /usr/src/app/

COPY package.json /usr/src/app/

COPY package-lock.json /usr/src/app/

RUN npm install

ENV ELECTRS_HOST=electrs:50001

CMD ["node", "app.js"]