import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Hotel } from "./Hotel";

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'jenis_kamar' })
  jenisKamar!: string;

  @Column({ name: 'luas_kamar' })
  luasKamar!: string;

  @Column({ name: 'fasilitas_kamar', type: 'json' })
  fasilitasKamar!: string[];

  @Column({ name: 'harga_per_malam', type: 'decimal', precision: 10, scale: 2 })
  hargaPerMalam!: number;

  @Column({ name: 'banyaknya_tamu' })
  banyaknyaTamu!: number;

  @Column({ name: 'deskripsi_kamar', type: 'text' })
  deskripsiKamar!: string;

  @Column({ name: 'gambar1', nullable: true })
  gambar1?: string;

  @Column({ name: 'gambar2', nullable: true })
  gambar2?: string;

  @Column({ name: 'gambar3', nullable: true })
  gambar3?: string;

  @Column({ name: 'gambar360', nullable: true })
  gambar360?: string;

  @ManyToOne(() => Hotel, (hotel) => hotel.rooms, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hotel_id' })
  hotel!: Hotel;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}