import { faker } from "@faker-js/faker";
import { test } from "../../../fixtures/conduit/conduitApi";
import { expect } from "@playwright/test";
import { UserResponse } from "../../../app/conduit/api/controllers/users/UserTypes";
import { Article } from "../../../app/conduit/api/controllers/articles/ArticleTypes";

test.use({ userToLoginEmail: process.env.CONDUIT_DEFAULT_EMAIL });

test("Make article favorite", async ({ client }) => {
  const articleData: Article = {
    title: faker.lorem.sentence(),
    description: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(5),
  };

  const createResponse = await client.articles.createArticle(articleData);
  expect(createResponse.status()).toBe(200);

  const createResponseBody = await createResponse.json();
  const createdArticle: Article = createResponseBody.article;

  const favoriteResponse = await client.favorite.favoriteArticle(createdArticle.slug!);
  expect(favoriteResponse.status()).toBe(200);

  const favoriteResponseBody = await favoriteResponse.json();
  const favoritedArticle: Article = favoriteResponseBody.article;

  expect(favoritedArticle.favorited).toBe(true);
  expect(favoritedArticle.favoritesCount).toBe(1);
});

test("Unfavorite article", async ({ client }) => {
  const articleData: Article = {
    title: faker.lorem.sentence(),
    description: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(5),
  };

  const createResponse = await client.articles.createArticle(articleData);
  expect(createResponse.status()).toBe(200);

  const createResponseBody = await createResponse.json();
  const createdArticle: Article = createResponseBody.article;

  // First, favorite the article
  const favoriteResponse = await client.favorite.favoriteArticle(createdArticle.slug!);
  expect(favoriteResponse.status()).toBe(200);

  // Then, unfavorite the article
  const unfavoriteResponse = await client.favorite.unfavoriteArticle(createdArticle.slug!);
  expect(unfavoriteResponse.status()).toBe(200);

  const unfavoriteResponseBody = await unfavoriteResponse.json();
  const unfavoritedArticle: Article = unfavoriteResponseBody.article;

  expect(unfavoritedArticle.favorited).toBe(false);
  expect(unfavoritedArticle.favoritesCount).toBe(0);
});
