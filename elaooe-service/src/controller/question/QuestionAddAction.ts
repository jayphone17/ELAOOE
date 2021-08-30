import { Context } from 'koa';
import { getRepository } from 'typeorm';
import { Question, QuestionType } from '../../entity/Question';

type InputParams = {
  name: string;
  type: QuestionType;
  content: string;
};

export async function questionAddAction(context: Context) {
  const params = context.request.body as InputParams;
  const { name, type, content } = params;
  const newQuestion = new Question();
  newQuestion.name = name;
  newQuestion.type = QuestionType[type];
  newQuestion.content = JSON.stringify(content);
  console.log('new question', newQuestion);

  const questionRepository = getRepository(Question);
  await questionRepository.save(newQuestion);
  context.body = {
    data: newQuestion.id,
  };
}
