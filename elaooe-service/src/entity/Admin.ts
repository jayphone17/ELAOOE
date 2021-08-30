import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum AdminRole {
  GOD = 'god',
  OPERATOR = 'operator',
}

@Entity()
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userName: string;

  @Column()
  passWord: string;

  @Column()
  nickName: string;

  @Column({
    type: 'enum',
    enum: AdminRole,
    default: AdminRole.GOD,
  })
  role: AdminRole;
}
