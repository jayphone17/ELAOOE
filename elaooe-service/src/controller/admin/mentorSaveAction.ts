import { Context } from 'koa';
import { getRepository } from 'typeorm';
import { Mentor } from '../../entity/Mentor';
import { genResponse } from '../../utils';

type InputParams = {
  id?: string;
  userName: string;
  passWord: string;
  nickName: string;
  code: string;
  phone: string;
  email: string;
  gender: string;
  canLogin: boolean;
};

export async function mentorSaveAction(context: Context) {
  const params = context.request.body as InputParams;
  const { id } = params;
  const mentorRepository = getRepository(Mentor);
  if (!id) {
    const newMentor = new Mentor();
    delete params.id;
    Object.assign(newMentor, params);

    await mentorRepository.save(newMentor);
    context.body = genResponse(newMentor.id);
  } else {
    const curMentor = await mentorRepository.findOne(id);
    delete params.id;
    Object.assign(curMentor, params);

    await mentorRepository.save(curMentor);
    context.body = genResponse(true);
  }
}
