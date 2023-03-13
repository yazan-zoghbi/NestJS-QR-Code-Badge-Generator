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
