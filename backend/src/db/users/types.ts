export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
}

export interface UserWithAddress extends User {
  address_id: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_zipcode: string;
}
