import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    console.log('Auth Header:', authHeader);
    
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    console.log('JWT Guard Error:', err);
    console.log('JWT Guard User:', user);
    console.log('JWT Guard Info:', info);

    if (err || !user) {
      throw err || new UnauthorizedException('Invalid token or no token provided');
    }
    return user;
  }
}
