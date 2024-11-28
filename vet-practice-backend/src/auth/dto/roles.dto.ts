import { Role } from '../enums/role.enum';

export class RoleInfo {
  value: Role;
  label: string;
}

export const roleLabels: Record<Role, string> = {
  [Role.USER]: 'User',
  [Role.ADMIN]: 'Administrator',
  [Role.VET]: 'Veterinarian'
};
