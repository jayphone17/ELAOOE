import { createConnection } from 'typeorm';
import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as koaBody from 'koa-body';
import { nanoid } from 'nanoid';
import * as cors from 'koa2-cors';
import { AppRoutes } from './routes';
import jwt = require('koa-jwt');
import { SECRECT } from './config';

// create connection with database
// note that its not active database connection
// TypeORM creates you connection pull to uses connections from pull on your requests
createConnection()
  .then(async (connection) => {
    // create koa app
    const app = new Koa();
    const router = new Router();

    // register all application routes
    AppRoutes.forEach((route) =>
      router[route.method](route.path, route.action)
    );

    app.use(cors());

    // run app
    app.use(
      koaBody({
        formidable: {
          onFileBegin: (name, file) => {
            file.path = `${process.cwd()}/uploads/${nanoid()}.${file.name}`;
          },
        },
        multipart: true,
        urlencoded: true,
      })
    );
    app.use(jwt({ secret: SECRECT }).unless({ path: [/login/, /file/] }));
    app.use(router.routes());
    app.use(router.allowedMethods());
    app.listen(3001);

    console.log('Koa application is up and running on port 3001');
  })
  .catch((error) => console.log('TypeORM connection error: ', error));
