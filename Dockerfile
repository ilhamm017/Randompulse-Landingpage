FROM node:20-bullseye

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY server ./server

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "server/server.js"]
