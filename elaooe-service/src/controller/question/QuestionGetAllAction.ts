import { Context } from 'node:vm';
import { getManager } from 'typeorm';
import { Question, QuestionType } from '../../entity/Question';

export async function questionGetAllAction(context: Context) {
  const { type } = context.request.query;
  const questionRepository = getManager().getRepository(Question);

  const questions = await questionRepository.find({
    where: { type: QuestionType[type] },
    order: {
      id: 'DESC',
    },
  });

  context.body = {
    data: questions,
  };
}
