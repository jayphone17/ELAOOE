import { Context } from 'koa';

export async function fileUploadAction(context: Context) {
  const filePath: string = (context.request.files.file as any).path;
  const fileName: string = filePath.split('/').pop();

  context.body = {
    data: fileName,
  };
}
