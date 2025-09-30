import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("vlogs")
export class Vlog {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    judulVideo!: string;

    @Column({ type: 'text' })
    deskripsiVideo!: string;

    @Column()
    linkYoutube!: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;
}