import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";

@Entity("produk_umkm")
export class ProdukUmkm {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'nama_produk' })
  namaProduk!: string;

  @Column({ name: 'deskripsi_produk', type: 'text' })
  deskripsiProduk!: string;

  @Column({ name: 'harga_produk', type: 'decimal', precision: 15, scale: 2 })
  hargaProduk!: number;

  @Column({ name: 'gambar_produk', nullable: true })
  gambarProduk?: string;

  @Column({ name: 'link_shopee', type: 'text', nullable: true })
  linkShopee?: string;

  @Column({ name: 'link_tokopedia', type: 'text', nullable: true })
  linkTokopedia?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'umkm_id' })
  umkmId!: number;

  @ManyToOne("Umkm", "produk", { onDelete: "CASCADE" })
  @JoinColumn({ name: "umkm_id" })
  umkm!: any;
}