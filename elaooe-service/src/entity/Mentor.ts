import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Gender } from './Student';

@Entity()
export class Mentor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userName: string;

  @Column()
  passWord: string;

  @Column()
  nickName: string;

  @Column()
  code: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @Column({ default: true })
  canLogin: boolean;
}
