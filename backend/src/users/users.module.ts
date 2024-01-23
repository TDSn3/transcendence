import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule} from '@nestjs/typeorm';

@Module({
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'db',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'postgres',
    entities: [],
    synchronize: true,
    autoLoadEntities: true,
  }),
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
