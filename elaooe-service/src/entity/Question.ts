import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum QuestionType {
  LISTEN_BLANKS = 'listen_blanks',
  LISTEN_SELECT = 'listen_select',
  LISTEN_DETERMINE = 'listen_determine',
  ORAL_WITH_TEXT = 'oral_with_text',
  ORAL_WITH_AUDIO = 'oral_with_audio',
}

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: QuestionType,
  })
  type: QuestionType;

  @Column()
  name: string;

  @Column('text')
  content: string;
}
