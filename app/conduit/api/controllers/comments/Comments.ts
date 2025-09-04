import { BaseController } from "../BaseController";

export class Comments extends BaseController {
  async addComment(articleSlug: string, commentBody: string) {
    const response = await this.request.post(`/api/articles/${articleSlug}/comments`, {
      data: { comment: { body: commentBody } },
    });
    return response;
  }

  async getComments(articleSlug: string) {
    const response = await this.request.get(`/api/articles/${articleSlug}/comments`);
    return response;
  }

  async deleteComment(commentId: number, articleSlug: string) {
    const response = await this.request.delete(`/api/articles/${articleSlug}/comments/${commentId}`);
    return response;
  }
}
