import { Context } from 'koa';
import * as jwt from 'jsonwebtoken';
import { getManager } from 'typeorm';
import { Admin } from '../../entity/Admin';
import { Role, SECRECT } from '../../config';
import { genResponse } from '../../utils';

export async function adminLogin(context: Context) {
  const { userName, passWord } = context.request.body as {
    userName: string;
    passWord: string;
  };

  const adminRepository = getManager().getRepository(Admin);
  const admin = await adminRepository.findOne({
    where: { userName, passWord },
  });

  if (admin) {
    const token = jwt.sign({ role: Role.mentor, id: admin.id }, SECRECT, {
      expiresIn: '1h',
    });

    context.body = genResponse(token);
    return;
  }

  context.body = genResponse(null, -1, '用户名或密码错误');
}
