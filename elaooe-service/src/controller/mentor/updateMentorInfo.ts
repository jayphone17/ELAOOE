import { Context } from 'koa';
import { getRepository } from 'typeorm';
import { Mentor } from '../../entity/Mentor';
import { genResponse } from '../../utils';

type InputParams = {
  nickName: string;
  code: string;
  phone: string;
  email: string;
  gender: string;
};

export async function updateMentorInfoAction(context: Context) {
  const params = context.request.body as InputParams;
  const { id } = context.state.user;

  const mentorRepository = getRepository(Mentor);
  const curMentor = await mentorRepository.findOne(id);
  Object.assign(curMentor, params);

  await mentorRepository.save(curMentor);
  context.body = genResponse(true);
}
