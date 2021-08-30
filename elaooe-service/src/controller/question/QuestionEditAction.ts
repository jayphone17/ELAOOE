import { Context } from 'koa';
import { getRepository } from 'typeorm';
import { Question, QuestionType } from '../../entity/Question';

type InputParams = {
  id: number;
  name: string;
  type: QuestionType;
  content: string;
};

export async function questionEditAction(context: Context) {
  const params = context.request.body as InputParams;
  const { id, name, content } = params;
  const questionRepository = getRepository(Question);

  const curQuestion = await questionRepository.findOne(id);
  curQuestion.name = name;
  curQuestion.content = JSON.stringify(content);
  await questionRepository.save(curQuestion);
  context.body = {
    data: curQuestion.id,
  };
}
