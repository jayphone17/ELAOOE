import { Context } from 'koa';
import { getManager } from 'typeorm';
import { QuestionCollect } from '../../entity/QuestionCollect';
import { Student } from '../../entity/Student';
import { genResponse } from '../../utils';

export async function questionCollectAction(context: Context) {
  const studentRepository = getManager().getRepository(Student);
  const curStudent = await studentRepository.findOne(context.state.user.id, {
    relations: ['questionCollects'],
  });
  const params = context.request.body as {
    paperName: string;
    content: string;
    answer: string;
    questionId: number;
  };
  const curQuestionCollect = new QuestionCollect();
  Object.assign(curQuestionCollect, params);

  curQuestionCollect.student = curStudent;

  const questionCollectRepository = getManager().getRepository(QuestionCollect);
  await questionCollectRepository.save(curQuestionCollect);

  context.body = genResponse(true);
}
