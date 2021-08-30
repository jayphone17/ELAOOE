import { Context } from 'koa';
import { getManager } from 'typeorm';
import { Paper } from '../../entity/Paper';
import { genResponse } from '../../utils';

export async function scoreSubmitAction(context: Context) {
  const params = context.request.body as {
    id: number;
    rank: Record<number, number>;
  };

  const { id, rank } = params;

  const paperRepository = getManager().getRepository(Paper);
  const curPaper = await paperRepository.findOne(id);
  // if (curPaper.judged) {
  //   context.body = genResponse(false, -1, '已批阅过');
  //   return;
  // }
  let allJudged = true;
  let rightCount = 0;
  let totalCount = 0;
  let totalScore = 0;
  for (const key in rank) {
    if (rank[key] === 10) {
      rightCount++;
    }
    totalScore += rank[key];
    totalCount++;
  }
  curPaper.judged = allJudged;
  curPaper.rank = JSON.stringify(rank);
  curPaper.rightCount = rightCount;
  curPaper.totalCount = totalCount;
  curPaper.score = totalScore;
  await paperRepository.save(curPaper);

  context.body = genResponse(true);
}
