FROM node:22

WORKDIR /usr/src/

COPY . .

RUN npm install

RUN npm run build:core

WORKDIR /usr/src/

EXPOSE 5001

CMD ["node", "dist/apps/core-service/apps/core-service/src/main.js"]