<script setup lang="ts">
import { ROUTES } from "@/types/routes";

const authStore = useAuthStore();
const router = useRouter();

function logout() {
  authStore.logout();
  router.push(ROUTES.LOGIN);
}
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-slate-50 text-slate-900">
    <header class="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <RouterLink :to="ROUTES.HOME" class="text-lg font-semibold">WRS</RouterLink>
      <button type="button" class="text-sm text-slate-600 hover:text-slate-900" @click="logout">Log out</button>
    </header>
    <main class="flex-1 p-6">
      <RouterView />
    </main>
  </div>
</template>
