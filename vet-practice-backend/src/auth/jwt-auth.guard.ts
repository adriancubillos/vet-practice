import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      if (info?.message === 'No auth token') {
        throw new UnauthorizedException('No authentication token provided');
      }
      if (info?.message === 'jwt expired') {
        throw new UnauthorizedException('Authentication token has expired');
      }
      throw err || new UnauthorizedException('Invalid authentication token');
    }

    // Ensure user has required fields
    if (!user.id || !user.email || !user.role) {
      throw new UnauthorizedException('Invalid user data in token');
    }

    return user;
  }
}
