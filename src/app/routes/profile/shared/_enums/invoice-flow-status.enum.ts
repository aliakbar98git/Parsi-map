export enum InvoiceFlowStatus {
  Unspecified = 0,
  PendingPayment = 1,
  PendingVerification = 2,
  PaidAndCheck = 3,
  Verified = 4,
  Preparing = 5,
  DeliveredToDeliveryAgent = 6,
  Delivered = 7,
  Canceled = 8,
  FinanceCheck = 9,
  CancelAndSettlement = 10,
  AutoCanceled = 11,
  CancelRequest = 12
}
