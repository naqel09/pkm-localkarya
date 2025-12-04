import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("pilih_kami_features")
export class PilihKamiFeature {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "title", type: "varchar", length: 255 })
  title!: string;

  @Column({ name: "description", type: "text" })
  description!: string;

  @Column({ name: "order_index", type: "int", default: 0 })
  orderIndex!: number;

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}