import { Context } from 'koa';
import { getRepository } from 'typeorm';
import { Message } from '../../entity/Message';
import { Student } from '../../entity/Student';
import { genResponse } from '../../utils';

export async function messageGetAll(context: Context) {
  const messageRepository = getRepository(Message);
  const studentRepository = getRepository(Student);
  const messages = await messageRepository.find();
  for (const message of messages) {
    const curStudent = await studentRepository.findOne(message.userId);
    (message as any).name = curStudent.userName;
  }

  context.body = genResponse(messages);
}
