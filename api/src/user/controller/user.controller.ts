import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { User } from '../models/user.interface';
import { Observable, map, from } from 'rxjs';
import { UserService } from '../service/user.service';
import { BadRequestException } from '@nestjs/common';
import { CreateUserDTO } from '../dto/create-user/create-user';

@Controller('user')
export class UserController {

    constructor(
        private userService: UserService
    ){}

    @Post('register')
    register(@Body() createUserDto: CreateUserDTO): Observable<User> {
        const user: User = {
            ...createUserDto,
            isActive: createUserDto.isActive ?? 1,  
        };
        return this.userService.create(user);
    }

    @Post('login')
    login(@Body() user: User): Observable<Object> {
        return this.userService.loginUser(user).pipe(
            map((jwt: string) => {
                return { accessToken: jwt, success: true };
            })
        );
    }

    @Get(':id')
    findOne(@Param('id') id: string): Observable<User>{
        const userId = Number(id);
        if (isNaN(userId)) {
            throw new BadRequestException('Invalid ID format');
        }
        return this.userService.findOne(userId);
    }

    @Get()
    findaAll(): Observable<User[]>{
        return this.userService.findAll();
    }

    @Delete(':id')
    deleteOne(@Param('id') id: string): Observable<User>{
        const userId = Number(id);
        if (isNaN(userId)) {
            throw new BadRequestException('Invalid ID format');
        }
        return this.userService.deleteOne(userId);
    }

    @Put(':id')
    updateOne(@Param('id') id: string, @Body() user: User): Observable<any>{
        const userId = Number(id);
        if (isNaN(userId)) {
            throw new BadRequestException('Invalid ID format');
        }
        return this.userService.updateOne(userId, user);
    }

}
