import { type DBSchema, openDB } from "idb";

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

export interface WrsSchema extends DBSchema {
  settings: { key: [string, string]; value: TSetting };
  employees: { key: string; value: TEmployee };
  payPlans: { key: [string, string]; value: TPayPlan };
  customers: { key: string; value: TCustomer };
  products: { key: string; value: TProduct };
  prices: { key: [string, string]; value: TPrice };
  containerTypes: { key: TContainerType["code"]; value: TContainerType };
  containerMovements: {
    key: string;
    value: TContainerMovement;
    indexes: { type: TContainerMovement["type"]; containerType: TContainerMovement["containerType"]; riderId: string; customerId: string };
  };
  trips: { key: string; value: TTrip; indexes: { riderId: string; status: TTrip["status"] } };
  tripLines: { key: [string, string]; value: TTripLine };
  deliveries: { key: string; value: TDelivery; indexes: { tripId: string; customerId: string } };
  walkInSales: { key: string; value: TWalkInSale; indexes: { customerId: string } };
  payments: { key: string; value: TPayment; indexes: { customerId: string } };
  depositEntries: { key: string; value: TDepositEntry; indexes: { customerId: string } };
  drawerSessions: { key: string; value: TDrawerSession; indexes: { cashierId: string } };
  containerCounts: { key: string; value: TContainerCount; indexes: { date: string; type: TContainerCount["type"] } };
  shortages: { key: string; value: TShortage; indexes: { employeeId: string } };
  consumables: { key: string; value: TConsumable };
  productUsages: { key: [string, string]; value: TProductUsage };
  stockEntries: { key: string; value: TStockEntry; indexes: { consumableId: string } };
  meterReadings: { key: string; value: TMeterReading };
  maintenanceLogs: { key: string; value: TMaintenanceLog; indexes: { consumableId: string } };
  waterReadings: { key: string; value: TWaterReading };
  labTests: { key: string; value: TLabTest };
  expenses: { key: string; value: TExpense; indexes: { category: string; date: string } };
  payRuns: { key: string; value: TPayRun; indexes: { status: TPayRun["status"] } };
  payLines: { key: [string, string]; value: TPayLine };
  loans: { key: string; value: TLoan; indexes: { employeeId: string; status: TLoan["status"] } };
  installments: { key: [string, number]; value: TInstallment };
  voids: { key: string; value: TVoid; indexes: { status: TVoid["status"] } };
  outbox: { key: string; value: TOutboxEntry; indexes: { entity: string; createdAt: string } };
}

export const db = openDB<WrsSchema>("wrs", 1, {
  upgrade(db) {
    db.createObjectStore("settings", { keyPath: ["key", "effectiveFrom"] });
    db.createObjectStore("employees", { keyPath: "id" });
    db.createObjectStore("payPlans", { keyPath: ["employeeId", "effectiveFrom"] });
    db.createObjectStore("customers", { keyPath: "id" });
    db.createObjectStore("products", { keyPath: "id" });
    db.createObjectStore("prices", { keyPath: ["productId", "effectiveFrom"] });
    db.createObjectStore("containerTypes", { keyPath: "code" });

    const containerMovements = db.createObjectStore("containerMovements", { keyPath: "id" });
    containerMovements.createIndex("type", "type");
    containerMovements.createIndex("containerType", "containerType");
    containerMovements.createIndex("riderId", "riderId");
    containerMovements.createIndex("customerId", "customerId");

    const trips = db.createObjectStore("trips", { keyPath: "id" });
    trips.createIndex("riderId", "riderId");
    trips.createIndex("status", "status");

    db.createObjectStore("tripLines", { keyPath: ["tripId", "productId"] });

    const deliveries = db.createObjectStore("deliveries", { keyPath: "id" });
    deliveries.createIndex("tripId", "tripId");
    deliveries.createIndex("customerId", "customerId");

    db.createObjectStore("walkInSales", { keyPath: "id" }).createIndex("customerId", "customerId");
    db.createObjectStore("payments", { keyPath: "id" }).createIndex("customerId", "customerId");
    db.createObjectStore("depositEntries", { keyPath: "id" }).createIndex("customerId", "customerId");
    db.createObjectStore("drawerSessions", { keyPath: "id" }).createIndex("cashierId", "cashierId");

    const containerCounts = db.createObjectStore("containerCounts", { keyPath: "id" });
    containerCounts.createIndex("date", "date");
    containerCounts.createIndex("type", "type");

    db.createObjectStore("shortages", { keyPath: "id" }).createIndex("employeeId", "employeeId");
    db.createObjectStore("consumables", { keyPath: "id" });
    db.createObjectStore("productUsages", { keyPath: ["productId", "consumableId"] });
    db.createObjectStore("stockEntries", { keyPath: "id" }).createIndex("consumableId", "consumableId");
    db.createObjectStore("meterReadings", { keyPath: "id" });
    db.createObjectStore("maintenanceLogs", { keyPath: "id" }).createIndex("consumableId", "consumableId");
    db.createObjectStore("waterReadings", { keyPath: "id" });
    db.createObjectStore("labTests", { keyPath: "id" });

    const expenses = db.createObjectStore("expenses", { keyPath: "id" });
    expenses.createIndex("category", "category");
    expenses.createIndex("date", "date");

    db.createObjectStore("payRuns", { keyPath: "id" }).createIndex("status", "status");
    db.createObjectStore("payLines", { keyPath: ["runId", "employeeId"] });

    const loans = db.createObjectStore("loans", { keyPath: "id" });
    loans.createIndex("employeeId", "employeeId");
    loans.createIndex("status", "status");

    db.createObjectStore("installments", { keyPath: ["loanId", "seq"] });
    db.createObjectStore("voids", { keyPath: "id" }).createIndex("status", "status");

    const outbox = db.createObjectStore("outbox", { keyPath: "id" });
    outbox.createIndex("entity", "entity");
    outbox.createIndex("createdAt", "createdAt");
  },
});
