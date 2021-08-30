import { Context } from 'koa';
import { getRepository } from 'typeorm';
import { Student } from '../../entity/Student';

type InputParams = {
  id?: string;
  userName: string;
  passWord: string;
  nickName: string;
  avatar: string;
  gender: string;
  phone: string;
  email: string;
  canLogin: boolean;
};

export async function studentSaveAction(context: Context) {
  const params = context.request.body as InputParams;
  const { id } = params;
  const studentRepository = getRepository(Student);
  if (!id) {
    const newStudent = new Student();
    delete params.id;
    Object.assign(newStudent, params);

    await studentRepository.save(newStudent);
    context.body = {
      data: newStudent.id,
    };
  } else {
    const curStudent = await studentRepository.findOne(id);
    delete params.id;
    Object.assign(curStudent, params);

    await studentRepository.save(curStudent);
    context.body = {
      data: curStudent.id,
    };
  }
}
