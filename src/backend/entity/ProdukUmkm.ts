import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Umkm } from "./Umkm";

@Entity()
export class ProdukUmkm {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255 })
    nama_produk: string;

    @Column({ type: "text" })
    deskripsi_produk: string;

    @Column({ type: "decimal", precision: 15, scale: 2 })
    harga_produk: number;

    @Column({ type: "varchar", length: 255, nullable: true })
    gambar_produk: string;

    @Column({ type: "text", nullable: true })
    link_shopee: string;

    @Column({ type: "text", nullable: true })
    link_tokopedia: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column()
    umkm_id: number;

    @ManyToOne(() => Umkm, umkm => umkm.produk, { onDelete: "CASCADE" })
    @JoinColumn({ name: "umkm_id" })
    umkm: Umkm;
}