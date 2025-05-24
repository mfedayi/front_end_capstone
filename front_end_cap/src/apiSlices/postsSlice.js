import api from "../api/api";

// API slice for managing forum posts and replies.
const postsAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      // Fetches all posts and their top-level replies.
      query: () => "/posts",
      providesTags: (result = []) => [
        "Posts",
        ...result.map(({ id }) => ({ type: "Posts", id })),
        "Replies",
      ],
    }),
    createPost: builder.mutation({
      // Creates a new forum post.
      query: (content) => ({
        url: "/posts",
        method: "POST",
        body: { content },
      }),
      invalidatesTags: ["Posts"],
    }),
    createReply: builder.mutation({
      // Creates a new reply to a post.
      query: ({ postId, content , parentId }) => ({
        url: `/replies/posts/${postId}/replies`,
        method: "POST",
        body: { content, parentId },
      }),
      invalidatesTags: ["Posts", "Replies"],
    }),
    softDeleteOwnPost: builder.mutation({
      // Allows a user to soft delete their own post.
      query: (postId) => ({
        url: `/posts/${postId}/soft-delete`,
        method: "PATCH",
      }),
      invalidatesTags: ["Posts"],
    }),
    adminDeletePost: builder.mutation({
      // Allows an admin to permanently delete any post.
      query: (postId) => ({
        url: `/posts/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Posts"],
    }),
    softDeleteOwnReply: builder.mutation({
      // Allows a user to soft delete their own reply.
      query: (replyId) => ({
        url: `/replies/${replyId}/soft-delete`,
        method: "PATCH",
      }),
      invalidatesTags: ["Posts", "Replies"],
    }),
    adminDeleteReply: builder.mutation({
      // Allows an admin to permanently delete any reply.
      query: (replyId) => ({
        url: `/replies/admin/${replyId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Posts", "Replies"],
    }),
    updatePost: builder.mutation({
      // Allows a user to update their own post.
      query: ({ postId, content }) => ({
        url: `/posts/${postId}`,
        method: "PATCH",
        body: { content },
      }),
      invalidatesTags: (result, error, { postId }) => [{ type: "Posts", id: postId }, "Posts"],
    }),
    updateReply: builder.mutation({
      // Allows a user to update their own reply.
      query: ({ replyId, content }) => ({
        url: `/replies/${replyId}`,
        method: "PATCH",
        body: { content },
      }),
      invalidatesTags: (result, error, { replyId }) => [{ type: "Replies", id: replyId }, "Posts", "Replies"], 
    }),
    votePost: builder.mutation({
      // Handles voting (like/dislike) on a post.
      query: ({ postId, voteType }) => ({
        url: `/posts/${postId}/vote`,
        method: "POST",
        body: { voteType }, 
      }),
      invalidatesTags: (result, error, { postId }) => [{ type: "Posts", id: postId }, "Posts"],
    }),
    voteReply: builder.mutation({
      // Handles voting (like/dislike) on a reply.
      query: ({ replyId, voteType }) => ({
        url: `/replies/${replyId}/vote`,
        method: "POST",
        body: { voteType }, 
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
  useUpdatePostMutation,
  useUpdateReplyMutation,
  useVotePostMutation,
  useVoteReplyMutation,
} = postsAPI;