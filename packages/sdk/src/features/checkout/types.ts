export interface OrderFormItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  listPrice: number;
  sellingPrice: number;
  imageUrl: string;
  skuName: string;
  uniqueId: string;
}

export interface OrderForm {
  orderFormId: string;
  items: OrderFormItem[];
  value: number;
  status: string;
}

export interface AddItemInput {
  id: string;
  quantity: number;
  seller: string;
}

export interface LogisticsInfo {
  itemIndex: number;
  selectedDeliveryChannel: string;
  selectedSla: string;
}

export interface SelectedAddress {
  addressName: string;
  addressType: string;
  city: string;
  country: string;
  geoCoordinates: number[];
  number: string;
  receiverName: string;
  street: string;
  complement?: string;
}
    
export interface ShippingDataInput {
  clearAddressIfPostalCodeNotFound: boolean;
  logisticsInfo: LogisticsInfo;
  selectedAddresses: SelectedAddress[];
}

export interface ClientProfileDataInput {
  document: string;
  documentType: string;
  email: string;
  firstName: string;
  lastName: string;
  homePhone: string;
}
