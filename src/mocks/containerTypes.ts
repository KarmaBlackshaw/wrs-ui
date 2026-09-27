import type { TContainerType } from "@/types/entities/container";

export const containerTypes: TContainerType[] = [
  { code: "round", deliverable: true, depositAmount: 20000 },
  { code: "slim", deliverable: false, depositAmount: 15000 },
];
