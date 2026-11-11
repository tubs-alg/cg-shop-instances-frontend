FROM node:22-alpine

WORKDIR /app

# Create app directory
COPY package.json package-lock.json jsconfig.json eslint.config.js vite.config.js index.html /app/
COPY ./src /app/src
COPY ./public /app/public

COPY .env.production .env /app/

RUN npm ci
CMD ["npm", "run", "build"]
