import { Context } from 'koa';
import { getManager } from 'typeorm';
import { Paper } from '../../entity/Paper';

export async function paperGetOneAction(context: Context) {
  const { id } = context.request.query as { id: string };
  const paperRepository = getManager().getRepository(Paper);
  const paper = await paperRepository.findOne(id);

  context.body = {
    data: paper,
  };
}
