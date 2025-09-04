import { BaseController } from "../BaseController";

export class Tags extends BaseController {
  async getTags() {
    const response = await this.request.get("/api/tags");
    return response;
  }
}