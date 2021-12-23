import React from 'react';
import { Platform } from 'react-native';
import { RootSiblingParent } from 'react-native-root-siblings';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { NativeRouter } from 'react-router-native';

const queryClient = new QueryClient();

export interface ProviderProps {
  children: React.ReactNode;
}

const Provider = (props: ProviderProps): React.ReactElement => {
  return (
    <NativeRouter>
      <QueryClientProvider client={queryClient}>
        {Platform.OS === 'web' && <ReactQueryDevtools initialIsOpen={false} />}
        <RootSiblingParent>{props.children}</RootSiblingParent>
      </QueryClientProvider>
    </NativeRouter>
  );
};

export default Provider;
