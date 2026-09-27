import Dexie, { type EntityTable } from "dexie";

import type { TVoid } from "@/types/entities/approval";
import type { TDrawerSession, TShortage } from "@/types/entities/cash";
import type { TContainerCount, TContainerMovement, TContainerType, TDepositEntry } from "@/types/entities/container";
import type { TCustomer } from "@/types/entities/customer";
import type { TEmployee } from "@/types/entities/employee";
import type { TExpense } from "@/types/entities/expense";
import type { TConsumable, TProductUsage, TStockEntry } from "@/types/entities/inventory";
import type { TInstallment, TLoan } from "@/types/entities/loan";
import type { TMaintenanceLog, TMeterReading } from "@/types/entities/maintenance";
import type { TPayment } from "@/types/entities/payment";
import type { TPayLine, TPayPlan, TPayRun } from "@/types/entities/payroll";
import type { TPrice, TProduct } from "@/types/entities/product";
import type { TWalkInSale } from "@/types/entities/sale";
import type { TSetting } from "@/types/entities/settings";
import type { TDelivery, TTrip, TTripLine } from "@/types/entities/trip";
import type { TLabTest, TWaterReading } from "@/types/entities/water";
import type { TOutboxEntry } from "@/types/sync";

export class WrsDb extends Dexie {
  settings!: EntityTable<TSetting>;
  employees!: EntityTable<TEmployee, "id">;
  payPlans!: EntityTable<TPayPlan>;
  customers!: EntityTable<TCustomer, "id">;
  products!: EntityTable<TProduct, "id">;
  prices!: EntityTable<TPrice>;
  containerTypes!: EntityTable<TContainerType, "code">;
  containerMovements!: EntityTable<TContainerMovement, "id">;
  trips!: EntityTable<TTrip, "id">;
  tripLines!: EntityTable<TTripLine>;
  deliveries!: EntityTable<TDelivery, "id">;
  walkInSales!: EntityTable<TWalkInSale, "id">;
  payments!: EntityTable<TPayment, "id">;
  depositEntries!: EntityTable<TDepositEntry, "id">;
  drawerSessions!: EntityTable<TDrawerSession, "id">;
  containerCounts!: EntityTable<TContainerCount, "id">;
  shortages!: EntityTable<TShortage, "id">;
  consumables!: EntityTable<TConsumable, "id">;
  productUsages!: EntityTable<TProductUsage>;
  stockEntries!: EntityTable<TStockEntry, "id">;
  meterReadings!: EntityTable<TMeterReading, "id">;
  maintenanceLogs!: EntityTable<TMaintenanceLog, "id">;
  waterReadings!: EntityTable<TWaterReading, "id">;
  labTests!: EntityTable<TLabTest, "id">;
  expenses!: EntityTable<TExpense, "id">;
  payRuns!: EntityTable<TPayRun, "id">;
  payLines!: EntityTable<TPayLine>;
  loans!: EntityTable<TLoan, "id">;
  installments!: EntityTable<TInstallment>;
  voids!: EntityTable<TVoid, "id">;
  outbox!: EntityTable<TOutboxEntry, "id">;

  constructor() {
    super("wrs");

    this.version(1).stores({
      settings: "[key+effectiveFrom]",
      employees: "id",
      payPlans: "[employeeId+effectiveFrom]",
      customers: "id",
      products: "id",
      prices: "[productId+effectiveFrom]",
      containerTypes: "code",
      containerMovements: "id, type, containerType, riderId, customerId",
      trips: "id, riderId, status",
      tripLines: "[tripId+productId]",
      deliveries: "id, tripId, customerId",
      walkInSales: "id, customerId",
      payments: "id, customerId",
      depositEntries: "id, customerId",
      drawerSessions: "id, cashierId",
      containerCounts: "id, date, type",
      shortages: "id, employeeId",
      consumables: "id",
      productUsages: "[productId+consumableId]",
      stockEntries: "id, consumableId",
      meterReadings: "id",
      maintenanceLogs: "id, consumableId",
      waterReadings: "id",
      labTests: "id",
      expenses: "id, category, date",
      payRuns: "id, status",
      payLines: "[runId+employeeId]",
      loans: "id, employeeId, status",
      installments: "[loanId+seq]",
      voids: "id, status",
      outbox: "id, entity, createdAt",
    });
  }
}

export const db = new WrsDb();
