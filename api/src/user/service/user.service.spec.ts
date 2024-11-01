import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserEntity } from '../models/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/services/auth.service';
import { of, throwError } from 'rxjs';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

describe('UserService', () => {
    let userService: UserService;
    let userRepository: Repository<UserEntity>;
    let authService: AuthService;

    const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'password123',
        firstname: 'John',
        lastname: 'Doe',
        isActive: 1,
    };

    const mockUserRepository = {
        save: jest.fn().mockResolvedValue(mockUser),
        find: jest.fn().mockResolvedValue([mockUser]),
        findOne: jest.fn().mockResolvedValue(mockUser),
        delete: jest.fn().mockResolvedValue({ affected: 1 }),
        update: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    const mockAuthService = {
        hashPassword: jest.fn().mockReturnValue(of('hashedPassword')),
        generateJWT: jest.fn().mockReturnValue(of('jwtToken')),
        comparePassword: jest.fn().mockReturnValue(of(true)),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(UserEntity),
                    useValue: mockUserRepository,
                },
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        userService = module.get<UserService>(UserService);
        userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
        authService = module.get<AuthService>(AuthService);
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    it('should be defined', () => {
        expect(userService).toBeDefined();
    });

    describe('create', () => {
        it('should successfully create a user', (done) => {
            userService.create(mockUser).subscribe((user) => {
                expect(user).toEqual(mockUser);
                expect(mockAuthService.hashPassword).toHaveBeenCalledWith(mockUser.password);
                expect(mockUserRepository.save).toHaveBeenCalledWith(expect.any(UserEntity));
                done();
            });
        });

        it('should throw BadRequestException if required fields are missing', (done) => {
            const incompleteUser = { ...mockUser, password: null };

            userService.create(incompleteUser).subscribe({
                error: (error) => {
                    expect(error).toBeInstanceOf(BadRequestException);
                    expect(error.message).toBe('Email and Password must not be null');
                    done();
                },
            });
        });

        it('should throw InternalServerErrorException on error', (done) => {
            mockUserRepository.save.mockRejectedValue(new Error());

            userService.create(mockUser).subscribe({
                error: (error) => {
                    expect(error).toBeInstanceOf(InternalServerErrorException);
                    expect(error.message).toBe('Error creating user');
                    done();
                },
            });
        });
    });

    describe('findAll', () => {
        it('should return an array of users', (done) => {
            userService.findAll().subscribe((users) => {
                expect(users).toEqual([mockUser]);
                expect(mockUserRepository.find).toHaveBeenCalled();
                done();
            });
        });

        it('should throw InternalServerErrorException on error', (done) => {
            mockUserRepository.find.mockRejectedValue(new Error());

            userService.findAll().subscribe({
                error: (error) => {
                    expect(error).toBeInstanceOf(InternalServerErrorException);
                    expect(error.message).toBe('Error retrieving Users');
                    done();
                },
            });
        });
    });

    describe('findOne', () => {
        it('should return a user by id', (done) => {
            userService.findOne(1).subscribe((user) => {
                expect(user).toEqual(mockUser);
                expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
                done();
            });
        });

        it('should throw NotFoundException if user does not exist', (done) => {
            mockUserRepository.findOne.mockResolvedValue(null);

            userService.findOne(1).subscribe({
                error: (error) => {
                    expect(error).toBeInstanceOf(NotFoundException);
                    expect(error.message).toBe('Id not found');
                    done();
                },
            });
        });
    });

    describe('loginUser', () => {
        it('should login a user and return a JWT', (done) => {
            userService.loginUser(mockUser).subscribe((token) => {
                expect(token).toEqual('jwtToken');
                expect(mockAuthService.comparePassword).toHaveBeenCalledWith(mockUser.password, mockUser.password);
                done();
            });
        });

        it('should throw an error if user not found', (done) => {
            mockAuthService.comparePassword.mockReturnValue(of(false));

            userService.loginUser(mockUser).subscribe({
                error: (error) => {
                    expect(error).toEqual(new Error('Wrong Credentials'));
                    done();
                },
            });
        });
    });
});
