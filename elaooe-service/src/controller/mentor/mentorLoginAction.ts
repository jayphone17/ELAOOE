import { Context } from 'koa';
import * as jwt from 'jsonwebtoken';
import { getManager } from 'typeorm';
import { Mentor } from '../../entity/Mentor';
import { Role, SECRECT } from '../../config';
import { genResponse } from '../../utils';

export async function mentorLoginAction(context: Context) {
  const { userName, passWord } = context.request.body as {
    userName: string;
    passWord: string;
  };

  const mentorRepository = getManager().getRepository(Mentor);
  const mentor = await mentorRepository.findOne({
    where: { userName, passWord },
  });

  if (mentor) {
    const token = jwt.sign({ role: Role.mentor, id: mentor.id }, SECRECT, {
      expiresIn: '1h',
    });

    context.body = genResponse(token);
    return;
  }

  context.body = genResponse(null, -1, '用户名或密码错误');
}
