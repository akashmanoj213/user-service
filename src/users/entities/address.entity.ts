import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

export enum AddressType {
    OFFICE = "office",
    RESIDENCE = "residence"
}

@Entity()
export class Address {
    @PrimaryGeneratedColumn()
    id?: number;
    @Column({
        nullable: true
    })
    streetAddress1: string;
    @Column({
        nullable: true
    })
    streetAddress2: string;
    @Column()
    city: string;
    @Column()
    state: string;
    @Column()
    pincode: string;
    @Column({
        type: "enum",
        enum: AddressType,
        default: AddressType.RESIDENCE
    })
    type: AddressType;
    @CreateDateColumn()
    createdAt?: Date;
    @UpdateDateColumn()
    updatedAt?: Date;
    @ManyToOne(type => User, user => user.addresses)
    user?: User
}