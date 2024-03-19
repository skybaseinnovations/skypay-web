export interface DashboardData {
    paymentCounts: PaymentCounts
    totalPayments: number
    totalRevenue: number
    successRate: number
    cancelledCount: number
    invalidCount: number
  }
  
  export interface PaymentCounts {
    Khalti: number
  }
  