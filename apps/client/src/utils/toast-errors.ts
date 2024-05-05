import { toast } from 'sonner';

import { type CommonError } from '~/http/types';

export const toastErrors = (errors: CommonError[]) => {
  for (const error of errors) {
    toast.error(`${error.field ? `Error in ${error.field}:<br />` : ''}${error.message}`);
  }
};
