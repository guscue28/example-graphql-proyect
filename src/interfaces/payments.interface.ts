export interface CreditCardHolder {
  nameRef: string;
  cardHolderName: string;
  number: string;
  expiry: string;
  cvc: string;
  brand: string;
  billingDetails?: BillingDetails;
}

export interface BillingDetails {
  city: string;
  postalCode: string;
  addressLine1: string;
  addressLine2: string;
}

export interface RechargeWalletInput {
  amount: number;
  email: string;
  paymentMethod: string;
  reference: string;
  name: string;
}
