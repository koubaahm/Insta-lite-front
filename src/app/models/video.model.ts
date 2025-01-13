import { Visibility } from "../enums/Visibility.enum";

export interface VideoDTO {
  title: string;
  path: string;
  visibility: Visibility;
  size: number;
  format: string;
  duration: string;
  uploadedAt: string;
  uploadedById: number;
}
