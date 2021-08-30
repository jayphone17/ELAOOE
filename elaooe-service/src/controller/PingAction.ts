import { Context } from 'node:vm';

export async function pingAction(context: Context) {
  context.body = 'pong';
}
