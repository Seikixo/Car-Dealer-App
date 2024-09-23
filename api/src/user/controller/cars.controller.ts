import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Cars } from '../models/cars.interface';
import { Observable, map, from } from 'rxjs';
import { UserService } from '../service/user.service';
import { BadRequestException } from '@nestjs/common';
import { CreateUserDTO } from '../dto/create-user/create-user';
import { CarsEntity } from '../models/cars.entity';
import { CarsService } from '../service/cars.service';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService){}

  @Post('create-car')
  createCar(@Body() car: Cars): Observable<Cars> {
    return from (this.carsService.create(car));
  }

  @Get('get-all-cars')
  findAllCars(): Observable<CarsEntity[]> {
    return this.carsService.findAll();
  }

  @Put(':id')
  updateOne(@Param('id') id: string, @Body() cars: Cars): Observable<any>{
    const userId = Number(id);
    if (isNaN(userId)) {
        throw new BadRequestException('Invalid ID format');
    }
    return this.carsService.updateOne(userId, cars);
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string): Observable<Cars>{
    const userId = Number(id);
    if(isNaN(userId)){
      throw new BadRequestException('Invalid ID format');
    }
    return this.carsService.deleteOne(userId);
  }
}
