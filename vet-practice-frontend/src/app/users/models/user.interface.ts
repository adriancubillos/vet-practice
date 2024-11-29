export interface User {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    role: 'CLIENT' | 'VET' | 'ADMIN';
    createdAt?: Date;
    updatedAt?: Date;
}
