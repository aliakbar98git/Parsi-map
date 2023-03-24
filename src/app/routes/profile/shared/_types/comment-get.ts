import { IComment, ImageType } from 'src/app/shared';

export type CommentGet = IComment & {
  commentId: string;
  marketingProductId?: string;
  isRead: boolean;
  isReadOwner: boolean;
  isActive: boolean;
  createdOn: string;
  marketingProductModel: string;
  marketingProductName: string;
  commentReplayId?: string;
  replayCommentText: string;
  fullname: string;
  defaultDocumentInfoId?: string;
  imageType: ImageType;
};
