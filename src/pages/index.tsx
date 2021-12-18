import { API } from "aws-amplify";
import { InferGetStaticPropsType } from "next";

import { listPosts } from "../graphql/queries";
import { ListPostsQuery } from "../API";
import { Typography } from "@mui/material";

export const getStaticProps = async () => {
  // const SSR = withSSRContext({ req });

  const { data } = (await API.graphql({
    query: listPosts,
  })) as { data: ListPostsQuery };

  return {
    props: {
      posts: data.listPosts.items,
    },
  };
};

export default function Home({
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  // const handleCreatePost = async (event) => {
  //   event.preventDefault();
  //   const form = new FormData(event.target);

  //   try {
  //     const { data } = (await API.graphql({
  //       authMode: "AMAZON_COGNITO_USER_POOLS",
  //       query: createPost,
  //       variables: {
  //         input: {
  //           title: form.get("title"),
  //           content: form.get("content"),
  //         },
  //       },
  //     })) as { data: CreatePostMutation };

  //     console.log(data);
  //   } catch (error) {
  //     console.error(error.message);
  //   }
  // };

  return (
    <div>
      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            marginLeft: "15px",
          }}
        >
          <Typography mt={2} variant="h4">
            {post.title}
          </Typography>
          <Typography variant="subtitle1">{post.content}</Typography>
        </div>
      ))}
    </div>
  );
}
