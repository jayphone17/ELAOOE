import { Context } from 'koa';
import { getManager } from 'typeorm';
import { PaperTemplate } from '../../entity/PaperTemplate';

export async function paperTemplateGetOneAction(context: Context) {
  const { id } = context.request.query;
  const papertemplateRepository = getManager().getRepository(PaperTemplate);

  const paperTemplate = await papertemplateRepository.findOne({
    where: {
      id,
    },
    relations: ['papers'],
  });

  context.body = {
    data: paperTemplate,
  };
}
