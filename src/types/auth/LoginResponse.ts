import type { User } from "./User";
export interface LoginResponse {
  access_token: string; 
  user: User;
}