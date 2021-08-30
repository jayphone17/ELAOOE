import { Context } from 'koa';
import { getRepository } from 'typeorm';
import { Notice } from '../../entity/Notice';
import { genResponse } from '../../utils';

type InputParams = {
  id?: number;
  title: string;
  name: string;
  code: string;
  time: number;
};

export async function postNotice(context: Context) {
  const params = context.request.body as InputParams;

  console.log(params);

  const noticeRepository = getRepository(Notice);
  if (!params.id) {
    const newNotice = new Notice();
    Object.assign(newNotice, params);
    newNotice.time = new Date(params.time);
    newNotice.userId = context.state.user.id;

    await noticeRepository.save(newNotice);
  } else {
    const oriNotice = await noticeRepository.findOne(params.id);
    Object.assign(oriNotice, params);
    oriNotice.time = new Date(params.time);

    await noticeRepository.save(oriNotice);
  }

  context.body = genResponse(true);
}
