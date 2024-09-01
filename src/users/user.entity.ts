import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Reports } from '../reports/reports.entity';

@Entity()
export class User {
  //Proproties comes now:
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  //@Exclude()
  @Column()
  password: string;

  @Column({ default: true })
  admin: boolean;

  @OneToMany(() => Reports, (report) => report.user) //function that returnts user associated with type Report, the function is due to cyrclar dependency issue -> problem with Ts. the secound is to get from report instans to user
  reports: Reports[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted:', this.id);
  }

  @AfterUpdate()
  LogUpadate() {
    console.log('Updated:', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed:', this.id);
  }
}
