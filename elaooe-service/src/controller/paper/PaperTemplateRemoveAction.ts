import { Context } from 'koa';
import { getManager } from 'typeorm';
import { PaperTemplate } from '../../entity/PaperTemplate';

export async function paperTemplateRemoveAction(context: Context) {
  const { id } = context.request.query as { id: string };

  const papertemplateRepository = getManager().getRepository(PaperTemplate);

  const paperTemplate = await papertemplateRepository.findOne(id);
  await papertemplateRepository.remove(paperTemplate);

  context.body = {
    data: 'done',
  };
}
