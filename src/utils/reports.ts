import startCase from "lodash/startCase";

import { consumables } from "@/mocks/consumables";
import { containerCounts, containerHoldings } from "@/mocks/containers";
import { customers } from "@/mocks/customers";
import { drawerSessions } from "@/mocks/drawerSessions";
import { expenses } from "@/mocks/expenses";
import { installments, loans } from "@/mocks/loans";
import { maintenanceLogs } from "@/mocks/maintenance";
import { meterReadings } from "@/mocks/meterReadings";
import { payLines, payRuns } from "@/mocks/payroll";
import { shortages } from "@/mocks/shortages";
import { deliveries, trips } from "@/mocks/trips";
import { waterReadings } from "@/mocks/waterQuality";
import { walkInSales } from "@/mocks/walkInSales";
import type { TReportTable } from "@/types";

const { employeeName } = useEmployeeLookup();
const { customerName } = useCustomerLookup();

export const REPORTS = [
  {
    slug: "rider-reconciliation",
    title: "Rider reconciliation",
    description: "Loaded, delivered, returned and cash per trip",
    preview: ["rider", "delivered", "cashVariance"],
  },
  {
    slug: "shortages",
    title: "Rider & cashier shortages",
    description: "Employee, source, cash, containers and whether approved for deduction",
    preview: ["employee", "source", "cash", "approved"],
  },
  {
    slug: "cashier-variance",
    title: "Cashier variance",
    description: "Drawer sessions and cash variance per cashier",
    preview: ["cashier", "opened", "variance"],
  },
  { slug: "sales", title: "Sales", description: "Deliveries and walk-in sales", preview: ["customer", "type", "amount"] },
  { slug: "credit-aging", title: "Credit aging", description: "Customer balances by aging bucket" },
  { slug: "containers-held", title: "Containers held", description: "Holdings by station, rider and customer" },
  { slug: "container-count-variance", title: "Container count variance", description: "Daily counts against expected", preview: ["date", "type", "variance"] },
  { slug: "stock-reorder", title: "Stock and reorder", description: "Consumables on hand against reorder levels" },
  {
    slug: "maintenance-due",
    title: "Maintenance due",
    description: "Filters, membrane and UV lamp due or overdue",
    preview: ["item", "lastReplaced", "status"],
  },
  { slug: "water-quality", title: "Water quality", description: "TDS and pH readings", preview: ["date", "tds", "ph"] },
  { slug: "expenses", title: "Expenses", description: "All recorded expenses", preview: ["date", "category", "amount"] },
  { slug: "payroll-summary", title: "Payroll summary", description: "Pay lines by run and employee", preview: ["employee", "deductions", "net"] },
  { slug: "loan-balances", title: "Loan balances", description: "Outstanding loans and advances", preview: ["employee", "type", "balance"] },
  { slug: "monthly-profit", title: "Monthly profit", description: "Sales minus expenses" },
];

