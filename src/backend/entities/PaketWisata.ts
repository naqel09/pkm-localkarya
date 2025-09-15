import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("paket_wisata")
export class PaketWisata {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "nama_paket", length: 255 })
  namaPaket!: string;

  @Column({ name: "alamat", type: "text", nullable: true, default: "" })
  alamat?: string;

  @Column({ name: "deskripsi", type: "text" })
  deskripsi!: string;

  @Column({ name: "harga", type: "decimal", precision: 12, scale: 2 })
  harga!: number;

  // Gambar 1 - Required (main image)
  @Column({ name: "gambar_1", type: "text" })
  gambar1!: string;

  // Gambar 2 - Optional
  @Column({ name: "gambar_2", type: "text", nullable: true })
  gambar2?: string;

  // Gambar 3 - Optional
  @Column({ name: "gambar_3", type: "text", nullable: true })
  gambar3?: string;

  // Gambar 4 - Optional
  @Column({ name: "gambar_4", type: "text", nullable: true })
  gambar4?: string;

  // Gambar 360 - Optional
  @Column({ name: "gambar_360", type: "text", nullable: true })
  gambar360?: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}