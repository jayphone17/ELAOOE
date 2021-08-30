import { Context } from 'koa';
import { getManager } from 'typeorm';
import { Notice } from '../../entity/Notice';
import { genResponse } from '../../utils';

export async function deleteNotice(context: Context) {
  const { id } = context.request.query as { id: string };

  const noticeRepository = getManager().getRepository(Notice);

  const curNotice = await noticeRepository.findOne(id);
  await noticeRepository.remove(curNotice);

  context.body = genResponse(true);
}
