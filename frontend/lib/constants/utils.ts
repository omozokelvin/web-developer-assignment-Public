import { Address } from '@/lib/types';

export const formatAddress = (address: Address) => {
  if (!address) return 'No Address Data';
  // Format: "street, state, city, zipcode"
  return `${address.street}, ${address.state}, ${address.city}, ${address.zipcode}`;
};
