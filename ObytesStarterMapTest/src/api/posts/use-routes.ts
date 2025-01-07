import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { type RoutesResponse } from '@/models/routes-payload';

import { secondary_client } from '../common';

type Variables = { id: string };

export const useRoutes = createQuery<RoutesResponse, Variables, AxiosError>({
  queryKey: ['routes-total'],
  fetcher: (variables) => {
    return secondary_client
      .get<RoutesResponse>(`routes/total/${variables.id}`)
      .then((response) => response.data);
  },
});
