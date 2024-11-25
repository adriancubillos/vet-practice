import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // Your PostgreSQL host
      port: 5432, // Default PostgreSQL port
      username: 'vet_user', // Replace with your PostgreSQL username
      password: 'yourpassword', // Replace with your PostgreSQL password
      database: 'vet_practice_db', // Replace with your database name
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Path to your entities
      synchronize: true, // Set to false in production
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