export function buildReportTable(slug: string): TReportTable {
  switch (slug) {
    case "rider-reconciliation":
      return {
        columns: [
          { key: "rider", label: "Rider" },
          { key: "status", label: "Status" },
          { key: "loaded", label: "Loaded" },
          { key: "delivered", label: "Delivered" },
          { key: "returnedFull", label: "Returned full" },
          { key: "returnedEmpty", label: "Returned empty" },
          { key: "expectedCash", label: "Expected cash", align: "right" },
          { key: "cashRemitted", label: "Cash remitted", align: "right" },
          { key: "cashVariance", label: "Cash variance", align: "right" },
        ],
        rows: trips.map((trip) => {
          const summary = tripSummary(trip.id);

          return {
            rider: employeeName(trip.riderId),
            status: TRIP_STATUS_LABEL[trip.status],
            loaded: summary.loaded,
            delivered: summary.delivered,
            returnedFull: summary.returnedFull,
            returnedEmpty: summary.returnedEmpty,
            expectedCash: formatMoney(summary.expectedCash),
            cashRemitted: formatMoney(summary.cashRemitted),
            cashVariance: formatMoney(summary.cashVariance),
            _date: trip.loadedAt,
          };
        }),
      };

    case "shortages":
      return {
        columns: [
          { key: "employee", label: "Employee" },
          { key: "source", label: "Source" },
          { key: "cash", label: "Cash", align: "right" },
          { key: "containers", label: "Containers", align: "right" },
          { key: "approved", label: "Approved for deduction" },
        ],
        rows: shortages.map((shortage) => ({
          employee: employeeName(shortage.employeeId),
          source: startCase(shortage.source),
          cash: formatMoney(shortage.cash),
          containers: shortage.containers,
          approved: shortage.approvedForDeduction ? "Yes" : "No",
        })),
      };

    case "cashier-variance":
      return {
        columns: [
          { key: "cashier", label: "Cashier" },
          { key: "opened", label: "Opened" },
          { key: "opening", label: "Opening", align: "right" },
          { key: "counted", label: "Counted", align: "right" },
          { key: "variance", label: "Variance", align: "right" },
        ],
        rows: drawerSessions.map((session) => ({
          cashier: employeeName(session.cashierId),
          opened: formatDate(session.openedAt),
          opening: formatMoney(session.openingCash),
          counted: session.countedCash !== undefined ? formatMoney(session.countedCash) : "Open",
          variance: session.countedCash !== undefined ? formatMoney(session.countedCash - session.openingCash) : "-",
          _date: session.openedAt,
        })),
      };

    case "sales": {
      const deliveryRows = deliveries.map((delivery) => ({
        date: formatDateTime(delivery.createdAt),
        type: "Delivery",
        customer: customerName(delivery.customerId),
        amount: formatMoney(delivery.amount),
        payment: PAYMENT_LABEL[delivery.paymentType],
        _date: delivery.createdAt,
      }));

      const walkInRows = walkInSales.map((sale) => ({
        date: formatDateTime(sale.createdAt),
        type: "Walk-in",
        customer: sale.customerId ? customerName(sale.customerId) : "Walk-in customer",
        amount: formatMoney(sale.amount),
        payment: PAYMENT_LABEL[sale.paymentType],
        _date: sale.createdAt,
      }));

      return {
        columns: [
          { key: "date", label: "Date" },
          { key: "type", label: "Type" },
          { key: "customer", label: "Customer" },
          { key: "amount", label: "Amount", align: "right" },
          { key: "payment", label: "Payment" },
        ],
        rows: [...deliveryRows, ...walkInRows].sort((a, b) => b._date.localeCompare(a._date)),
      };
    }

    case "credit-aging":
      return {
        columns: [
          { key: "customer", label: "Customer" },
          { key: "bucket", label: "Bucket" },
          { key: "balance", label: "Balance", align: "right" },
        ],
        rows: customers
          .filter((customer) => customer.creditBalance > 0)
          .map((customer) => ({
            customer: customer.name,
            bucket: AGING_LABEL[customer.agingBucket],
            balance: formatMoney(customer.creditBalance),
          })),
      };

    case "containers-held":
      return {
        columns: [
          { key: "location", label: "Location" },
          { key: "type", label: "Type" },
          { key: "full", label: "Full", align: "right" },
          { key: "empty", label: "Empty", align: "right" },
        ],
        rows: containerHoldings.map((holding) => ({ location: holding.locationLabel, type: holding.type, full: holding.full, empty: holding.empty })),
      };

    case "container-count-variance":
      return {
        columns: [
          { key: "date", label: "Date" },
          { key: "type", label: "Type" },
          { key: "counted", label: "Counted", align: "right" },
          { key: "expected", label: "Expected", align: "right" },
          { key: "variance", label: "Variance", align: "right" },
        ],
        rows: containerCounts.map((count) => ({
          date: formatDate(count.date),
          type: count.type,
          counted: count.full + count.empty,
          expected: count.expected,
          variance: count.full + count.empty - count.expected,
          _date: count.date,
        })),
      };

    case "stock-reorder":
      return {
        columns: [
          { key: "item", label: "Item" },
          { key: "onHand", label: "On hand", align: "right" },
          { key: "reorderLevel", label: "Reorder level", align: "right" },
          { key: "status", label: "Status" },
        ],
        rows: consumables.map((consumable) => ({
          item: consumable.name,
          onHand: `${consumable.onHand} ${consumable.unit}`,
          reorderLevel: `${consumable.reorderLevel} ${consumable.unit}`,
          status: consumable.onHand <= consumable.reorderLevel ? "Reorder" : "OK",
        })),
      };

    case "maintenance-due": {
      const latestMeterLiters = Math.max(...meterReadings.map((reading) => reading.liters));

      return {
        columns: [
          { key: "item", label: "Item" },
          { key: "lastReplaced", label: "Last replaced" },
          { key: "litersSince", label: "Liters since", align: "right" },
          { key: "status", label: "Status" },
        ],
        rows: consumables
          .filter((consumable) => consumable.kind === "maintenance")
          .map((consumable) => {
            const state = computeMaintenanceState(consumable, maintenanceLogs, latestMeterLiters);

            return {
              item: consumable.name,
              lastReplaced: state.lastReplacedAt ? formatDate(state.lastReplacedAt) : "Never",
              litersSince: state.litersSince ?? "-",
              status: startCase(state.status),
            };
          }),
      };
    }

    case "water-quality":
      return {
        columns: [
          { key: "date", label: "Date" },
          { key: "tds", label: "TDS", align: "right" },
          { key: "ph", label: "pH", align: "right" },
          { key: "by", label: "Logged by" },
        ],
        rows: waterReadings.map((reading) => ({
          date: formatDateTime(reading.at),
          tds: reading.tds,
          ph: reading.ph ?? "-",
          by: employeeName(reading.by),
          _date: reading.at,
        })),
      };

    case "expenses":
      return {
        columns: [
          { key: "date", label: "Date" },
          { key: "category", label: "Category" },
          { key: "amount", label: "Amount", align: "right" },
          { key: "paidBy", label: "Paid by" },
          { key: "source", label: "Source" },
        ],
        rows: expenses.map((expense) => ({
          date: formatDate(expense.date),
          category: expense.category,
          amount: formatMoney(expense.amount),
          paidBy: employeeName(expense.paidBy),
          source: startCase(expense.source),
          _date: expense.date,
        })),
      };

    case "payroll-summary":
      return {
        columns: [
          { key: "period", label: "Period" },
          { key: "employee", label: "Employee" },
          { key: "base", label: "Base", align: "right" },
          { key: "incentive", label: "Incentive", align: "right" },
          { key: "deductions", label: "Deductions", align: "right" },
          { key: "net", label: "Net", align: "right" },
        ],
        rows: payLines.map((line) => {
          const run = payRuns.find((candidate) => candidate.id === line.runId);

          return {
            period: run ? formatPeriod(run.periodStart, run.periodEnd) : line.runId,
            employee: employeeName(line.employeeId),
            base: formatMoney(line.base),
            incentive: formatMoney(line.incentive),
            deductions: formatMoney(totalDeductions(line)),
            net: formatMoney(line.net),
            _date: run?.periodStart,
          };
        }),
      };

    case "loan-balances":
      return {
        columns: [
          { key: "employee", label: "Employee" },
          { key: "type", label: "Type" },
          { key: "principal", label: "Principal", align: "right" },
          { key: "status", label: "Status" },
          { key: "balance", label: "Balance", align: "right" },
        ],
        rows: loans.map((loan) => {
          const paid = installments
            .filter((installment) => installment.loanId === loan.id && installment.paid)
            .reduce((sum, installment) => sum + installment.principalPart, 0);
          const balance = loan.status === "released" || loan.status === "paid" ? Math.max(0, loan.principal - paid) : loan.principal;

          return {
            employee: employeeName(loan.employeeId),
            type: startCase(loan.type),
            principal: formatMoney(loan.principal),
            status: LOAN_STATUS_LABEL[loan.status],
            balance: formatMoney(balance),
          };
        }),
      };

    case "monthly-profit": {
      const salesTotal = deliveries.reduce((sum, delivery) => sum + delivery.amount, 0) + walkInSales.reduce((sum, sale) => sum + sale.amount, 0);
      const expensesTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);

      return {
        columns: [
          { key: "month", label: "Month" },
          { key: "sales", label: "Sales", align: "right" },
          { key: "expenses", label: "Expenses", align: "right" },
          { key: "profit", label: "Profit", align: "right" },
        ],
        rows: [
          { month: "September 2026", sales: formatMoney(salesTotal), expenses: formatMoney(expensesTotal), profit: formatMoney(salesTotal - expensesTotal) },
        ],
      };
    }

    default:
      return { columns: [{ key: "note", label: "Note" }], rows: [{ note: "No detailed report configured yet for this type." }] };
  }
}
