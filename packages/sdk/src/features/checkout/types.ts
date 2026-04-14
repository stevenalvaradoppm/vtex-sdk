export interface Address {
  addressType: string;
  receiverName: string;
  addressId: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
  street: string;
  number: string;
  neighborhood: string;
  complement: string;
  reference: string;
}

export interface DeliveryOption {
  id: string;
  deliveryChannel: string;
  price: number;
  estimate: string;
  isSelected: boolean;
}

export interface OrderFormItem {
  id: string;
  name: string;
  detailUrl: string;
  imageUrl: string;
  skuName: string;
  quantity: number;
  uniqueId: string;
  productId: string;
  refId: string;
  ean: string;
  priceValidUntil: string;
  price: number;
  tax: number;
  listPrice: number;
  sellingPrice: number;
  rewardValue: number;
  isGift: boolean;
  parentItemIndex: number | null;
  parentAssemblyBinding: string | null;
}

export interface Totalizer {
  id: string;
  name: string;
  value: number;
}

export interface ShippingData {
  address: Address | null;
  availableAddresses: Address[];
  deliveryOptions: DeliveryOption[];
  selectedAddresses: Address[];
}

export interface PaymentData {
  installmentOptions: Installment[];
  paymentSystems: unknown[];
  payments: unknown[];
  giftCards: unknown[];
}

export interface Installment {
  count: number;
  hasInterestRate: boolean;
  interestRate: number;
  value: number;
  total: number;
  sellerMerchantInstallments: unknown[];
}

export interface ClientProfileData {
  email: string;
  firstName: string;
  lastName: string;
  document: string;
  documentType: string;
  phone: string;
  corporateName: string | null;
  tradeName: string | null;
  corporateDocument: string | null;
  stateInscription: string | null;
  isCorporate: boolean;
}

export interface OrderForm {
  orderFormId: string;
  items: OrderFormItem[];
  totalizers: Totalizer[];
  shippingData: ShippingData | null;
  paymentData: PaymentData;
  clientProfileData: ClientProfileData | null;
  value: number;
  status: string;
  canEditData: boolean;
  loggedIn: boolean;
  isCheckedIn: boolean;
}

export interface AddItemInput {
  id: number;
  quantity: number;
  seller: string;
  index?: number;
}

export interface UpdateItemInput {
  index: number;
  quantity: number;
}
