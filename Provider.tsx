import React from 'react';
import { RootSiblingParent } from 'react-native-root-siblings';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

const queryClient = new QueryClient();

export interface ProviderProps {
  children: React.ReactNode;
}

const Provider = (props: ProviderProps): React.ReactElement => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <RootSiblingParent>{props.children}</RootSiblingParent>
    </QueryClientProvider>
  );
};

export default Provider;
