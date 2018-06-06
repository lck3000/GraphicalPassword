FROM node:8-alpine

COPY . /app
WORKDIR /app

RUN npm install --production

CMD [ "npm", "start" ]