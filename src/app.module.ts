import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { Address } from './users/entities/address.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [UsersModule, TypeOrmModule.forRoot({
    type: 'postgres',
    host: '/cloudsql/pruinhlth-nprd-dev-scxlyx-7250:asia-south1:sahi-dev',
    // host: 'localhost',
    port: 5432,
    username: 'sahi-user',
    password: 'qwerty',
    // username: 'postgres',
    // password: 'qwerty',
    database: 'Users',
    // entities: [User, Address],
    autoLoadEntities: true,
    synchronize: true
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
