import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify, API, withSSRContext } from "aws-amplify";
import { InferGetServerSidePropsType } from "next";
import awsExports from "../aws-exports";
import { listPosts } from "../graphql/queries";
import { createPost } from "../graphql/mutations";
import { CreatePostMutation, ListPostsQuery } from "../API";

Amplify.configure({ ...awsExports, ssr: true });

export const getServerSideProps = async ({ req }) => {
  const SSR = withSSRContext({ req });

  const { data }: { data: ListPostsQuery } = await SSR.API.graphql({
    query: listPosts,
  });

  return {
    props: {
      posts: data.listPosts.items,
    },
  };
};

export default function Home({
  posts,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const handleCreatePost = async (event) => {
    event.preventDefault();
    const form = new FormData(event.target);

    try {
      const { data } = (await API.graphql({
        authMode: "AMAZON_COGNITO_USER_POOLS",
        query: createPost,
        variables: {
          input: {
            title: form.get("title"),
            content: form.get("content"),
          },
        },
      })) as { data: CreatePostMutation };

      console.log(data);
    } catch ({ errors }) {
      console.error(...errors);
      throw new Error(errors[0].message);
    }
  };

  return (
    <div>
      <br />
      <br />
      {posts.map((post) => {
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>;
      })}
      <Authenticator>
        {({ signOut }) => (
          <form onSubmit={handleCreatePost}>
            <fieldset>
              <legend>Title</legend>
              <input
                defaultValue={`Today, ${new Date().toLocaleTimeString()}`}
                name="title"
              />
            </fieldset>

            <fieldset>
              <legend>Content</legend>
              <textarea
                defaultValue="I built an Amplify app with Next.js!"
                name="content"
              />
            </fieldset>

            <button>Create Post</button>
            <button type="button" onClick={signOut}>
              Sign out
            </button>
          </form>
        )}
      </Authenticator>
    </div>
  );
}
