import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("restaurants")
export class Restaurant {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'nama_restaurant' })
  namaRestaurant!: string;

  @Column({ name: 'alamat_restaurant' })
  alamatRestaurant!: string;

  @Column({ name: 'deskripsi_restaurant', type: 'text' })
  deskripsiRestaurant!: string;

  // 6 gambar restaurant
  @Column({ name: 'gambar1', nullable: true })
  gambar1?: string;

  @Column({ name: 'gambar2', nullable: true })
  gambar2?: string;

  @Column({ name: 'gambar3', nullable: true })
  gambar3?: string;

  @Column({ name: 'gambar4', nullable: true })
  gambar4?: string;

  @Column({ name: 'gambar5', nullable: true })
  gambar5?: string;

  @Column({ name: 'gambar6', nullable: true })
  gambar6?: string;

  // 3 foto menu
  @Column({ name: 'foto_menu1', nullable: true })
  fotoMenu1?: string;

  @Column({ name: 'foto_menu2', nullable: true })
  fotoMenu2?: string;

  @Column({ name: 'foto_menu3', nullable: true })
  fotoMenu3?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}