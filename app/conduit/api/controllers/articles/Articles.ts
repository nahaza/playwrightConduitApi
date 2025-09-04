import { BaseController } from "../BaseController";
import { Article, ArticlesGetListRequest } from "./ArticleTypes";

export class Articles extends BaseController {
  async createArticle(articleData: Article) {
    const data = articleData;

    const response = await this.request.post("/api/articles", {
      data: { article: data },
    });
    return response;
  }

  async getArticles(data: ArticlesGetListRequest) {
    const response = await this.request.get(`/api/articles?offset=${data.offset}&limit=${data.limit}`);
    return response;
  }

  async getArticle(slug: string) {
    const response = await this.request.get(`/api/articles/${slug}`);
    return response;
  }

  async updateArticle(articleData: Article, slug: string) {
    const response = await this.request.put(`/api/articles/${slug}`, {
      data: { article: articleData },
    });
    return response;
  }

  async deleteArticle(slug: string) {
    const response = await this.request.delete(`/api/articles/${slug}`);
    return response;
  }
}
