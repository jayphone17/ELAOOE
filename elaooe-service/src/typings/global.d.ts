import { Context } from 'koa';

declare module 'koa' {
  interface Context {
    state: {
      user: {
        role: string;
        id: string;
      };
    };
  }
}
