import { format } from 'date-fns';

export const customTimestamp = () => {
  return format(new Date(), 'yyyy-MM-dd hh:mm:ss a');
};
