// import { AmplifyAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import awsExports from "../aws-exports";
// import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api'
import { GetServerSideProps } from "next";

Amplify.configure({ ...awsExports, ssr: true });

export default function Home() {
  // return <AmplifyAuthenticator />;
  return <div>Home Page</div>;
}

export const getServerSideProps: GetServerSideProps = async () => {
  // const SSR = withSSRContext({ req });

  return {
    props: {},
  };
};
