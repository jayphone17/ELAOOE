import { Context } from 'koa';
import { getManager } from 'typeorm';
import { Message } from '../../entity/Message';
import { genResponse } from '../../utils';

export async function leaveMessageAction(context: Context) {
  const params = context.request.body as {
    title: string;
    content: string;
  };

  const messageRepository = getManager().getRepository(Message);
  const newMessage = new Message();
  Object.assign(newMessage, params);
  newMessage.userId = context.state.user.id;
  newMessage.reply = '';

  await messageRepository.save(newMessage);

  context.body = genResponse(true);
}
