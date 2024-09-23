import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    password: string;

    @Column({ nullable: true })  
    firstname: string;

    @Column({ nullable: true })  
    lastname: string;

    @Column({ unique: true, nullable: true })  
    email: string;

    @Column({ default: 1 })  // You can set a default value
    isActive: number;
}

