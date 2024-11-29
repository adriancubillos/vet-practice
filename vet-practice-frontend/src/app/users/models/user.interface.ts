export interface User {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    role: 'user' | 'vet' | 'admin';
    imageUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
