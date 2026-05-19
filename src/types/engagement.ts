export type EngagementComment = {
  id: string;
  name: string;
  body: string;
  createdAt: string;
  status?: string;
};

export type EngagementResponse = {
  slug: string;
  likeCount: number;
  commentCount: number;
  viewerHasLiked: boolean;
  comments: EngagementComment[];
};

export type CommentSubmissionResponse = {
  accepted: boolean;
  moderation: boolean;
  comment: EngagementComment;
};
