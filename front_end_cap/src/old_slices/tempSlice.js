import api from "../store/api";
console.log("bookSlice file executed");

const booksAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    getHome: builder.query({
      query: () => ({
        url: "/home",
        method: "GET",
      }),
      providesTags: ["Temp"],
    }),

    // getBook: builder.query({
    //   query: (id) => ({
    //     url: `/books/${id}`,
    //     method: "GET",
    //   }),
    //   providesTags: ["Books"],
    // }),

    // returnBook: builder.mutation({
    //   query: (id) => ({
    //     url: `/reservations/${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["Books", "Res"],
    // }),

    // checkOutBook: builder.mutation({
    //   query: (id) => ({
    //     url: `/reservations`,
    //     method: "POST",
    //     body: {
    //       bookId: id,
    //     }
    //   }),
    //   invalidatesTags: ["Books", "Res"],
    // }),
  }),
});

// export default booksAPI;
export const { useGetHomeQuery } = booksAPI;
