import { Role } from './role';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterUserDto {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  role?: Role;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  phoneNumber?: string;
  role?: Role;
}
