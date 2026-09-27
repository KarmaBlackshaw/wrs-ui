import type { Middleware } from "@/types/middleware";
import { ROUTES } from "@/types/routes";

// Protected-by-default: every route requires auth except this allowlist.
const PUBLIC_PATHS = new Set<string>([ROUTES.LOGIN]);

const auth: Middleware = (to) => {
  const isPublic = PUBLIC_PATHS.has(to.path);
  const authStore = useAuthStore();

  if (isPublic && authStore.isAuthenticated) {
    return ROUTES.HOME;
  }

  if (!isPublic && !authStore.isAuthenticated) {
    return { path: ROUTES.LOGIN, query: { redirect: to.fullPath } };
  }
};

export default auth;
