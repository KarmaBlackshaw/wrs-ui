import type { TLoginPayload } from "@/types/auth";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const token = ref<string | null>(null);

    const isAuthenticated = computed(() => token.value != null);

    async function login(payload: TLoginPayload) {
      const { token: accessToken } = await loginUser(payload);

      token.value = accessToken;
    }

    function logout() {
      token.value = null;
    }

    return { token, isAuthenticated, login, logout };
  },
  { persist: { pick: ["token"] } }
);
