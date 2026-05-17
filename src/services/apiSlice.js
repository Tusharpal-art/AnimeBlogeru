import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
 const BASE_URL = import.meta.VITE_API_BASE_URL ||  "http://192.168.31.161:5023";
export const blogApi = createApi({
  reducerPath: "blogApi",
  tagTypes: ["Post", "Comment", "User"],
  baseQuery: fetchBaseQuery({
    baseUrl:`${BASE_URL}/api`,
    prepareHeaders: (headers, { getState }) => {
      // getState().auth.token isliye kyunki humne upar state.token set kiya hai
      const token = getState().auth.token;
      console.log("url",import.meta.env.VITE_API_BASE_URL);
    

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({

//
   getRecentPosts: builder.query({
  
  query: (params) => ({
    url: "/Blogs/GetAllBlogs",
    params: {
      PageNumber: params?.pageNumber || 1,
      PageSize: params?.pageSize || 20,
      IsDeleted: params?.isDelete || false,
      BlogType:params?.BlogType || 0,
      SortBy:params?.sortBy|| null,
      IsAscending:params?.isAscending||false // Increase this to 20
    }
  }),
  providesTags: ["Post"],

   

// Inside your getRecentPosts endpoint
async onCacheEntryAdded(arg, { cacheDataLoaded, cacheEntryRemoved, refetch, getState }) {
  let connection;
  let handleRecentBlogsChanged;
  let rejoinHandler;

  try {
    await cacheDataLoaded;

    // 1. Get the token from your auth state
    const token = getState().auth.token;

    const { ensureSignalRStarted } = await import("../service/signalService");
    
    // 2. Pass the token to the service
    connection = await ensureSignalRStarted(token);

    handleRecentBlogsChanged = async () => {
      await refetch();
    };

    rejoinHandler = async () => {
      await connection.invoke("JoinDashboardGroup");
    };

    connection.on("RecentBlogsChanged", handleRecentBlogsChanged);
    connection.onreconnected(rejoinHandler);

    await connection.invoke("JoinDashboardGroup");
  } catch (error) {
    console.error("SignalR error in getRecentPosts:", error);
  }

  await cacheEntryRemoved;

  try {
    if (connection && handleRecentBlogsChanged) {
      connection.off("RecentBlogsChanged", handleRecentBlogsChanged);
    }

    if (connection && connection.state === "Connected") {
      await connection.invoke("LeaveDashboardGroup");
    }
  } catch (error) {
    console.error("SignalR cleanup error in getRecentPosts:", error);
  }
},
}), 

   deletePost: builder.mutation({
  query: (id) => ({
    url: `/Blogs/Delete/${id}`, // Updated API route
    method: "DELETE",
  }),
  invalidatesTags: ["Post"], 
}),
    updatePost: builder.mutation({
      query: (formData) => ({
        url: "/Blogs/UpadteBlog",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Post"],
    }),
    likeDislikePost: builder.mutation({
      query: ({ blogId, type }) => ({
        url: `/Blogs/BlogLikeDislike?BlogId=${blogId}&Type=${type}`,
        method: "POST",
        body: {},
      }),
      async onQueryStarted({ blogId  }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data && data.success) {
            dispatch(
              blogApi.util.updateQueryData("getSinglePost", blogId, (draft) => {
                if (draft?.data?.data) {
                  draft.data.data = data.data;
                } else if (draft?.data) {
                  draft.data = data.data;
                }
              })
            );
          }
        } catch {
          console.error("Error updating post reactions in cache");
        }
      },
      invalidatesTags: ["Post"],
    }),

    getSinglePost: builder.query({
      query: (id) => `/Blogs/GetBlogById?id=${id}`,
     providesTags: (result, error, id) => [{ type: "Post", id }] ,
    }),
    createPost: builder.mutation({
      query: (formData) => ({
        url: "Blogs/CreateBlog",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Post"],
    }),
    createComment: builder.mutation({
      query: (commentData) => ({
        url: "Comment/CreateComment",
        method: "POST",
      body: commentData,
      }),
     invalidatesTags: (result, error, arg) => [{ type: "Comment", id: arg.blogId }],
    }),
    updateComment: builder.mutation({
      query: (commentData) => ({
        url: "/Comment/UpdateComment",
        method: "PUT",
        body: commentData,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Comment", id: arg.blogId }],
    }),
    deleteComment: builder.mutation({
      query: (id) => ({
        url: `/Comment/Delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comment"],
    }),
    reactToComment: builder.mutation({
      query: ({ id, type }) => ({
        url: `/Comment/GetCommentReactions?Id=${id}&Type=${type}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["Comment"],
    }),
   getAllComments: builder.query({
  query: (params) => ({
    url: 'Comment/GetAllComments',
    params: {
      // These keys MUST match the casing in your URL exactly
      IsDeleted: params.isDeleted ?? false,
      Search: params.search || "",
      PageNumber: params.pageNumber || 1,
      PageSize: params.pageSize ||20,
      SortBy: params.sortBy || "title",
      IsAscending: params.isAscending ?? true,
      BlogId: params.blogId,
      ParrentCommentId: params.parentId || "00000000-0000-0000-0000-000000000000"
    },
  }),
  providesTags: (result, error, params) => [{ type: "Comment", id: params.blogId }], 
}),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/Auth/Login",
        method: "POST",
        body: credentials,
      }),

      invalidatesTags: ["User", "Comment"],
      
    }),
    registerUser: builder.mutation({
      query: (formData) => ({
        url: "/Auth/Register",
        method: "POST",
        body:formData,
      }),
    }),
    updateProfile: builder.mutation({
      query: (formData) => ({
        url: "/Auth/ProfileUpdate",
        method: "PUT",
        body: formData,
         formData: true,
      }),
      invalidatesTags: ["User", "Comment"],
    }),

    getDashboardInfo: builder.query({
  query: () => "/DashBoard/DashBoardInfo",
  providesTags: ["Post", "User", "Comment"],

  async onCacheEntryAdded(arg, { cacheDataLoaded, cacheEntryRemoved, refetch, getState }) {
    let connection;
    
    // We define the handler to refetch the dashboard stats
    const handleUpdate = async () => {
      await refetch();
    };

    try {
      await cacheDataLoaded;
      const token = getState().auth.token;

      // Import your singleton service
      const { ensureSignalRStarted } = await import("../service/signalService");
      connection = await ensureSignalRStarted(token);

      // Listen for various events that should update the dashboard
      connection.on("RecentBlogsChanged", handleUpdate);
      connection.on("UserListChanged", handleUpdate); // If your backend sends this
      
      // Handle reconnection logic
      const rejoinHandler = async () => {
        if (connection.state === "Connected") {
          await connection.invoke("JoinDashboardGroup");
        }
      };
      connection.onreconnected(rejoinHandler);

      // Join the group to receive updates
      await connection.invoke("JoinDashboardGroup");

    } catch (error) {
      console.error("SignalR error in getDashboardInfo:", error);
    }

    await cacheEntryRemoved;

    try {
      if (connection) {
        connection.off("RecentBlogsChanged", handleUpdate);
        connection.off("UserListChanged", handleUpdate);
        await connection.invoke("LeaveDashboardGroup");
      }
    } catch (error) {
      console.error("SignalR cleanup error in Dashboard:", error);
    }
  },
}),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useGetRecentPostsQuery,
  useCreatePostMutation,
  useGetSinglePostQuery,
  useCreateCommentMutation,
   useGetAllCommentsQuery,
   useDeletePostMutation,
   useUpdatePostMutation,
   useLikeDislikePostMutation,
   useUpdateCommentMutation,
   useDeleteCommentMutation,
   useReactToCommentMutation,
   useUpdateProfileMutation,
   useGetDashboardInfoQuery,
} = blogApi;

export default blogApi;
