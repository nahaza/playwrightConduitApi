import { faker } from "@faker-js/faker";
import { test } from "../../../fixtures/conduit/conduitApi";
import { expect } from "@playwright/test";
import { Article } from "../../../app/conduit/api/controllers/articles/ArticleTypes";

test.use({ userToLoginEmail: process.env.CONDUIT_DEFAULT_EMAIL });

test("Add comment to article", async ({ client }) => {
  const articleData: Article = {
    title: faker.lorem.sentence(),
    description: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(5),
  };

  const createResponse = await client.articles.createArticle(articleData);
  expect(createResponse.status()).toBe(200);

  const createResponseBody = await createResponse.json();
  const createdArticle: Article = createResponseBody.article;

  const commentBody = faker.lorem.sentence();

  const addCommentResponse = await client.comments.addComment(createdArticle.slug!, commentBody);
  expect(addCommentResponse.status()).toBe(200);
  const addCommentResponseBody = await addCommentResponse.json();
  const addedComment = addCommentResponseBody.comment;

  expect(addedComment.body).toBe(commentBody);
});

test("Delete comment from article", async ({ client }) => {
  const articleData: Article = {
    title: faker.lorem.sentence(),
    description: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(5),
  };

  const createResponse = await client.articles.createArticle(articleData);
  expect(createResponse.status()).toBe(200);

  const createResponseBody = await createResponse.json();
  const createdArticle: Article = createResponseBody.article;

  const commentBody = faker.lorem.sentence();

  const addCommentResponse = await client.comments.addComment(createdArticle.slug!, commentBody);
  expect(addCommentResponse.status()).toBe(200);
  const addCommentResponseBody = await addCommentResponse.json();
  const addedComment = addCommentResponseBody.comment;

  const deleteCommentResponse = await client.comments.deleteComment(addedComment.id, createdArticle.slug!);
  expect(deleteCommentResponse.status()).toBe(204);
});

test("Get comments for article", async ({ client }) => {
  const articleData: Article = {
    title: faker.lorem.sentence(),
    description: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(5),
  };

  const createResponse = await client.articles.createArticle(articleData);
  expect(createResponse.status()).toBe(200);

  const createResponseBody = await createResponse.json();
  const createdArticle: Article = createResponseBody.article;

  const commentBody1 = faker.lorem.sentence();
  const commentBody2 = faker.lorem.sentence();

  const addCommentResponse1 = await client.comments.addComment(createdArticle.slug!, commentBody1);
  expect(addCommentResponse1.status()).toBe(200);

  const addCommentResponse2 = await client.comments.addComment(createdArticle.slug!, commentBody2);
  expect(addCommentResponse2.status()).toBe(200);

  const getCommentsResponse = await client.comments.getComments(createdArticle.slug!);
  expect(getCommentsResponse.status()).toBe(200);

  const getCommentsResponseBody = await getCommentsResponse.json();
  const comments = getCommentsResponseBody.comments;

  expect(comments.length).toBe(2);
  expect(comments[0].body).toBe(commentBody2);
  expect(comments[1].body).toBe(commentBody1);
});
