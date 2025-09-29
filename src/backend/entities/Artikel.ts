import {Entity,PrimaryGeneratedColumn,Column,CreateDateColumn} from "typeorm"

@Entity("artikels")
export class Artikel{
    @PrimaryGeneratedColumn()
    id!:number;

    @Column()
    judul!:string;

    @CreateDateColumn({type: 'timestamp'})
    tanggalPembuatan!:Date;

    @Column()
    gambar!:string;

    @Column({type:'text'})
    isiArtikel!:string;

    @Column()
    penulis!:string;
}