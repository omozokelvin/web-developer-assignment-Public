import { Address } from '@/app/(users)/_lib/userTypes';

export const formatAddress = (address: Address) => {
  if (!address) return 'No Address Data';
  return `${address.street}, ${address.state}, ${address.city}, ${address.zipcode}`;
};
