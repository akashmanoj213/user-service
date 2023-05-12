import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Address } from "./address.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id?: number;
    @Column({
        nullable: true
    })
    firstName: string;
    @Column({
        nullable: true
    })
    lastName: string;
    @Column({
        nullable: true
    })
    gender: string;
    @Column({
        type: "date",
        nullable: true
    })
    dob: Date;
    @Column({
        nullable: true
    })
    pincode: string;
    @Column()
    mobileNumber: string;
    @Column({
        nullable: true
    })
    email: string;
    @Column({
        default: false
    })
    isKycVerified: boolean;
    @CreateDateColumn()
    createdAt?: Date;
    @UpdateDateColumn()
    updatedAt?: Date;
    @OneToMany(type => Address, address => address.user, { cascade: true })
    addresses: Address[]
}