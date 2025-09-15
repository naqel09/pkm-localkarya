import {Entity,PrimaryGeneratedColumn,Column} from "typeorm"

@Entity()
export class Artikel{
    @PrimaryGeneratedColumn()
    id!:number;

    @Column()
    Judul!:string;

    @Column()
    Kategori!:string;
    
    @Column()
    Lokasi!:string;

    @Column({type:'date'})
    Tanggal!:string;

    @Column({type:'text'})
    Deskripsi!:string;

    @Column()
    Gambar!:string;
}