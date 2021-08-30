FROM node:14

WORKDIR /app

COPY ./elaooe-service/package.json .

RUN npm install

COPY ./elaooe-service/ .

EXPOSE 3001

CMD ["npm", "start"]
