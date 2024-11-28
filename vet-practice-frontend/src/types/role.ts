export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  VET = 'vet'
}

export interface RoleInfo {
  value: Role;
  label: string;
}

export function isValidRole(role: string): role is Role {
  return Object.values(Role).includes(role as Role);
}

// Example usage in a component:
/*
import { Role, RoleInfo } from '../types/role';
import { useState, useEffect } from 'react';

function RoleSelector({ value, onChange }: { value: Role; onChange: (role: Role) => void }) {
  const [roles, setRoles] = useState<RoleInfo[]>([]);

  useEffect(() => {
    fetch('/auth/roles')
      .then(res => res.json())
      .then(data => setRoles(data));
  }, []);

  return (
    <select 
      value={value} 
      onChange={e => onChange(e.target.value as Role)}
    >
      {roles.map(role => (
        <option key={role.value} value={role.value}>
          {role.label}
        </option>
      ))}
    </select>
  );
}
*/