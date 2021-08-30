import { Context } from 'koa';
import { getManager } from 'typeorm';
import { Student } from '../../entity/Student';
import * as jwt from 'jsonwebtoken';
import { Role, SECRECT } from '../../config';
import { genResponse } from '../../utils';

export async function studentLoginAction(context: Context) {
  const { userName, passWord } = context.request.body as {
    userName: string;
    passWord: string;
  };

  const studentRepository = getManager().getRepository(Student);
  const student = await studentRepository.findOne({
    where: { userName, passWord },
  });

  if (student) {
    const token = jwt.sign({ role: Role.student, id: student.id }, SECRECT, {
      expiresIn: '1h',
    });

    context.body = genResponse(token);
    return;
  }

  context.body = genResponse(null, -1, '用户名或密码错误');
}
