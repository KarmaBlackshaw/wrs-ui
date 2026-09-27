export type TTone = "ok" | "warn" | "danger" | "neutral" | "info";

export type TAlertTone = "warn" | "danger" | "info";

export type TAlert = {
  id: string;
  title: string;
  to: string;
  tone: TAlertTone;
};
