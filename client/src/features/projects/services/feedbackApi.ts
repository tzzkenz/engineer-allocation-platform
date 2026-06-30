import type {
  CreateFeedbackRequest,
  FeedbackResponse,
  UpdateFeedbackRequest,
} from "@entities/project/types/apiTypes";

import employeeBaseApi from "@shared/api/base.api";

export const feedbackApi = employeeBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFeedbacks: builder.query<FeedbackResponse[], void>({
      query: () => ({
        url: "/feedbacks",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Feedback", id: "LIST" },
              ...result.map(({ id }) => ({
                type: "Feedback" as const,
                id,
              })),
            ]
          : [{ type: "Feedback", id: "LIST" }],
    }),

    getFeedback: builder.query<FeedbackResponse, number>({
      query: (feedbackId) => ({
        url: `/feedbacks/${feedbackId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, feedbackId) => [{ type: "Feedback", id: feedbackId }],
    }),

    createFeedback: builder.mutation<
      FeedbackResponse,
      {
        projectId: string;
        body: CreateFeedbackRequest;
      }
    >({
      query: ({ projectId, body }) => ({
        url: `/feedbacks/${projectId}/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Feedback", id: "LIST" }],
    }),

    updateFeedback: builder.mutation<
      FeedbackResponse,
      {
        feedbackId: number;
        body: UpdateFeedbackRequest;
      }
    >({
      query: ({ feedbackId, body }) => ({
        url: `/feedbacks/${feedbackId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { feedbackId }) => [
        { type: "Feedback", id: feedbackId },
        { type: "Feedback", id: "LIST" },
      ],
    }),

    deleteFeedback: builder.mutation<void, number>({
      query: (feedbackId) => ({
        url: `/feedbacks/${feedbackId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, feedbackId) => [
        { type: "Feedback", id: feedbackId },
        { type: "Feedback", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetFeedbacksQuery,
  useLazyGetFeedbacksQuery,
  useGetFeedbackQuery,
  useLazyGetFeedbackQuery,
  useCreateFeedbackMutation,
  useUpdateFeedbackMutation,
  useDeleteFeedbackMutation,
} = feedbackApi;
