// src/application/auth/RenewTokenUseCase.ts
import { renewTokenRequest } from "../../services/authService";
import type { LoginResponse } from "../../types/auth";

export class RenewTokenUseCase {
  async execute(): Promise<LoginResponse> {
      return await renewTokenRequest();
  }
}