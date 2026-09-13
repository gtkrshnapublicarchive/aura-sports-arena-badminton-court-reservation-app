export interface TestimonialItem {
  id: string;
  userId: string | null;
  author: string;
  role: string;
  tag: string;
  quote: string;
  rating: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestimonialFormData {
  author?: string;
  role: string;
  tag: string;
  quote: string;
  rating: number;
  isPublished?: boolean;
}
