import api from "../api/api";

const postsAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => "/posts",
      providesTags: (result = []) => [
        "Posts",
        ...result.map(({ id }) => ({ type: "Posts", id })),
        "Replies",
      ],
    }),
    createPost: builder.mutation({
      query: (content) => ({
        url: "/posts",
        method: "POST",
        body: { content },
      }),
      invalidatesTags: ["Posts"],
    }),
    createReply: builder.mutation({
      query: ({ postId, content }) => ({
        url: `/replies/posts/${postId}/replies`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Posts", id: postId },
        "Posts",
        "Replies",
      ],
    }),
    // deletePost: builder.mutation({ TBD
  }),
});

export const {
  useGetPostsQuery,
  useCreatePostMutation,
  useCreateReplyMutation,
  // useDeletePostMutation,
} = postsAPI;
