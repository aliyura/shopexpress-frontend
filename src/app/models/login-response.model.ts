import { User } from './user.model';
export class LoginResponse {
  bearer: string;
  user: User;
}
