import { Context } from 'koa';
import { getManager } from 'typeorm';
import { QuestionCollect } from '../../entity/QuestionCollect';
import { genResponse } from '../../utils';

export async function questionCollectDelete(context: Context) {
  const params = context.request.query as { id: string };
  const collectRepository = getManager().getRepository(QuestionCollect);
  const curCollect = await collectRepository.findOne(params.id);

  await collectRepository.remove(curCollect);

  context.body = genResponse(true);
}
