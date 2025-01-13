import { Visibility } from "../enums/Visibility.enum";

export interface ImageDTO {
  title: string;
  path: string;
  visibility: Visibility;
  size: number;
  format: string;
  uploadedAt: string;
  uploadedById: number;
}


export interface ImageRequestDTO {
  title: string;
  visibility: Visibility;
  size: number;
}

export interface ImageResponseDTO {
  id: number;
  title: string;
  visibility: Visibility;
  size: number;
  uploadedById: number;
  uploadDate: string;
  url: string;
}