import { Context } from 'koa';
import { getManager } from 'typeorm';
import { Student } from '../../entity/Student';

export async function paperGetAllAction(context: Context) {
  const studentRepository = getManager().getRepository(Student);
  const { papers } = await studentRepository.findOne(context.state.user.id, {
    relations: ['papers'],
  });

  context.body = {
    data: papers,
  };
}
