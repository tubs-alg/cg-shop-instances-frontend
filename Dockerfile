FROM node:22-alpine

WORKDIR /app

# Create app directory
COPY package.json package-lock.json jsconfig.json .eslintrc.js vue.config.js babel.config.js .browserslistrc /app/
COPY ./src /app/src
COPY ./public /app/public

COPY .env.production .env /app/

RUN npm install
CMD ["npm", "run", "build"]