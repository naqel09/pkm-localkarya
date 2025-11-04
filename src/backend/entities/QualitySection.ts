import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("quality_section")
export class QualitySection {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "background_image_url", type: "varchar", length: 500, nullable: true })
  backgroundImageUrl!: string | null;

  @Column({ name: "title", type: "varchar", length: 255 })
  title!: string;

  @Column({ name: "description", type: "text" })
  description!: string;

  // Tag 1
  @Column({ name: "tag1_quantity", type: "varchar", length: 50 })
  tag1Quantity!: string;

  @Column({ name: "tag1_description", type: "varchar", length: 255 })
  tag1Description!: string;

  // Tag 2
  @Column({ name: "tag2_quantity", type: "varchar", length: 50 })
  tag2Quantity!: string;

  @Column({ name: "tag2_description", type: "varchar", length: 255 })
  tag2Description!: string;

  // Tag 3
  @Column({ name: "tag3_quantity", type: "varchar", length: 50 })
  tag3Quantity!: string;

  @Column({ name: "tag3_description", type: "varchar", length: 255 })
  tag3Description!: string;

  // Tag 4
  @Column({ name: "tag4_quantity", type: "varchar", length: 50 })
  tag4Quantity!: string;

  @Column({ name: "tag4_description", type: "varchar", length: 255 })
  tag4Description!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}