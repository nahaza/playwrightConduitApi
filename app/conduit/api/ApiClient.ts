import { APIRequestContext } from "@playwright/test";
import { Users } from "./controllers/users/Users";
import { Articles } from "./controllers/articles/Articles";
import { Favorite } from "./controllers/favorite/Favorite";
import { Comments } from "./controllers/comments/Comments";
import { Tags } from "./controllers/tags/tags";

export class ApiClient {
  users: Users;
  articles: Articles;
  favorite: Favorite;
  comments: Comments;
  tags: Tags;

  constructor(request: APIRequestContext) {
    this.users = new Users(request);
    this.articles = new Articles(request);
    this.favorite = new Favorite(request);
    this.comments = new Comments(request);
    this.tags = new Tags(request);
  }
}
