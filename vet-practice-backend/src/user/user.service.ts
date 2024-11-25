import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const user = this.usersRepository.create({
      username: createUserDto.username,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async findUserByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async generateJwt(user: User): Promise<string> {
    const payload = { username: user.username, sub: user.id };
    return this.jwtService.sign(payload);
  }
}