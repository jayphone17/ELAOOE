import { Context } from 'koa';
import { getManager } from 'typeorm';
import { Student } from '../../entity/Student';

export async function studentGetAllAction(context: Context) {
  const studentRepository = getManager().getRepository(Student);

  const students = await studentRepository.find();

  context.body = {
    data: students,
  };
}
