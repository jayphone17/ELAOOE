import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Notice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  title: string;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  time: Date;
}
