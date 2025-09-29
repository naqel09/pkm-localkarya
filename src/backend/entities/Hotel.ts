import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("hotels")
export class Hotel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'nama_hotel' })
  namaHotel!: string;

  @Column({ name: 'alamat_hotel' })
  alamatHotel!: string;

  @Column({ name: 'google_maps_hotel', nullable: true })
  googleMapsHotel?: string;

  @Column({ name: 'deskripsi_hotel', type: 'text' })
  deskripsiHotel!: string;

  @Column({ name: 'fasilitas', type: 'json' })
  fasilitas!: string[];

  @Column({ name: 'gambar1', nullable: true })
  gambar1?: string;

  @Column({ name: 'gambar2', nullable: true })
  gambar2?: string;

  @Column({ name: 'gambar3', nullable: true })
  gambar3?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}