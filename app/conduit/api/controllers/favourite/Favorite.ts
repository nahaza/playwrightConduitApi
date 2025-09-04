import { BaseController } from "../BaseController";

export class Favorite extends BaseController {
  async favoriteArticle(slug: string) {
    const response = await this.request.post(`/api/articles/${slug}/favorite`);
    return response;
  }

  async unfavoriteArticle(slug: string) {
    const response = await this.request.delete(`/api/articles/${slug}/favorite`);
    return response;
  }
}