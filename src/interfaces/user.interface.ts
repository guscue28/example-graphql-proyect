export interface CreditCard {
  _id?: string;
  nameRef: string;
  cardHolderName: string;
  stripeID?: string;
  brand: string;
  default?: boolean;
  billingDetails?: BillingDetails;
  expiry: string;
  type?: string;
}

export interface BillingDetailsAddress {
  city: string;
  postalCode: string;
  addressLine1: string;
  addressLine2: string;
}
export interface BillingDetails {
  address: BillingDetailsAddress;
  email: string;
  name: string;
  phone: string;
}
