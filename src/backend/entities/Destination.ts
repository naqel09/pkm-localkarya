import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("destinations") // Specify table name
export class Destination {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "nama_lokasi", length: 255 })
  namaLokasi!: string;

  @Column({ name: "alamat", type: "text", nullable: true, default: "" })
  alamat?: string;

  @Column({ name: "deskripsi", type: "text" })
  deskripsi!: string;

  // Gambar 1 - Required (main image)
  @Column({ name: "gambar_1", type: "text" })
  gambar1!: string;

  // Gambar 2 - Optional
  @Column({ name: "gambar_2", type: "text", nullable: true })
  gambar2?: string;

  // Gambar 3 - Optional
  @Column({ name: "gambar_3", type: "text", nullable: true })
  gambar3?: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
