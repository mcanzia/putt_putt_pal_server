FROM node:16-alpine
WORKDIR /app
COPY putt_putt_pal_server/package*.json ./
RUN npm install
COPY putt_putt_pal_server ./
RUN npm run build
RUN npm prune --production
EXPOSE 7500

CMD ["node", "dist/app.js"]
