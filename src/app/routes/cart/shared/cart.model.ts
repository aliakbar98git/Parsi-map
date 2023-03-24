import { AddressGet } from './../../profile/shared/_types/address-get';
import { ImageType, PaymentMethod, PaymentStatus } from '@shared/.';
import { PaymentGateway } from './paymentGateway.enum';
import { InvoicePayment, InvoiceStatus, ShippingPeriod } from '../../profile/shared';
import { PersonType } from '../../user/shared';
import { InvoiceType } from './Invoice-type.enum';
import { CreditPaymentMethod } from './credit-payment-method';
import { ShippingShiftType } from '.';

export interface ICart {
  hasExclusiveShipmentPermission: boolean;
  orderCustomerInfoDto: IOrderCustomerInfo;
  orderId: string;
  orderItems: IOrderItem[]
  paymentAmount: number;
  paymentAmountDisplay: number;
  taxAmount: number;
  taxRate: number;
  totalAmount: number;
  totalProductCount: number;
}

export interface IOrderCustomerInfo {
  CustomerAgent?: string;
  CustomerId?: number;
  FirstName: string;
  LastName: string;
  Description: string;
  Transferee: string;
  Title: string;
  NationalCode: string;
  Email: string;
  PhoneNumber: string;
  PersonAddressInfoId?: number;
}

export interface IOrderItem {
  id: string;
  identity: number;
  imageType: ImageType;
  marketingProductId: string;
  marketingProductModel: string;
  marketingProductName: string;
  maximumOrderQuantity: number;
  price: number;
  productDocumentInfoId: string;
  productId: string;
  quantity: number;
  retailGoodsGroupId: string;
  taxAmount: number;
  totalPrice: number;
  unitPrice: number;
}

export interface IOfferOrderItem {
  marketingProductId: string;
  marketingProductModel: string;
  marketingProductName: string;
  productDocumentInfoId: string;
  productPrice: number;
  quantity: number;
  imageType: ImageType;
}

export interface IDeleteFromCart {
  Id: string;
}

export interface IOfferInvoiceShipping {
  invoiceShippingItems: IInvoiceShippingItem[];
  orderInfoList: IOfferOrderItem[];
  amount: number;
  taxAmount: number;
  totalAmount: number;
}

export interface IInvoiceShippingItem {
  shippingMethodId: number;
  shippingMethodTitle: string;
  timeSpan: boolean;
  sendWithDealerOrders: boolean;
  shiftTypePlaning: IShiftTypePlaning[];
  timeSpanPlaning: ITimeSpanPlaning;
  shippingTotalAmount: number;
  shippingAmountWithTax: number;
  shippingAmountWithDiscount: number;
  shippingTaxAmount: number;
}
export interface IShiftTypePlaning {
  deliveryDate: string;
  shiftType: ShippingShiftType;
  deliveryPersianDate: string;
  shippingPeriodIds: ShippingPeriod[];
}
export interface ITimeSpanPlaning {
  startDate: string;
  endDate: string;
}
export interface ITimeTable {
  deliveryDate: string;
  shippingPeriod: ShippingPeriod;
}
export interface IShippingParams {
  PersonAddressInfoId: number;
  Transferee: string;
  Description: string;
  ShippingMethodId?: number;
  SendWithDealerOrders: boolean;
  TimeSpan: boolean;
  ShippingTotalCost: number;
  ExclusiveShipment: boolean;
  ShippingDescription: string;
  DeliveryDate: string;
  ShiftType?: ShippingShiftType;
  ShippingPeriod: ShippingPeriod;
  StartDate?: string;
  EndDate?: string;
  InvoiceShippingOrderInfoList: IOfferOrderItem[];
  InvoiceTempKey: string;
  InStoreInventory: boolean;
}
export interface IShippingAddress {
  needToConfirm: boolean;
  needToAcceptPolicy: boolean;
  getPersonAddressInfoDtoList: AddressGet[];
  calculateShippingCostTax: boolean;
}
export interface ICartKeys {
  invoiceShippingTempKey: string;
  invoiceTempKey?: string;
}
export interface IPaymentInfoParams {
  InvoiceId?: string;
  InvoiceTempKey?: string;
  InvoiceShippingTempKey?: string;
}
export interface IPaymentInfo {
  invoiceDataDto: IPaymentInfoInvoice;
  billSummary: IPaymentInfoBillSummary;
  invoicePayments: InvoicePayment[];
  paymentGateways: PaymentGateway[];
  paymentMethods: PaymentMethod[];
  allowToUseSpecialDiscount: boolean;
  hasPrintQuotation: boolean;
  checkLegalPersonFileValidation: boolean;
  posIpAddresses: IPaymentInfoPosIpAddress[];
  paymentGatewayMinimumPayableAmount: number;
  paymentMaximumDiscrepancyAmount: number;
  managementDiscountCommandIssuers: ManagementDiscountDetail[];
  managementDiscountTypes: ManagementDiscountDetail[];
  creditSalesContracts: creditSalesContract[];
  disableLegalPersonFileUploader: boolean;
  legalPersonIntroductionDocumentId: string;
  panoContactNumber: string;
}
type ManagementDiscountDetail = {
  id: number;
  title: string;
};

