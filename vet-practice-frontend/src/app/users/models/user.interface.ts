import { Role } from './role.enum';

export interface User {
    id?: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    role: Role;
    imageUrl?: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
