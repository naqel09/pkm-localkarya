import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("about_page")
export class AboutPage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "title", type: "varchar", length: 255 })
  title!: string;

  @Column({ name: "description", type: "text" })
  description!: string;

  @Column({ name: "address", type: "varchar", length: 500 })
  address!: string;

  @Column({ name: "phone", type: "varchar", length: 50 })
  phone!: string;

  @Column({ name: "email", type: "varchar", length: 255 })
  email!: string;

  @Column({ name: "whatsapp_number", type: "varchar", length: 50 })
  whatsappNumber!: string;

  // Social media fields (optional)
  @Column({ name: "instagram_url", type: "varchar", length: 500, nullable: true })
  instagramUrl!: string | null;

  @Column({ name: "facebook_url", type: "varchar", length: 500, nullable: true })
  facebookUrl!: string | null;

  @Column({ name: "tiktok_url", type: "varchar", length: 500, nullable: true })
  tiktokUrl!: string | null;

  // Single Google Maps field for goo.gl links
  @Column({ name: "google_maps_url", type: "varchar", length: 500 })
  googleMapsUrl!: string;

  @Column({ name: "background_image_url", type: "varchar", length: 500, nullable: true })
  backgroundImageUrl!: string | null;

  // Logo field for header, admin header, and footer
  @Column({ name: "logo_url", type: "varchar", length: 500, nullable: true })
  logoUrl!: string | null;

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}