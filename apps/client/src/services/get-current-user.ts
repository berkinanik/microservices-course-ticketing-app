import { buildServerService } from './build-server-service';

import { type CurrentUserResponse } from '~/@types';
import { buildClientServer } from '~/http';

export const getCurrentUser = buildServerService(async (headers) => {
  const client = buildClientServer(headers);
  const currentUser = await client
    .get<CurrentUserResponse>('/api/users/current-user')
    .then((res) => (res.ok ? res.data.currentUser : null));

  return currentUser;
});
