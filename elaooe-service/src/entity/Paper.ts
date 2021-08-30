import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaperTemplate } from './PaperTemplate';
import { Student } from './Student';

@Entity()
export class Paper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, (user) => user.papers, {
    cascade: true,
    eager: true,
  })
  student: Student;

  @ManyToOne(() => PaperTemplate, (paperTemplate) => paperTemplate.papers, {
    cascade: true,
    eager: true,
  })
  paperTemplate: PaperTemplate;

  @Column()
  doneYet: boolean;

  @Column('text')
  answer: string;

  @Column('text')
  rank: string;

  @Column({ default: false })
  judged: boolean;

  @Column()
  score: number;

  @Column()
  rightCount: number;

  @Column()
  totalCount: number;
}
