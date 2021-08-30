import { Context } from 'koa';
import { getRepository } from 'typeorm';
import { Admin } from '../../entity/Admin';
import { genResponse } from '../../utils';

type InputParams = {
  oriPassword: string;
  newPassword: string;
  repeatNewPassword: string;
};

export async function updateAdminPassword(context: Context) {
  const params = context.request.body as InputParams;
  const { id } = context.state.user;

  const adminRepository = getRepository(Admin);
  const curAdmin = await adminRepository.findOne(id);

  if (curAdmin.passWord !== params.oriPassword) {
    context.body = genResponse(false, -1, '原密码不对');
    return;
  }
  curAdmin.passWord = params.newPassword;

  await adminRepository.save(curAdmin);
  context.body = genResponse(true);
}
