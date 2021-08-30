import { Context } from 'koa';
import { getRepository } from 'typeorm';
import { Message } from '../../entity/Message';
import { genResponse } from '../../utils';

export async function messageReply(context: Context) {
  const { id, reply } = context.request.body as { id: number; reply: string };
  const messageRepository = getRepository(Message);
  const curMessage = await messageRepository.findOne(id);
  curMessage.reply = reply;
  await messageRepository.save(curMessage);

  context.body = genResponse(curMessage);
}
