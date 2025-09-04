import { faker } from "@faker-js/faker";
import { test } from "../../../fixtures/conduit/conduitApi";
import { expect } from "@playwright/test";
import { Article } from "../../../app/conduit/api/controllers/articles/ArticleTypes";

test.use({ userToLoginEmail: process.env.CONDUIT_DEFAULT_EMAIL });

test("Create article", async ({ client }) => {
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
});

test("Create article with tags", async ({ client }) => {
  const articleData: Article = {
    title: faker.lorem.sentence(),
    description: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(5),
    tagList: ["qa1"],
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

test("Update article", async ({ client }) => {
  const newArticleData: Article = {
    title: faker.lorem.sentence(),
    description: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(5),
  };
  const articleData: Article = {
    title: faker.lorem.sentence(),
    description: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(5),
  };
  const createResponse = await client.articles.createArticle(articleData);
  expect(createResponse.status()).toBe(200);

  const createdArticle = (await createResponse.json()).article;
  const slug = createdArticle.slug;

  const updateResponse = await client.articles.updateArticle(newArticleData, slug);
  expect(updateResponse.status()).toBe(200);

  const updatedArticle = (await updateResponse.json()).article;

  expect(updatedArticle.title).toEqual(newArticleData.title);
  expect(updatedArticle.description).toEqual(newArticleData.description);
  expect(updatedArticle.body).toEqual(newArticleData.body);
  expect(updatedArticle.slug).toEqual(slug);
});

test("Delete article", async ({ client }) => {
  const articleData: Article = {
    title: faker.lorem.sentence(),
    description: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(5),
  };
  const createResponse = await client.articles.createArticle(articleData);
  expect(createResponse.status()).toBe(200);

  const createdArticle = (await createResponse.json()).article;
  const slug = createdArticle.slug;

  const deleteResponse = await client.articles.deleteArticle(slug);
  expect(deleteResponse.status()).toBe(204);

  const getResponse = await client.articles.getArticle(slug);
  expect(getResponse.status()).toBe(404);
});

test("List of articles", async ({ client }) => {
  const articleData: Article = {
    title: faker.lorem.sentence(),
    description: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(5),
  };
  const createResponse = await client.articles.createArticle(articleData);
  expect(createResponse.status()).toBe(200);

  const listResponse = await client.articles.getArticles({ offset: 0, limit: 10 });
  expect(listResponse.status()).toBe(200);

  const listResponseBody = await listResponse.json();
  const articles: Article[] = listResponseBody.articles;

  expect(articles.length).toBeGreaterThan(0);
});

test("Get article by slug", async ({ client }) => {
  const articleData: Article = {
    title: faker.lorem.sentence(),
    description: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(5),
  };
  const createResponse = await client.articles.createArticle(articleData);
  expect(createResponse.status()).toBe(200);

  const createdArticle = (await createResponse.json()).article;
  const slug = createdArticle.slug;

  const getResponse = await client.articles.getArticle(slug);
  expect(getResponse.status()).toBe(200);

  const getResponseBody = await getResponse.json();
  const fetchedArticle: Article = getResponseBody.article;

  expect(fetchedArticle.title).toEqual(articleData.title);
  expect(fetchedArticle.description).toEqual(articleData.description);
  expect(fetchedArticle.body).toEqual(articleData.body);
  expect(fetchedArticle.slug).toEqual(slug);
});

test("Get non-existent article by slug", async ({ client }) => {
  const getResponse = await client.articles.getArticle("non-existent-slug");
  expect(getResponse.status()).toBe(404);
});

test("Get article by tag", async ({ client }) => {
  const articleData: Article = {
    title: faker.lorem.sentence(),
    description: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(5),
    tagList: ["qa1"],
  };
  const createResponse = await client.articles.createArticle(articleData);
  expect(createResponse.status()).toBe(200);

  const listResponse = await client.articles.getArticles({ offset: 0, limit: 10, tag: "qa1" });
  expect(listResponse.status()).toBe(200);

  const listResponseBody = await listResponse.json();
  const articles: Article[] = listResponseBody.articles;

  expect(articles.length).toBeGreaterThan(0);
  expect(articles[0].tagList).toContain("qa1");
});

test("Get articles by author", async ({ client }) => {
  const articleData: Article = {
    title: faker.lorem.sentence(),
    description: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(5),
    tagList: ["qa1"],
  };
  const createResponse = await client.articles.createArticle(articleData);
  expect(createResponse.status()).toBe(200);

  const createdArticle = (await createResponse.json()).article;
  const author = createdArticle.author?.username;

  const listResponse = await client.articles.getArticles({ offset: 0, limit: 10, author });
  expect(listResponse.status()).toBe(200);

  const listResponseBody = await listResponse.json();
  const articles: Article[] = listResponseBody.articles;

  expect(articles.length).toBeGreaterThan(0);
  expect(articles[0].author?.username).toEqual(author);
});
