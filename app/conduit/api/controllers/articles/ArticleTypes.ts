import { Author } from "../authors/AuthorTypes";

export type Article = {
  slug?: string;
  title?: string;
  description?: string;
  body?: string;
  createdAt?: string;
  updatedAt?: string;
  tagList?: string[];
  favorited?: boolean;
  favoritesCount?: number;
  author?: Author;
};

export type ArticlesResponse = {
  articles: Article[];
  articlesCount: number;
};

export type ArticlesCreation = {
  article: Article;
};

export type ArticlesGetListRequest = {
  offset: number;
  limit: number;
  tag?: string;
  author?: string;
  favorited?: string;
};