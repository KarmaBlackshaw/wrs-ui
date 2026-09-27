<script setup lang="ts">
import { ROLE_HOME } from "@/types/roles";
import { ROUTES } from "@/types/routes";

definePage({ meta: { title: "Home" } });

const authStore = useAuthStore();
const router = useRouter();

router.replace(authStore.activeRole ? ROLE_HOME[authStore.activeRole] : ROUTES.LOGIN);
</script>

<template>
  <div></div>
</template>
