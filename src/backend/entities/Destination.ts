import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Destination {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  location!: string;

  @Column()
  title!: string;

  @Column()
  days!: string;

  @Column("numeric")
  price!: number;

  @Column()
  phone!: string;

  @Column("text")
  description!: string;

  @Column()
  image!: string;
}
