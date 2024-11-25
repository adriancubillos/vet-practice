import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module'; // Import User module
import { AuthService } from './auth.service'; // Import Auth service
import { JwtStrategy } from './jwt.strategy'; // Import Jwt strategy
import { PassportModule } from '@nestjs/passport'; // Import Passport module

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'yourSecretKey', // Replace with a secure key in production
      signOptions: { expiresIn: '60m' }, // Token expiration time
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService], // Export AuthService to be used in other modules
})
export class AuthModule {}