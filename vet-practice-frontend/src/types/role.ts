export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  VET = 'vet'
}

export const roleLabels: Record<Role, string> = {
  [Role.USER]: 'User',
  [Role.ADMIN]: 'Administrator',
  [Role.VET]: 'Veterinarian'
};

export function getRoleLabel(role: Role): string {
  return roleLabels[role] || role;
}

export function isValidRole(role: string): role is Role {
  return Object.values(Role).includes(role as Role);
}


// import { Role } from '../types/role';

// // In a select/dropdown component
// <select value={role} onChange={handleRoleChange}>
//   {Object.values(Role).map(role => (
//     <option key={role} value={role}>
//       {getRoleLabel(role)}
//     </option>
//   ))}
// </select>