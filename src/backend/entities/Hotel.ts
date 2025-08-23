import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Room } from "./Room";

@Entity()
export class Hotel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  image!: string;

  @Column({ unique: true })
  slug!: string;

  @Column()
  title!: string;

  @Column()
  location!: string;

  @Column()
  price!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ nullable: true })
  galeri1!: string;

  @Column({ nullable: true })
  galeri2!: string;

  @Column({ nullable: true })
  galeri3!: string;

  @OneToMany(() => Room, (room) => room.hotel, { cascade: true,onDelete: "CASCADE",eager:true })
  rooms!: Room[];
}
