import { Context } from 'koa';
import { getManager } from 'typeorm';
import { Paper } from '../../entity/Paper';
import { genResponse } from '../../utils';

export async function paperSubmitAction(context: Context) {
  const params = context.request.body as {
    id: number;
    answer: Record<number, string>;
  };

  const { id, answer } = params;

  const paperRepository = getManager().getRepository(Paper);
  const curPaper = await paperRepository.findOne(id);
  if (curPaper.doneYet) {
    context.body = genResponse(false, -1, '已提交过');
    return;
  }
  curPaper.answer = JSON.stringify(answer);
  const questions = JSON.parse(curPaper.paperTemplate.detail);
  let rank = Object.assign({}, (answer as unknown) as Record<number, number>);
  console.log(answer);
  for (const key in rank) {
    rank[key] = -1;
  }
  let allJudged = true;
  let rightCount = 0;
  let totalCount = 0;
  let totalScore = 0;
  console.log(rank);
  for (const question of questions) {
    console.log(question);
    if (
      question.type === 'listen_determine' ||
      question.type === 'listen_select'
    ) {
      if (answer[question.id] === question.content.answer) {
        console.log(answer[question.id], question.content.answer);
        rank[question.id] = 10;
        totalScore += 10;
        rightCount++;
      } else {
        rank[question.id] = 0;
      }
    } else {
      allJudged = false;
    }
    totalCount++;
  }
  curPaper.doneYet = true;
  curPaper.judged = allJudged;
  curPaper.rank = JSON.stringify(rank);
  curPaper.rightCount = rightCount;
  curPaper.totalCount = totalCount;
  curPaper.score = totalScore;
  await paperRepository.save(curPaper);

  context.body = genResponse(true);
}
