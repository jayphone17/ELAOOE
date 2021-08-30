import { Context } from 'koa';
import { getManager } from 'typeorm';
import { Student } from '../../entity/Student';
import { genResponse } from '../../utils';

export async function changepassAction(context: Context) {
  const params = context.request.body as {
    oriPassword: string;
    newPassword: string;
    repeatNewPassword: string;
  };

  const userRepository = getManager().getRepository(Student);
  const curUser = await userRepository.findOne(context.state.user.id);

  if (curUser.passWord !== params.oriPassword) {
    context.body = genResponse(null, -1, '密码不正确');
    return;
  }

  if (params.newPassword !== params.repeatNewPassword) {
    context.body = genResponse(null, -1, '两次输入的密码不一致');
    return;
  }

  if (params.newPassword.length < 8) {
    context.body = genResponse(null, -1, '密码最短要八位');
    return;
  }

  curUser.passWord = params.newPassword;

  await userRepository.save(curUser);

  context.body = genResponse(true, 0, '修改成功');
}
