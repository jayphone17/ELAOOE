import { Context } from 'koa';
import { getRepository } from 'typeorm';
import { Student } from '../../entity/Student';
import { genResponse } from '../../utils';

type InputParams = {
  nickName: string;
  avatar: string;
  gender: string;
  phone: string;
  email: string;
};

export async function updateStudentInfoAction(context: Context) {
  const params = context.request.body as InputParams;
  const { id } = context.state.user;

  const studentRepository = getRepository(Student);
  const curStudent = await studentRepository.findOne(id);
  Object.assign(curStudent, params);

  await studentRepository.save(curStudent);
  context.body = genResponse(true);
}
