import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Carousel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  imgSrc: string;
}
