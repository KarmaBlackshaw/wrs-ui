<script setup lang="ts">
import { PhSignOut, PhTranslate } from "@phosphor-icons/vue";

import { ROUTES } from "@/types/routes";
import { ROLE_HOME, ROLE_LABEL } from "@/types/roles";
import type { TRole } from "@/types/roles";

const { t, locale } = useI18n();
const authStore = useAuthStore();
const router = useRouter();

const activeRole = computed({
  get: () => authStore.activeRole,
  set: (role: TRole | null) => {
    if (!role) {
      return;
    }

    authStore.switchRole(role);
    router.push(ROLE_HOME[role]);
  },
});

function toggleLanguage() {
  locale.value = locale.value === "en" ? "fil" : "en";
}

function logout() {
  authStore.logout();
  router.push(ROUTES.LOGIN);
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <UiSelect
      v-if="authStore.user && authStore.user.roles.length > 1"
      v-model="activeRole"
      :label="t('common.switchRole')"
      :options="authStore.user.roles.map((role) => ({ value: role, label: ROLE_LABEL[role] }))"
    />
    <UiButton variant="secondary" block @click="toggleLanguage">
      <PhTranslate class="size-5" />
      {{ t("common.language") }}: {{ locale === "en" ? "English" : "Filipino" }}
    </UiButton>
    <UiButton variant="ghost" block @click="logout">
      <PhSignOut class="size-5" />
      {{ t("common.logout") }}
    </UiButton>
  </div>
</template>
