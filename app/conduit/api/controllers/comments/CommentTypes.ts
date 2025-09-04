import { Author } from "../authors/AuthorTypes";

export type Comment = {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  body?: string;
  author?: Author;
};
