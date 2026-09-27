<script setup lang="ts">
import { ROUTES } from "@/types/routes";

definePage({ meta: { layout: "Auth", title: "Log in" } });

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const email = ref("");
const password = ref("");
const error = ref("");
const isSubmitting = ref(false);

async function submit() {
  error.value = "";
  isSubmitting.value = true;

  try {
    await authStore.login({ email: email.value, password: password.value });

    const redirect = route.query.redirect;

    router.push(typeof redirect === "string" && redirect.startsWith("/") ? redirect : ROUTES.HOME);
  } catch {
    error.value = "Invalid email or password.";
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <form class="flex w-full max-w-sm flex-col gap-4 rounded-xl bg-white p-8 shadow-sm" @submit.prevent="submit">
    <h1 class="text-xl font-semibold">Log in</h1>
    <label class="flex flex-col gap-1 text-sm">
      Email
      <input v-model="email" type="email" required autocomplete="email" class="rounded-md border border-slate-300 px-3 py-2" />
    </label>
    <label class="flex flex-col gap-1 text-sm">
      Password
      <input v-model="password" type="password" required autocomplete="current-password" class="rounded-md border border-slate-300 px-3 py-2" />
    </label>
    <p v-if="error" role="alert" class="text-sm text-red-600">{{ error }}</p>
    <button type="submit" :disabled="isSubmitting" class="rounded-md bg-slate-900 py-2 font-medium text-white disabled:opacity-50">Log in</button>
  </form>
</template>
