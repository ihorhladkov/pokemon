import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { trpc } from "../utils/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Layout from "./layout";

const App = ({ Component, pageProps }: AppProps) => {
  const queryClient = new QueryClient()
  return (

    <QueryClientProvider client={queryClient}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default trpc.withTRPC(App);

// import type { AppType } from 'next/app';
// import { trpc } from '../utils/trpc';

// const MyApp: AppType = ({ Component, pageProps }) => {
//   return <Component {...pageProps} />;
// };
