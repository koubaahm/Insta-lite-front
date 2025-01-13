export interface CommentDTO {
  content: string;
  createdAt: string;
  createdById: number;
  imageId?: number;
  videoId?: number; 
}
