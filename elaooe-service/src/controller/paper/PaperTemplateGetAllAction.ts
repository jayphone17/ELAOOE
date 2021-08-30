import { Context } from 'koa';
import { getManager } from 'typeorm';
import { PaperTemplate } from '../../entity/PaperTemplate';

export async function paperTemplateGetAllAction(context: Context) {
  const papertemplateRepository = getManager().getRepository(PaperTemplate);

  const paperTemplates = await papertemplateRepository.find({
    order: {
      id: 'DESC',
    },
    select: ['id', 'name'],
  });

  context.body = {
    data: paperTemplates,
  };
}
