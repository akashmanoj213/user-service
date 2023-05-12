import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Address } from './entities/address.entity';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirestoreModule } from 'src/providers/firestore/firestore.module';

@Module({
  imports: [TypeOrmModule.forFeature([Address, User]), FirestoreModule],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
