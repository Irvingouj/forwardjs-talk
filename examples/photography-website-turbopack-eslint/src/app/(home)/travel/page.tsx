import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { TravelView, LoadingStatus } from '@/modules/travel/ui/views/travel-view';
import { trpc } from '@/trpc/server';
import { getQueryClient } from '@/trpc/server';

export const metadata = {
  title: 'Travel',
  description: 'Travel',
};

const page = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.travel.getCitySets.queryOptions({}));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<LoadingStatus />}>
        <ErrorBoundary fallback={<p>Error</p>}>
          <TravelView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default page;
