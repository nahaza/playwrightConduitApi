import { faker } from "@faker-js/faker";
import { test } from "../../../fixtures/conduit/conduitApi";
import { expect } from "@playwright/test";
import { Article } from "../../../app/conduit/api/controllers/articles/ArticleTypes";

test(" Get tags list", async ({ client }) => {
  const response = await client.tags.getTags();
  expect(response.status()).toBe(200);

  const responseBody = await response.json();
  const tags: string[] = responseBody.tags;

  expect(Array.isArray(tags)).toBe(true);
});

test.describe("Tags are displayed in article and in the list of tags", () => {
  test.use({ userToLoginEmail: process.env.CONDUIT_DEFAULT_EMAIL });

  test("Create article with tags and check tags in response", async ({ client }) => {
    const articleData: Article = {
      title: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      body: faker.lorem.paragraphs(5),
      tagList: ["qa1", "qa2"],
    };
    const response = await client.articles.createArticle(articleData);

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    const article: Article = responseBody.article;

    expect(article.title).toEqual(articleData.title);
    expect(article.description).toEqual(articleData.description);
    expect(article.body).toEqual(articleData.body);
    expect(article.tagList).toEqual(articleData.tagList);
  });

  test("Create article without tags and check tags in response", async ({ client }) => {
    const articleData: Article = {
      title: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      body: faker.lorem.paragraphs(5),
    };
    const response = await client.articles.createArticle(articleData);

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    const article: Article = responseBody.article;

    expect(article.title).toEqual(articleData.title);
    expect(article.description).toEqual(articleData.description);
    expect(article.body).toEqual(articleData.body);
    expect(article.tagList).toEqual([]);
  });

  test("Create article with tags and verify tags in the list of tags", async ({ client }) => {
    const articleData: Article = {
      title: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      body: faker.lorem.paragraphs(5),
      tagList: ["qa1", "qa2"],
    };
    const createResponse = await client.articles.createArticle(articleData);
    expect(createResponse.status()).toBe(200);

    const tagsResponse = await client.tags.getTags();
    expect(tagsResponse.status()).toBe(200);

    const tagsResponseBody = await tagsResponse.json();
    const tags: string[] = tagsResponseBody.tags;

    expect(tags).toEqual(expect.arrayContaining(articleData.tagList!));
  });

  test("Delete article with tags and verify tags are not in the list of tags", async ({ client }) => {
    const articleData: Article = {
      title: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      body: faker.lorem.paragraphs(5),
      tagList: [`qa1${Date.now()}`, `qa2${Date.now()}`],
    };
    const createResponse = await client.articles.createArticle(articleData);
    expect(createResponse.status()).toBe(200);

    const createdArticle = (await createResponse.json()).article;
    const slug = createdArticle.slug;

    const deleteResponse = await client.articles.deleteArticle(slug);
    expect(deleteResponse.status()).toBe(204);

    const tagsResponse = await client.tags.getTags();
    expect(tagsResponse.status()).toBe(200);

    const tagsResponseBody = await tagsResponse.json();
    const tags: string[] = tagsResponseBody.tags;

    expect(tags).not.toEqual(expect.arrayContaining(articleData.tagList!));
  });
});