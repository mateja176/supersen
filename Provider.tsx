import { ThemeProvider } from '@emotion/react';
import React from 'react';
import { RootSiblingParent } from 'react-native-root-siblings';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import theme from './utils/theme';

const queryClient = new QueryClient();

export interface ProviderProps {
  children: React.ReactNode;
}

const Provider = (props: ProviderProps): React.ReactElement => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ThemeProvider theme={theme}>
        <RootSiblingParent>{props.children}</RootSiblingParent>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default Provider;