type creditSalesContract = {
  id: number;
  creditPaymentMethods: CreditPaymentMethod[];
  contractTitle: string;
  contractNumber: string;
  hasLimitation: boolean;
  durationOfLimitedAmount?: number;
  maximumAmount?: number;
  mandatoryPrepaymentPercentage?: number;
  name: string;
};

export interface IPaymentInfoInvoice {
  invoiceId: string;
  invoiceType: InvoiceType;
  customerAgent: number;
  customerId: number;
  customerFirstName: string;
  customerLastName: string;
  customerNationalCode: string;
  customerMobileNumber: string;
  personAddressInfoId: number;
  address: string;
  transferee: string;
  description: string;
  exclusiveShipment: boolean;
  deliveryDate: string;
  shippingPeriod: number;
  shippingCost: number;
  shippingMethodTitle: string;
  discountCode: string;
  specialDiscountPercent: number;
  specialDiscountDescription: string;
  orderItems: IPaymentInfoOrderItem[];
  timeSpan: boolean;
  deadlineDeliveryDate?: string;
  invoiceStatus: InvoiceStatus;
}

export interface IPaymentInfoOrderItem {
  marketingProductId: string;
  productDocumentInfoId: string;
  imageType: ImageType;
  marketingProductModel: string;
  marketingProductName: string;
  quantity: number;
}

export interface IPaymentInfoBillSummary {
  totalValue: number;
  payValue: number;
  remainValue: number;
  paidValue: number;
  creditValue?: number;
}
export interface IPaymentInfoPosIpAddress {
  id: number;
  title: string;
  onlinePos: boolean;
}

