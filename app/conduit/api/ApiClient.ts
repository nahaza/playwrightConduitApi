import { APIRequest, APIRequestContext } from "@playwright/test";
import { Users } from "./controllers/users/Users";
import { Articles } from "./controllers/articles/Articles";
import { Favorite} from "./controllers/favourite/Favorite";

export class ApiClient {
  users: Users;
  articles: Articles;
  favorite: Favorite;
  constructor(request: APIRequestContext) {
    this.users = new Users(request);
    this.articles = new Articles(request);
    this.favorite = new Favorite(request);
  }
}
