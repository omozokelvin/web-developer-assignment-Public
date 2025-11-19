import { Address } from '@/app/(users)/_lib/userTypes';

export const formatAddress = (address: Address) => {
  if (!address) return 'No Address Data';
  return `${address.street}, ${address.city}, ${address.state}, ${address.zipcode}`;
};
