import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observable, from, map, switchMap, of, catchError, throwError, tap, throwIfEmpty } from 'rxjs';
import { User } from '../models/user.interface';
import { AuthService } from 'src/auth/services/auth.service';

@Injectable()
export class UserService {

    constructor( 
        @InjectRepository(UserEntity)
        private readonly  userRepository: Repository<UserEntity>,
        private authService: AuthService
    ){}


    create(user:User): Observable<User>{
        if( !user.password || !user.email || !user.firstname || !user.lastname){
            return throwError(() => new BadRequestException('Email and Password must not be null'));
        }
        return this.authService.hashPassword(user.password).pipe( 
            switchMap((passwordHash: string) => { 
                const newUser = new UserEntity();
                newUser.password = passwordHash;
                newUser.firstname = user.firstname;
                newUser.lastname = user.lastname;
                newUser.email = user.email;
                newUser.isActive = user.isActive ?? 1;

                return from(this.userRepository.save(newUser)).pipe( 
                    map((savedUser:User) =>{
                        const {password, ...result} = savedUser;
                        return result;
                    }),
                )
            }),
            catchError(() => {
                return throwError(() => new InternalServerErrorException('Error creating user'));
            })
        )
    }

    findAll(): Observable<User[]>{
        return from(this.userRepository.find()).pipe(
            catchError(error => {
                return throwError(() => new InternalServerErrorException('Error retrieving Users'));
            })
        );
    }

    findOne(id: number): Observable<User>{
        return from(this.userRepository.findOne({ where: {id} })).pipe(
            map((user: User) =>{
                if(!user){
                    throw new NotFoundException('Id not found');
                }
                const{password, ...result} = user; //Object Destructuring
                return result;
            })
        )
    }

    deleteOne(id: number): Observable<any>{
        return from(this.userRepository.delete(id)).pipe(
            map(result => {
                if(result.affected === 0 ){
                    throw new NotFoundException('Id not found');
                }
                return { message: 'User deleted successfully' };
            }),
            catchError(error => {
                if(error instanceof NotFoundException){
                    return throwError(() => error);
                }
                return throwError(() => new InternalServerErrorException('Error deleting user'));
            })
        );
    }

    updateOne(id: number, user: User): Observable<any>{
        return from(this.userRepository.update(id, user)).pipe(
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

    loginUser(user: User): Observable<string> {
        return this.validateUser(user.email, user.password).pipe(
            switchMap((user: User) => {
                if (user) {
                    return this.authService.generateJWT(user).pipe(
                        map((jwt: string) => jwt)
                    );
                } 
            }),
            catchError(error => {
                return throwError(() => new Error('Wrong Credentials'));
            })
        );
    }

    validateUser(email: string, password: string): Observable<User> {
        return this.findByEmail(email).pipe(
            switchMap((user: User) => { // Allow null if user not found
                if (user) {
                    return this.authService.comparePassword(password, user.password).pipe(
                        map((match: boolean) => {
                            if (match) {
                                const { password, ...result } = user;
                                return result as User; // Correctly return the User type
                            } else {
                                throw new Error('Invalid password');
                            }
                        })
                    );
                } else {
                    throw new Error('User not found'); // Handle user not found
                }
            }),
            catchError(error => {
                return throwError(() => new Error('Wrong credentials'));
            })
        );
    }
    

    findByEmail(email: string): Observable<User> {
        return from(this.userRepository.findOne({ where: { email } })).pipe(
          map((userEntity: UserEntity | null) => {
            if (userEntity === null) {
              throw new Error(`User with email ${email} not found.`);
            }
            return userEntity; // Assuming userEntity can be directly assigned to User
          }),
          catchError((error) => {
            // Handle errors here if necessary
            throw new Error('Error retrieving user: ' + error.message);
          })
        );
      }


    /*validateUser(username: string, pass: string): Observable<User>{
        return this.findOne(username).pipe(
            switchMap(user => {
                if (!user) return of (null);
                return from (bcrypt.compare(pass, user.password)).pipe(
                    map(isMatch => {
                        if (isMatch){
                            const { password, ...result } = user;
                            return result
                        }
                        return null;
                    })
                )
            })
        )
    }

    login(user: User): Observable <{access_token: string}>{
        const payload = { username: user.username, id: user.id, role: user.role.name}
        return of ({
            access_token: this.jwtService.sign(payload)
        })
    }*/
}
