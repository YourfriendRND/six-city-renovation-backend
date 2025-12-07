FROM node:22

WORKDIR /usr/src/

COPY . .

RUN npm install

RUN npm run build:storage

WORKDIR /usr/src/

EXPOSE 5002

CMD ["node", "dist/apps/storage-service/apps/storage-service/src/main.js"]