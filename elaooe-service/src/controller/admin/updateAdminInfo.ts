import { Context } from 'koa';
import { getRepository } from 'typeorm';
import { Admin } from '../../entity/Admin';
import { genResponse } from '../../utils';

type InputParams = {
  nickName: string;
};

export async function updateAdminInfo(context: Context) {
  const params = context.request.body as InputParams;
  const { id } = context.state.user;

  const adminRepository = getRepository(Admin);
  const curAdmin = await adminRepository.findOne(id);
  Object.assign(curAdmin, params);

  await adminRepository.save(curAdmin);
  context.body = genResponse(curAdmin);
}
