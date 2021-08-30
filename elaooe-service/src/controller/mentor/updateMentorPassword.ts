import { Context } from 'koa';
import { getRepository } from 'typeorm';
import { Mentor } from '../../entity/Mentor';
import { genResponse } from '../../utils';

type InputParams = {
  oriPassword: string;
  newPassword: string;
  repeatNewPassword: string;
};

export async function updateMentorPassword(context: Context) {
  const params = context.request.body as InputParams;
  const { id } = context.state.user;

  const mentorRepository = getRepository(Mentor);
  const curMentor = await mentorRepository.findOne(id);

  if (curMentor.passWord !== params.oriPassword) {
    context.body = genResponse(false, -1, '原密码不对');
    return;
  }
  curMentor.passWord = params.newPassword;

  await mentorRepository.save(curMentor);
  context.body = genResponse(true);
}
