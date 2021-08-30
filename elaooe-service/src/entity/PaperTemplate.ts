import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Paper } from './Paper';

@Entity()
export class PaperTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  detail: string;

  @OneToMany(() => Paper, (paper) => paper.paperTemplate)
  papers: Paper[];
}
