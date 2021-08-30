import { Context } from 'koa';
import { getManager } from 'typeorm';
import { Question } from '../../entity/Question';

export async function questionRemoveAction(context: Context) {
  const { id } = context.request.query;
  const questionRepository = getManager().getRepository(Question);

  const question = await questionRepository.find({
    where: { id },
  });
  const ret = await questionRepository.remove(question);

  context.body = {
    data: 'done',
  };
}
