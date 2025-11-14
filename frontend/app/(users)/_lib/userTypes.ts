export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  username: string;
  address: Address;
}
