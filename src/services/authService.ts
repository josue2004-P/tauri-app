import { axiosClient } from "../infrastructure/api/AxiosClient";
import type{ LoginDto, LoginResponse } from "../types/auth";
import Cookies from "js-cookie";

export async function loginRequest(data: LoginDto): Promise<LoginResponse> {
  const { data: response } = await axiosClient.post<LoginResponse>("/auth/login", data);
  return response;
}

export async function renewTokenRequest(): Promise<LoginResponse> {
  const access_token = Cookies.get("access_token") || "";

  const { data } = await axiosClient.get<LoginResponse>("/auth/renew-token", {
    headers: { 
      "Authorization": `Bearer ${access_token}`
     },
  });

  return data;
}