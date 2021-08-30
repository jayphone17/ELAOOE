import { Context } from 'koa';
import { getManager } from 'typeorm';
import { Paper } from '../../entity/Paper';
import { QuestionCollect } from '../../entity/QuestionCollect';
import { Student } from '../../entity/Student';

export async function studentRemoveAction(context: Context) {
  const { id } = context.request.query as { id: string };

  const studentRepository = getManager().getRepository(Student);
  const paperRepository = getManager().getRepository(Paper);
  const collectRepository = getManager().getRepository(QuestionCollect);

  const student = await studentRepository.findOne(id);
  await paperRepository.delete({ student: student });
  await collectRepository.delete({ student: student });
  await studentRepository.remove(student);

  context.body = {
    data: 'done',
  };
}
