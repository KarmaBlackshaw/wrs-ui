import type { TAuthLogin, TLoginPayload } from "@/types/auth";

export function loginUser(payload: TLoginPayload) {
  return http.post<TAuthLogin>("/auth/login", payload);
}
