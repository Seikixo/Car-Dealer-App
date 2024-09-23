import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { CarsController } from './controller/cars.controller';
import { CarsService } from './service/cars.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './models/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CarsEntity } from './models/cars.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([UserEntity, CarsEntity]),
    AuthModule
  ],
  providers: [UserService, CarsService],
  controllers: [UserController, CarsController]
})
export class UserModule {}
