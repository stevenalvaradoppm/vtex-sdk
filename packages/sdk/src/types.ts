export type SessionData = {
  segmentToken: string;
  sessionToken: string;
};

export type OrderForm = {
  orderFormId: string;
};

export type OrderItem = {
  id: string;
  quantity: number;
  seller: string;
};

export type ShippingData = {
  clearAddressIfPostalCodeNotFound: boolean;
  logisticsInfo: {
    itemIndex: number;
    selectedDeliveryChannel: string;
    selectedSla: string;
  };
  selectedAddresses: [
    {
      addressName: string;
      addressType: string;
      city: string;
      complement: string;
      country: string;
      geoCoordinates: [number, number];
      number: string;
      receiverName: string;
      street: string;
    },
  ];
};
export type ClientProfileData = {
  document: string;
  documentType: string;
  email: string;
  firstName: string;
  homePhone: string;
  lastName: string;
};