export interface IPayParams {
  InvoiceId?: string;
  InvoiceTempKey?: string;
  InvoiceShippingTempKey?: string;
  PaymentAmount: number;
  PaymentMethod: PaymentMethod;
  Description?: string;
  IpgPayment?: IIpgPayment;
  OnlinePosPayment?: IOnlinePosPayment;
  ManualPosPayment?: IManualPosPayment;
  ChequePayment?: IChequePayment;
  DepositSlipPayment?: IDepositSlipPayment;
  NeshanPardakhtPayment?: INeshanPardakhtPayment;
  SettlementCommandPayment?: ISettlementCommandPayment;
  CreditPayment?: ICreditPayment;
  Discount?: IDiscount;
  DocumentInfoId?: string;
  LegalPersonLetterDocumentInfoId?: string;
  PanoContactNumber: string;
}
export interface IIpgPayment {
  PaymentGateway: PaymentGateway;
}
export interface IOnlinePosPayment {
  PosIpAddressId: PaymentGateway;
}
export interface IManualPosPayment {
  PaymentDate: string;
  ReferenceNumber: string;
  TrackingNumber: string;
  PosIpAddressId: number;
}
export interface IChequePayment {
  BankId: number;
  AccountNumber: string;
  ChequeNumber: string;
  ChequeDate: string;
}
export interface IDepositSlipPayment {
  BankId: number;
  AccountNumber: string;
  TrackingNumber: string;
  TransactionDate: string;
}
export interface INeshanPardakhtPayment {
  PaymentDate: string;
  ReferenceNumber: string;
}
export interface ISettlementCommandPayment {
  OrderBy: string;
  InvoiceNumber: string;
  ReferenceNumber: string;
  Confirmed?: boolean;
}
interface ICreditPayment {
  CreditSalesContractId: number;
  CreditPaymentMethod: CreditPaymentMethod;
  TopContractCode?: string;
}
export interface IDiscount {
  DiscountCode: IDiscountCode;
  SpecialDiscount: ISpecialDiscount;
}
export interface IDiscountCode {
  DiscountCode: string;
  ConfirmationCode?: string;
  VerifyConfirmationCode?: boolean;
}
export interface ISpecialDiscount {
  SpecialDiscountPercent: number;
  SpecialDiscountDescription: string;
  ManagementDiscountDetails?: ISpecialDiscountDetail[];
}
interface ISpecialDiscountDetail {
  DiscountPercent: number;
  ManagementDiscountTypeId: number;
  ManagementDiscountCommandIssuerId: number;
}
export interface IPayInvoiceResult {
  invoiceId: string;
  ipgPaymentToken: string;
  ipgPaymentSign: string;
  ipgPaymentUrl: string;
  needDiscountCodeConfirmation: boolean;
  paymentId: number;
  paymentStatus: PaymentStatus;
  redirectShipping: boolean;
  qrCodeValue?: any;

}
export interface IPaymentResultParam {
  invoiceId: string;
  ipgPaymentResultTempKey?: PaymentGateway;
}
export interface IPaymentResult {
  invoiceId: string;
  invoiceNumber: string;
  referenceNumber: string;
  paymentStatus: PaymentStatus;
  invoiceStatus: InvoiceStatus;
  hasOrder: boolean;
  hasCreditPayments: boolean;
  hasRemainPayment: boolean;
}
export interface IInvoiceBillSummary {
  billSummary: IPaymentInfoBillSummary,
  invoicePayments: InvoicePayment[],
  invoiceStatus: InvoiceStatus
  invoiceType: InvoiceType;
}
export interface IRemoveInvoicePaymentParams {
  InvoiceId: string;
  PaymentId: number;
}
export interface IDiscountCheckParams {
  InvoiceId?: string;
  CustomerId?: number;
  DiscountCode: IDiscountCode;
  SpecialDiscount: ISpecialDiscount;
  InvoiceShippingTempKey?: string;
}
export interface IDiscountResult {
  needDiscountCodeConfirmation: boolean;
  billSummary: IPaymentInfoBillSummary;
  paymentGateways: PaymentGateway[];
}
export interface ICustomer {
  customerId: number;
  email: string;
  firstName: string;
  lastName: string;
  nationalCode: string;
  nationalCodeIsValidate: boolean;
  personType: PersonType;
  phoneNumber: string;
  title: string;
  editable: boolean;
  representativePersonEditable: boolean;
  isMobileNumberConfirmed:boolean;
  userId?:string;
  confirmationCode?:string;
}



export interface IUpdateNationalCodeParams {
  RealPersonId: number;
  NationalCode: string;
  IsForeign: boolean;
}
export interface ISetCustomerInfoParams {
  CustomerId: number;
  CustomerFirstName: string;
  CustomerLastName: string;
  CustomerNationalCode: string;
  CustomerPhone: string;
  CustomerEmail: string;
  CustomerAgent?: number;
  CustomerTitle?: string;
}
export interface IShippingSellerInfo {
  address: string;
  customerAgent: number;
  customerEmail: string;
  customerFirstName: string;
  customerForeignerIdentityCode: string;
  customerId: number;
  customerLastName: string;
  customerNationalCode: string;
  customerNationalId: string;
  customerPhone: string;
  customerTitle: string;
  description: string;
  inStoreInventory: boolean;
  personAddressInfoId: number;
  transferee: string;
  chargeRate: number;
  exclusiveShipment: boolean;
  vatRate: number
}

export interface validateTopContractCodeRequest {
  invoiceTempKey?: string;
  invoiceId?: string;
  code: string;
}

export interface validateTopContractCodeResponse {
  id: number;
  amount: number;
}
