import { Context } from 'koa';
import { getManager } from 'typeorm';
import { Mentor } from '../../entity/Mentor';
import { genResponse } from '../../utils';

export async function mentorInfo(context: Context) {
  const mentorRepository = getManager().getRepository(Mentor);
  const curMentor = await mentorRepository.findOne(context.state.user.id);

  context.body = genResponse(curMentor);
}
