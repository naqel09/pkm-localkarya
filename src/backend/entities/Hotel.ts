import { Entity,PrimaryGeneratedColumn,Column,OneToMany } from "typeorm";
import { Room } from "./Room";


@Entity()
export class Hotel{
  @PrimaryGeneratedColumn()
  id!:number

  @Column()
  image!:string;

  @Column()
  slug!:string;
  
  @Column()
  title!:string;

  @Column()
  location!:string;

  @Column()
  price!:string;

  @Column({type:"text"})
  description!:string;

  @Column()
  galeri1!:string;

  @Column()
  galeri2!:string;

  @Column()
  galeri3!:string;

  @OneToMany(()=>Room,(room)=>room.hotel,{cascade:true,onUpdate:'CASCADE',onDelete:'CASCADE'})
  rooms!:Room[];
}