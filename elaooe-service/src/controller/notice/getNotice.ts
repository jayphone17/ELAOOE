import { Context } from 'koa';
import { getRepository } from 'typeorm';
import { Notice } from '../../entity/Notice';
import { genResponse } from '../../utils';

export async function getNotice(context: Context) {
  const noticeRepository = getRepository(Notice);
  const notices = await noticeRepository.find({ order: { id: 'DESC' } });

  context.body = genResponse(notices);
}
