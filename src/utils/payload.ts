import { Role } from 'src/users/entities/user.entity';

export interface Payload {
  id: number;
  name: string;
  email: string;
  point: number;
  role: Role;
}
