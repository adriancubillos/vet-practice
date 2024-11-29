export interface User {
    id?: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    role: 'user' | 'vet' | 'admin';
    imageUrl?: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
