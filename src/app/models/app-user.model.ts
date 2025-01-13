import { AppRole } from "../enums/AppRole.enum";

export interface AppUserDTO {
  id: number;
  name: string;
  email: string;
  password: string;
  role: AppRole; // Vous devrez définir l'interface ou l'enum `AppRole` correspondante
  isActive: boolean;

  // Listes d'identifiants pour éviter les références circulaires
  imageIds: number[];
  videoIds: number[];
  commentIds: number[];
}
