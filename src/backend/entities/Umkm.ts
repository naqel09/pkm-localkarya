import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";

@Entity("umkm")
export class Umkm {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'nama_umkm' })
  namaUmkm!: string;

  @Column({ name: 'deskripsi_umkm', type: 'text' })
  deskripsiUmkm!: string;

  @Column({ name: 'alamat_umkm', type: 'text' })
  alamatUmkm!: string;

  @Column({ name: 'link_gmaps', type: 'text', nullable: true })
  linkGmaps?: string;

  @Column({ name: 'nomor_whatsapp', nullable: true })
  nomorWhatsapp?: string;

  @Column({ name: 'gambar', nullable: true })
  gambar?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany("ProdukUmkm", "umkm", { cascade: true })
  produk!: any[];
}