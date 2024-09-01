import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from '../users/user.entity';

@Entity()
export class Reports {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column()
  make: string; //company

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  mileage: Number;

  @Column()
  lng: number;

  @Column()
  lat: number;

  @ManyToOne(() => User, (user) => user.reports) //change database,//function that returnts user associated with type Report, the function is due to cyrclar dependency issue -> problem with Ts. the secound is to get from user instans to report
  user: User;

  @Column({ default: false })
  approved: boolean;
}
