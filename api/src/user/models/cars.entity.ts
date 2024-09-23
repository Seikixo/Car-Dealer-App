import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CarsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    make: string;

    @Column({ unique: true, nullable: true })  
    model: string;

    @Column()
    description: string;

    @Column()
    year: number;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

}

