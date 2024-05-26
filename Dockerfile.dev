FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm prune --production
EXPOSE 7500

CMD ["node", "dist/app.js"]
