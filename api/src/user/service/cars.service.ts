import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observable, from, map, switchMap, of, catchError, throwError, tap, throwIfEmpty } from 'rxjs';
import { Cars } from '../models/cars.interface';
import { CarsEntity } from '../models/cars.entity';
import * as bcrypt from 'bcrypt';
import { error } from 'console';
import { AuthService } from 'src/auth/services/auth.service';

@Injectable()
export class CarsService {

    constructor(
        @InjectRepository(CarsEntity)
        private readonly  carsRepository: Repository<CarsEntity>,
        private authService: AuthService
    ){
    }

    create(cars:Cars): Observable<Cars>{
        return from(this.carsRepository.save(cars));
    }

    findAll(): Observable<CarsEntity[]> {
        return from(this.carsRepository.find());
    }

    updateOne(id: number, cars: Cars): Observable<any>{
        return from(this.carsRepository.update(id, cars)).pipe(
            map(result => {
                if(result.affected === 0){
                    throw new NotFoundException('Id not found');
                }
                return { message: 'User updated successfully' };
            }),
            catchError(error => {
                if(error instanceof NotFoundException){
                    return throwError(() => Error('Not null violation'))
                }
                return throwError(() => new InternalServerErrorException('Error updating user'))
            })
        );
    }

    deleteOne(id: number): Observable<any>{
        return from(this.carsRepository.delete(id)).pipe(
            map(result => {
                if(result.affected === 0 ){
                    throw new NotFoundException('Id not found');
                }
                return { message: 'Car deleted successfully' };
            }),
            catchError(error => {
                if(error instanceof NotFoundException){
                    return throwError(() => error);
                }
                return throwError(() => new InternalServerErrorException('Error deleting cars'));
            })
        );
    }
}
