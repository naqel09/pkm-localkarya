import { Entity, PrimaryGeneratedColumn,Column,ManyToOne, JoinColumn } from "typeorm";
import { Hotel } from "./Hotel";

@Entity()
export class Room{
  @PrimaryGeneratedColumn()
  id!:number;

  @Column()
  name!:string

  @Column()
  description!:string

  @Column()
  price!:string
  
  @Column()
  image!:string

  @Column()
  galeri1!:string

  @Column()
  galeri2!:string

  @ManyToOne(()=>Hotel,(hotel)=>hotel.rooms)
  @JoinColumn()
  hotel!:Hotel
}