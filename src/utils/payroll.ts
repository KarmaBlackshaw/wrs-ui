import sumBy from "lodash/sumBy";

import type { TPayLine } from "@/types/entities/payroll";

export function totalDeductions(line: TPayLine) {
  return sumBy(line.deductions, "amount");
}
