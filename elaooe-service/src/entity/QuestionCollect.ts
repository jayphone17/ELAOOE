import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from './Student';

@Entity()
export class QuestionCollect {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  questionId: number;

  @Column()
  paperName: string;

  @Column('text')
  content: string;

  @Column()
  answer: string;

  @ManyToOne(() => Student, (user) => user.questionCollects)
  student: Student;
}
