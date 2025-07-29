export interface CrimeType {
  crime_id: number;
  name: string;
  description: string;
  categoryId: number;
}

export interface CrimeResponse extends CrimeType {
  id: number;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
  category?: {
    id: number;
    name: string;
  };
}

export interface CrimeCategoryType {
  id?: number;
  name: string;
  description: string;
  category_author: string;
  crimes?: CrimeType[];
}

export interface CrimeCategoryResponse extends Omit<CrimeCategoryType, 'id'> {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}
