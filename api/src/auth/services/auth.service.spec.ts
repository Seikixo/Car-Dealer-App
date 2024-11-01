import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/models/user.interface';

// Mock bcrypt for testing
const bcrypt = {
    hash: jest.fn(),
    compare: jest.fn(),
};

describe('AuthService', () => {
    let authService: AuthService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: JwtService,
                    useValue: {
                        signAsync: jest.fn(),
                    },
                },
                {
                    provide: 'bcrypt',
                    useValue: bcrypt,
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);
    });

    describe('generateJWT', () => {
      it('should generate a JWT token', async () => {
          const user: User = {
              id: 1,
              firstname: 'John',
              lastname: 'Doe',
              email: 'test@example.com',
              isActive: 1,
          };
          const token = 'testToken';
          jest.spyOn(jwtService, 'signAsync').mockResolvedValue(token);
  
          authService.generateJWT(user).subscribe(result => {
              expect(result).toBe(token);
              expect(jwtService.signAsync).toHaveBeenCalledWith({ user });
          });
      });
  });
  

    describe('hashPassword', () => {
        it('should hash the password', async () => {
            const password = 'password123';
            const hashedPassword = 'hashedPassword';
            bcrypt.hash.mockReturnValue(Promise.resolve(hashedPassword));

            authService.hashPassword(password).subscribe(result => {
                expect(result).toBe(hashedPassword);
                expect(bcrypt.hash).toHaveBeenCalledWith(password, 12);
            });
        });
    });

    describe('comparePassword', () => {
        it('should compare the password with the hash', async () => {
            const newPassword = 'password123';
            const passwordHash = 'hashedPassword';
            bcrypt.compare.mockReturnValue(Promise.resolve(true));

            authService.comparePassword(newPassword, passwordHash).subscribe(result => {
                expect(result).toBe(true);
                expect(bcrypt.compare).toHaveBeenCalledWith(newPassword, passwordHash);
            });
        });
    });
});
