import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Paper } from './Paper';
import { QuestionCollect } from './QuestionCollect';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userName: string;

  @Column()
  passWord: string;

  @Column()
  nickName: string;

  @Column()
  avatar: string;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @Column()
  phone: string;

  @Column()
  email: string;

  @OneToMany(() => Paper, (paper) => paper.student)
  papers: Paper[];

  @OneToMany(() => QuestionCollect, (questionCollect) => questionCollect.student)
  questionCollects: QuestionCollect[];

  @Column({ default: true })
  canLogin: boolean;
}
