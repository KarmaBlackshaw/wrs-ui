import { ROUTES } from "@/types/routes";

export type TRole = "owner" | "cashier" | "rider" | "washer" | "helper";

export const ROLE_HOME: Record<TRole, string> = {
  owner: ROUTES.OWNER_HOME,
  cashier: ROUTES.CASHIER_HOME,
  rider: ROUTES.RIDER_HOME,
  washer: ROUTES.STAFF_LOGS,
  helper: ROUTES.STAFF_LOGS,
};

export const ROLE_LABEL: Record<TRole, string> = {
  owner: "Owner",
  cashier: "Cashier",
  rider: "Rider",
  washer: "Washer",
  helper: "Helper",
};
