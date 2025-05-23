export interface CrimeType {
  id: number;
  title: string;
  description: string;
  location: string;
  reportedAt: Date;
  categoryId: number;
  userId: number;
}

export interface CrimeCategoryType {
  id: number;
  name: string;
  description: string;
  category_author: string;
  crimes?: CrimeType[];
}
