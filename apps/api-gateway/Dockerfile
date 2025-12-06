FROM node:22

WORKDIR /usr/src/

COPY . .

RUN npm install

RUN npm run build:gateway

WORKDIR /usr/src/

EXPOSE 5000

CMD ["node", "dist/apps/api-gateway/apps/api-gateway/src/main.js"]