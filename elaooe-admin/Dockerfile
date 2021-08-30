FROM node:14 as admin-builder

WORKDIR /app

COPY ./elaooe-admin/package.json .

RUN npm install

COPY ./elaooe-admin/ .

CMD ["npm", "run", "build"]
