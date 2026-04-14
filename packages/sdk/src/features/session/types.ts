export interface SessionSegment {
  campaigns: unknown;
  channel: string;
  priceTables: unknown;
  regionId: string;
  utm_campaign: string;
  utm_source: string;
  utmi_campaign: string;
}

export interface SessionProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  document: string;
  isAuthenticated: boolean;
}

export interface VtexSession {
  id: string;
  namespaces: {
    profile?: Partial<SessionProfile>;
    store?: {
      channel?: { value: string };
      countryCode?: { value: string };
      cultureInfo?: { value: string };
      currencyCode?: { value: string };
      currencySymbol?: { value: string };
    };
    public?: Record<string, { value: string }>;
    authentication?: {
      storeUserId?: { value: string };
      storeUserEmail?: { value: string };
    };
  };
}
