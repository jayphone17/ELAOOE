import { Context } from 'koa';
import { getManager } from 'typeorm';
import { Mentor } from '../../entity/Mentor';
import { genResponse } from '../../utils';

export async function teacherGetAllAction(context: Context) {
  const mentorRepository = getManager().getRepository(Mentor);

  const mentors = await mentorRepository.find();

  context.body = genResponse(mentors)
}
