import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("menus")
export class Menu {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'nama_menu' })
  namaMenu!: string;

  @Column({ name: 'harga', type: 'decimal', precision: 10, scale: 2 })
  harga!: number;

  // 2 foto makanan
  @Column({ name: 'foto_makanan1', nullable: true })
  fotoMakanan1?: string;

  @Column({ name: 'foto_makanan2', nullable: true })
  fotoMakanan2?: string;

  @Column({ name: 'restaurant_id' })
  restaurantId!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}