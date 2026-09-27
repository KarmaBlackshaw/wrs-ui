import type { TPayLineDeduction } from "@/types/entities/payroll";

export const DEDUCTION_LABEL: Record<TPayLineDeduction["kind"], string> = {
  advance: "Advance",
  loan: "Loan installment",
  shortage: "Approved shortage",
};
