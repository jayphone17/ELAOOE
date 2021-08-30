import { Context } from 'koa';
import { getManager } from 'typeorm';
import { Carousel } from '../../entity/Carousel';
import { genResponse } from '../../utils';

export async function carouselDelete(context: Context) {
  const { id } = context.request.query as { id: string };

  const carouselRepository = getManager().getRepository(Carousel);

  const curCarousel = await carouselRepository.findOne(id);
  await carouselRepository.remove(curCarousel);

  context.body = genResponse(true);
}
