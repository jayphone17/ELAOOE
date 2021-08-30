import { Context } from 'koa';
import { getRepository } from 'typeorm';
import { Carousel } from '../../entity/Carousel';
import { genResponse } from '../../utils';

type InputParams = {
  id?: number;
  title: string;
  imgSrc: string;
};

export async function carouselPost(context: Context) {
  const params = context.request.body as InputParams;

  const carouselRepository = getRepository(Carousel);
  if (!params.id) {
    const newCarousel = new Carousel();
    Object.assign(newCarousel, params);

    await carouselRepository.save(newCarousel);
  } else {
    const oriCarousel = await carouselRepository.findOne(params.id);
    delete params.id;
    Object.assign(oriCarousel, params);

    await carouselRepository.save(oriCarousel);
  }

  context.body = genResponse(true);
}
