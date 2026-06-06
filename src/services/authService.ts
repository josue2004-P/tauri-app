import { invoke } from "@tauri-apps/api/core";
import type{ LoginDto, LoginResponse } from "../types/auth";

export async function loginRequest(data: LoginDto): Promise<LoginResponse> {
  try {
    const rustUser = await invoke<any>("login_user_command", {
      email: data.email,
      password: data.password,
    });

    return rustUser;

  } catch (error) {
    throw error;
  }
}

export async function renewTokenRequest(): Promise<LoginResponse> {
  const currentToken = localStorage.getItem("access_token") || "";
  const authorizationHeader = `Bearer ${currentToken}`;

  try {
    const rustResponse = await invoke<any>("renew_token_command", {
      authorization: authorizationHeader
    });

    return rustResponse;

  } catch (error) {
    localStorage.removeItem("access_token");
    throw error;
  }
}