import { Role } from 'src/users/entities/user-role';

export interface Payload {
  id: number;
  name: string;
  email: string;
  point: number;
  role: Role;
}
