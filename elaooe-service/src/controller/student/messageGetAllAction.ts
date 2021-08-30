import { Context } from 'koa';
import { getManager } from 'typeorm';
import { Message } from '../../entity/Message';
import { genResponse } from '../../utils';

export async function messageGetAllAction(context: Context) {
  const messageRepository = getManager().getRepository(Message);
  const messages = await messageRepository.find({
    where: { userId: context.state.user.id },
  });

  context.body = genResponse(messages);
}
