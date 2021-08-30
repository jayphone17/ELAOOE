import { Context } from 'koa';
import { getManager } from 'typeorm';
import { Carousel } from '../../entity/Carousel';
import { genResponse } from '../../utils';

export async function CarouselGetAll(context: Context) {
  const carouselRepository = getManager().getRepository(Carousel);

  const carousels = await carouselRepository.find({ order: { id: 'ASC' } });

  context.body = genResponse(carousels);
}
