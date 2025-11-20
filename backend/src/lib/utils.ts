import { UserWithAddress } from '../db/users/types';
import { US_STATES } from './constants';

export class HttpError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export const transformUserWithAddress = (user: UserWithAddress) => {
  const {
    address_id,
    address_street,
    address_city,
    address_state,
    address_zipcode,
    ...rest
  } = user;
  return {
    ...rest,
    address: {
      id: address_id,
      street: address_street,
      city: address_city,
      state: address_state,
      zipcode: address_zipcode,
      friendly_address: `${address_street}, ${address_city}, ${US_STATES[address_state]}, ${address_zipcode}`,
    },
  };
};
