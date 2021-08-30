import { Context } from 'koa';
import { getManager } from 'typeorm';
import { Mentor } from '../../entity/Mentor';
import { genResponse } from '../../utils';

export async function mentorRemoveAction(context: Context) {
  const { id } = context.request.query as { id: string };

  const mentorRepository = getManager().getRepository(Mentor);

  const curMentor = await mentorRepository.findOne(id);
  await mentorRepository.remove(curMentor);

  context.body = genResponse(true);
}
