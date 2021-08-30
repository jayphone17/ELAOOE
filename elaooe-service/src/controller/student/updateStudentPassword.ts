import { Context } from 'koa';
import { getRepository } from 'typeorm';
import { Student } from '../../entity/Student';
import { genResponse } from '../../utils';

type InputParams = {
  oriPassword: string;
  newPassword: string;
  repeatNewPassword: string;
};

export async function updateStudentPassword(context: Context) {
  const params = context.request.body as InputParams;
  const { id } = context.state.user;

  const studentRepository = getRepository(Student);
  const curStudent = await studentRepository.findOne(id);

  if (curStudent.passWord !== params.oriPassword) {
    context.body = genResponse(false, -1, '原密码不对');
    return;
  }
  curStudent.passWord = params.newPassword;

  await studentRepository.save(curStudent);
  context.body = genResponse(true);
}
