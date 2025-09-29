import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { ProdukUmkm } from "./ProdukUmkm";

@Entity()
export class Umkm {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255 })
    nama_umkm: string;

    @Column({ type: "text" })
    deskripsi_umkm: string;

    @Column({ type: "text" })
    alamat_umkm: string;

    @Column({ type: "text", nullable: true })
    link_gmaps: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    gambar: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => ProdukUmkm, produk => produk.umkm, { cascade: true })
    produk: ProdukUmkm[];
}