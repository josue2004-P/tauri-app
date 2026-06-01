import type { User } from "./User";
export interface AuthState {
  id?: string;
  token?: string;
  user: User | null;
  isLoggedIn: boolean;
  error: string | null;
  checking: boolean;
}
