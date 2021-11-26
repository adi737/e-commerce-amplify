import type { AppProps } from "next/app";
import { AmplifyProvider } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AmplifyProvider>
      <Component {...pageProps} />;
    </AmplifyProvider>
  );
}

export default MyApp;
