import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

export type LinkPrecedence = "primary" | "secondary";

@Entity("contacts")
export class Contact {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255, nullable: true })
    phoneNumber!: string | null;

    @Column({ type: "varchar", length: 255, nullable: true })
    email!: string | null;

    @Column({ type: "enum", enum: ["primary", "secondary"], default: "primary" })
    linkPrecedence!: LinkPrecedence;

    @Column({ type: "int", nullable: true })
    linkedId!: number | null;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date | null;
}
