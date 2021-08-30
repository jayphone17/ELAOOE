import { Context } from 'koa';
import * as send from 'koa-send';

export async function fileDownloadAction(context: Context) {
  const { filename } = context.request.query;
  const filePath: string = `uploads/${filename}`;
  context.attachment(filePath);
  await send(context, filePath);
}
