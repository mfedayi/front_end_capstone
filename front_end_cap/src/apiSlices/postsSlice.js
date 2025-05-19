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
      query: ({ postId, content , parentId }) => ({
        url: `/replies/posts/${postId}/replies`,
        method: "POST",
        body: { content, parentId },
      }),
      invalidatesTags: ["Posts", "Replies"],
    }),
    softDeleteOwnPost: builder.mutation({
      query: (postId) => ({
        url: `/posts/${postId}/soft-delete`,
        method: "PATCH",
      }),
      invalidatesTags: ["Posts"],
    }),
    adminDeletePost: builder.mutation({
      query: (postId) => ({
        url: `/posts/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Posts"],
    }),
    softDeleteOwnReply: builder.mutation({
      query: (replyId) => ({
        url: `/replies/${replyId}/soft-delete`,
        method: "PATCH",
      }),
      invalidatesTags: ["Posts", "Replies"],
    }),
    adminDeleteReply: builder.mutation({
      query: (replyId) => ({
        url: `/replies/admin/${replyId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Posts", "Replies"],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useCreatePostMutation,
  useCreateReplyMutation,
  useSoftDeleteOwnPostMutation,
  useAdminDeletePostMutation,
  useSoftDeleteOwnReplyMutation,
  useAdminDeleteReplyMutation,
} = postsAPI;