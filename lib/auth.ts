import Cookies from "js-cookie";
import api from "./api";
import {
  AuthData,
  LoginPayload,
  RegisterPayload,
  User,
} from "@/types/auth";

export const authService = {
  async login(payload: LoginPayload): Promise<AuthData> {
    const response = await api.post<AuthData>(
      "/auth/login",
      payload
    );

    Cookies.set("access_token", response.data.accessToken, {
      expires: 7,
    });

    return response.data;
  },

  async register(payload: RegisterPayload): Promise<AuthData> {
    const response = await api.post<AuthData>(
      "/auth/register",
      payload
    );
    return response.data;
  },

  async me(): Promise<User> {
    const response = await api.get<User>("/auth/me");
    return response.data;
  },

  logout() {
    Cookies.remove("access_token");

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },

  getToken(): string | undefined {
    return Cookies.get("access_token");
  },

  isAuthenticated(): boolean {
    return !!Cookies.get("access_token");
  },
};