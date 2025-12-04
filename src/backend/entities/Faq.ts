import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("faqs")
export class Faq {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "question", type: "varchar", length: 500 })
  question!: string;

  @Column({ name: "answer", type: "text" })
  answer!: string;

  @Column({ name: "order_index", type: "int", default: 0 })
  orderIndex!: number;

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}