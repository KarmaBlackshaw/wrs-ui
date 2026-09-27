export const ROUTES = {
  LOGIN: "/login",

  RIDER: {
    INDEX: "/rider",
    CUSTOMERS: "/rider/customers",
    TRIP_RETURN: (tripId: string) => `/rider/trip/${tripId}/return`,
    DELIVER: (tripId: string, customerId?: string) => `/rider/trip/${tripId}/deliver${customerId ? `/${customerId}` : ""}`,
  },

  CASHIER: {
    INDEX: "/cashier",
    SELL: "/cashier/sell",
    COLLECT: "/cashier/collect",
    RETURN_CONTAINER: "/cashier/return-container",
    TRIPS: {
      INDEX: "/cashier/trips",
      NEW: "/cashier/trips/new",
      RECEIVE: (tripId: string) => `/cashier/trips/${tripId}/receive`,
      RECONCILE: (tripId: string) => `/cashier/trips/${tripId}/reconcile`,
    },
    COUNT: "/cashier/count",
    STOCK: "/cashier/stock",
  },

  STAFF: {
    LOGS: "/staff/logs",
  },

  ME: {
    INDEX: "/me",
    PAYSLIP: (payslipId: string) => `/me/payslips/${payslipId}`,
  },

  OWNER: {
    INDEX: "/owner",
    DIGEST: "/owner/digest",
    APPROVALS: "/owner/approvals",
    SALES: "/owner/sales",
    TRIPS: "/owner/trips",
    CUSTOMERS: {
      INDEX: "/owner/customers",
      DETAIL: (customerId: string) => `/owner/customers/${customerId}`,
    },
    CONTAINERS: "/owner/containers",
    INVENTORY: {
      INDEX: "/owner/inventory",
      CONSUMABLES: "/owner/inventory/consumables",
      MAINTENANCE: "/owner/inventory/maintenance",
      WATER_QUALITY: "/owner/inventory/water-quality",
    },
    MONEY: {
      INDEX: "/owner/money",
      EXPENSES: "/owner/money/expenses",
      CASH_SESSIONS: "/owner/money/cash-sessions",
    },
    PEOPLE: {
      INDEX: "/owner/people",
      EMPLOYEE: (employeeId: string) => `/owner/people/employees/${employeeId}`,
      PAYROLL: {
        INDEX: "/owner/people/payroll",
        RUN: (runId: string) => `/owner/people/payroll/${runId}`,
      },
      LOANS: "/owner/people/loans",
    },
    REPORT: (report: string) => `/owner/reports/${report}`,
    SETTINGS: "/owner/settings",
  },
} as const;
