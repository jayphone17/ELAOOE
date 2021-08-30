import { Context } from 'koa';
import { getManager } from 'typeorm';
import { Admin } from '../../entity/Admin';
import { genResponse } from '../../utils';

export async function adminInfo(context: Context) {
  const adminRepository = getManager().getRepository(Admin);
  const curMentor = await adminRepository.findOne(context.state.user.id);

  context.body = genResponse(curMentor);
}
