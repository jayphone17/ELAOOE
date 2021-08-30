import { Context } from 'koa';
import { getManager } from 'typeorm';
import { Student } from '../../entity/Student';
import { genResponse } from '../../utils';

export async function userInfo(context: Context) {
  const studentRepository = getManager().getRepository(Student);
  const curStudent = await studentRepository.findOne(context.state.user.id);

  context.body = genResponse(curStudent);
}
