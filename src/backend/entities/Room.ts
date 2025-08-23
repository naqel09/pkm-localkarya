import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Hotel } from "./Hotel";

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: "text" })
  description!: string;

  @Column()
  image!: string;

  @Column()
  price!: string;

  @Column({ nullable: true })
  galeri1!: string;

  @Column({ nullable: true })
  galeri2!: string;

  @ManyToOne(() => Hotel, (hotel) => hotel.rooms, { onDelete: "CASCADE" })
  @JoinColumn({name: "hotelId"})
  hotel!: Hotel;
}
