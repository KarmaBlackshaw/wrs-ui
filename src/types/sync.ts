export type TSyncStatus = "synced" | "pending" | "offline" | "rejected";

export type TRejectedEntry = {
  id: string;
  entity: string;
  reason: string;
};

export type TOutboxEntry = {
  id: string;
  entity: string;
  payload: unknown;
  attempts: number;
  lastError?: string;
  createdAt: string;
};
