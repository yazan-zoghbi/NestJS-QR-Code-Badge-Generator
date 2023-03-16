export interface CustomerData {
  name: string;
  email?: string;
}

export interface VCardData extends CustomerData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address?: string;
}

export interface URLData extends CustomerData {
  url: string;
}

export interface WiFiData extends CustomerData {
  ssid: string;
  password: string;
}

export interface LocationData extends CustomerData {
  latitude: string;
  longitude: string;
  altitude: string;
}

export interface EventData extends CustomerData {
  summary: string;
  start: string;
  end: string;
  location: string;
  description: string;
}
