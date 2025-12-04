import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("special_packages")
export class SpecialPackage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "title", type: "varchar", length: 255 })
  title!: string;

  @Column({ name: "description", type: "text" })
  description!: string;

  @Column({ name: "image_url", type: "varchar", length: 500, nullable: true })
  imageUrl!: string | null;

  @Column({ name: "order_index", type: "int", default: 0 })
  orderIndex!: number;

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}