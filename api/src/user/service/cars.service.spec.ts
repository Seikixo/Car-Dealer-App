import { Test, TestingModule } from '@nestjs/testing';
import { CarsService } from './cars.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarsEntity } from '../models/cars.entity';
import { AuthService } from 'src/auth/services/auth.service';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Cars } from '../models/cars.interface';

describe('CarsService', () => {
    let service: CarsService;
    let carsRepository: Repository<CarsEntity>;
    let authService: AuthService;

    const mockCarsRepository = {
        save: jest.fn(),
        find: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    const mockAuthService = {}; // Mock AuthService if used

    const mockCars: Cars[] = [
        {
            make: 'Toyota',
            description: 'Reliable sedan',
            model: 'Camry',
            year: 2020,
            price: 24000,
        },
        {
            make: 'Honda',
            description: 'Compact SUV',
            model: 'CR-V',
            year: 2021,
            price: 28000,
        },
        {
            make: 'Ford',
            description: 'Pickup truck',
            model: 'F-150',
            year: 2019,
            price: 30000,
        },
        {
            make: 'Tesla',
            description: 'Electric sedan',
            model: 'Model 3',
            year: 2022,
            price: 39999,
        },
    ];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CarsService,
                {
                    provide: getRepositoryToken(CarsEntity),
                    useValue: mockCarsRepository,
                },
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        service = module.get<CarsService>(CarsService);
        carsRepository = module.get<Repository<CarsEntity>>(getRepositoryToken(CarsEntity));
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    describe('create', () => {
        it('should successfully create a car', (done) => {
            const carData = mockCars[0]; // Use the first car in mockCars
            mockCarsRepository.save.mockReturnValueOnce(Promise.resolve(carData));

            service.create(carData).subscribe((result) => {
                expect(result).toEqual(carData);
                expect(mockCarsRepository.save).toHaveBeenCalledWith(carData);
                done();
            });
        });
    });

    describe('findAll', () => {
        it('should return an array of cars', (done) => {
            mockCarsRepository.find.mockReturnValueOnce(Promise.resolve(mockCars));

            service.findAll().subscribe((cars) => {
                expect(cars).toEqual(mockCars);
                expect(mockCarsRepository.find).toHaveBeenCalled();
                done();
            });
        });
    });

    describe('updateOne', () => {
        it('should successfully update a car', (done) => {
            const carData = mockCars[0]; // Use the first car in mockCars
            const id = 1;
            mockCarsRepository.update.mockReturnValueOnce(Promise.resolve({ affected: 1 }));

            service.updateOne(id, carData).subscribe((response) => {
                expect(response).toEqual({ message: 'User updated successfully' });
                expect(mockCarsRepository.update).toHaveBeenCalledWith(id, carData);
                done();
            });
        });

        it('should throw NotFoundException if car is not found', (done) => {
            const carData = mockCars[0]; // Use the first car in mockCars
            const id = 999; // Assuming this ID does not exist
            mockCarsRepository.update.mockReturnValueOnce(Promise.resolve({ affected: 0 }));

            service.updateOne(id, carData).subscribe({
                next: () => {
                    // should not reach here
                    done.fail('Expected NotFoundException');
                },
                error: (error) => {
                    expect(error).toBeInstanceOf(NotFoundException);
                    done();
                },
            });
        });

        it('should throw InternalServerErrorException on other errors', (done) => {
            const carData = mockCars[0]; // Use the first car in mockCars
            const id = 1;
            mockCarsRepository.update.mockReturnValueOnce(Promise.reject(new Error('Database error')));

            service.updateOne(id, carData).subscribe({
                next: () => {
                    // should not reach here
                    done.fail('Expected InternalServerErrorException');
                },
                error: (error) => {
                    expect(error).toBeInstanceOf(InternalServerErrorException);
                    done();
                },
            });
        });
    });

    describe('deleteOne', () => {
        it('should successfully delete a car', (done) => {
            const id = 1;
            mockCarsRepository.delete.mockReturnValueOnce(Promise.resolve({ affected: 1 }));

            service.deleteOne(id).subscribe((response) => {
                expect(response).toEqual({ message: 'Car deleted successfully' });
                expect(mockCarsRepository.delete).toHaveBeenCalledWith(id);
                done();
            });
        });

        it('should throw NotFoundException if car is not found', (done) => {
            const id = 999; // Assuming this ID does not exist
            mockCarsRepository.delete.mockReturnValueOnce(Promise.resolve({ affected: 0 }));

            service.deleteOne(id).subscribe({
                next: () => {
                    // should not reach here
                    done.fail('Expected NotFoundException');
                },
                error: (error) => {
                    expect(error).toBeInstanceOf(NotFoundException);
                    done();
                },
            });
        });

        it('should throw InternalServerErrorException on other errors', (done) => {
            const id = 1;
            mockCarsRepository.delete.mockReturnValueOnce(Promise.reject(new Error('Database error')));

            service.deleteOne(id).subscribe({
                next: () => {
                    // should not reach here
                    done.fail('Expected InternalServerErrorException');
                },
                error: (error) => {
                    expect(error).toBeInstanceOf(InternalServerErrorException);
                    done();
                },
            });
        });
    });
});
