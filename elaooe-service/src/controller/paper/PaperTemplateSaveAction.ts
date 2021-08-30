import { Context } from 'koa';
import { getRepository } from 'typeorm';
import { PaperTemplate } from '../../entity/PaperTemplate';

type InputParams = {
  id: number;
  name: string;
  detail: string;
};

export async function paperTemplateAddAction(context: Context) {
  const params = context.request.body as InputParams;
  const { id, name, detail } = params;
  const templateRepository = getRepository(PaperTemplate);
  if (!id) {
    const newTemplate = new PaperTemplate();
    newTemplate.name = name;
    newTemplate.detail = JSON.stringify(detail);
    console.log('new template', newTemplate);

    await templateRepository.save(newTemplate);
    context.body = {
      data: newTemplate.id,
    };
    return;
  } else {
    const curTemplate = await templateRepository.findOne(id);
    curTemplate.name = name;
    curTemplate.detail = JSON.stringify(detail);

    await templateRepository.save(curTemplate);
    context.body = {
      data: curTemplate.id,
    };
  }
}
