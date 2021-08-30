import { Context } from 'koa';
import { getManager } from 'typeorm';
import { Paper } from '../../entity/Paper';
import { PaperTemplate } from '../../entity/PaperTemplate';
import { Student } from '../../entity/Student';

export async function paperSendAction(context: Context) {
  const params = context.request.body as {
    paperTemplateId: number;
    studentIds: string[];
  };

  const { paperTemplateId, studentIds } = params;

  const paperTemplateRepository = getManager().getRepository(PaperTemplate);
  const studentRepository = getManager().getRepository(Student);
  const paperRepository = getManager().getRepository(Paper);

  for (const studentId of studentIds) {
    const newPaper = new Paper();
    newPaper.student = await studentRepository.findOne(studentId);
    newPaper.paperTemplate = await paperTemplateRepository.findOne(
      paperTemplateId
    );
    newPaper.doneYet = false;
    newPaper.answer = '{}';
    newPaper.rank = '{}';
    newPaper.judged = false;
    newPaper.score = 0;
    newPaper.rightCount = -1;
    newPaper.totalCount = -1;
    await paperRepository.save(newPaper);
  }

  context.body = {
    data: 'done',
  };
}
