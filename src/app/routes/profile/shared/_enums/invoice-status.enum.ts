export enum InvoiceStatus {
  Unspecified = 0,
  Pending = 1,
  Paid = 2,
  Confirmed = 3,
  OrderInserted = 4,
  OrderConfirmed = 5,
  Sending = 6,
  Delivered = 7,
  Canceled = 8,
  Returned = 9,
  Unverified = 10,
  PartialPayment = 11,
  PendingVerification = 12,
  Refunding = 13,
  Refunded = 14,
  AutomaticCanceled = 15,
  Loading = 9999
}