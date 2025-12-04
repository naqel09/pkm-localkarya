import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("testimonials")
export class Testimonial {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "name", type: "varchar", length: 255 })
  name!: string;

  @Column({ name: "location", type: "varchar", length: 255 })
  location!: string;

  @Column({ name: "comment", type: "text" })
  comment!: string;

  @Column({ name: "image_url", type: "varchar", length: 500 })
  imageUrl!: string;

  @Column({ name: "order_index", type: "int", default: 0 })
  orderIndex!: number;

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}