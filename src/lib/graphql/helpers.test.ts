// Vitest tests
import { describe, expect, it } from "vitest";
import { getOperationName } from "./helpers.ts";

describe("getOperationName", () => {
  it.each([
    {
      document: "query GetUser { user { id name } }",
      scenario: "simple query operation",
    },
    {
      document: "mutation CreateUser { createUser(input: $input) { id } }",
      scenario: "simple mutation operation",
    },
    {
      document: "subscription UserUpdated { userUpdated { id name } }",
      scenario: "simple subscription operation",
    },
    {
      document: "query GetUserWithSpaces   {   user   {   id   }   }",
      scenario: "query with extra spaces",
    },
    {
      document: "mutation UpdateProfile{updateProfile{success}}",
      scenario: "mutation without spaces around braces",
    },
    {
      document: `query GetUserMultiline {
        user {
          id
          name
        }
      }`,
      scenario: "multiline query",
    },
    {
      document: "query getUserCamelCase { user { id } }",
      scenario: "camelCase operation name",
    },
    {
      document: "query get_user_snake_case { user { id } }",
      scenario: "snake_case operation name",
    },
    {
      document: "subscription UPPER_CASE_SUB { events { type } }",
      scenario: "UPPER_CASE operation name",
    },
  ])("should extract operation name for $scenario", ({ document }) => {
    // given
    const inputDocument = document;

    // when
    const result = getOperationName(inputDocument);

    // then
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it.each([
    {
      document: "",
      scenario: "empty string",
    },
    {
      document: "invalid graphql",
      scenario: "invalid GraphQL syntax",
    },
    {
      document: "{ user { id name } }",
      scenario: "anonymous query without operation type",
    },
    {
      document: "query { user { id } }",
      scenario: "query without operation name",
    },
    {
      document: "fragment UserFields on User { id name }",
      scenario: "GraphQL fragment",
    },
    {
      document: "type User { id: ID! name: String! }",
      scenario: "GraphQL type definition",
    },
    {
      document: "query",
      scenario: "incomplete query",
    },
    {
      document: "mutation ",
      scenario: "mutation with only space",
    },
    {
      document: "subscription\n",
      scenario: "subscription with only newline",
    },
  ])("should return empty string for $scenario", ({ document }) => {
    // given
    const inputDocument = document;

    // when
    const result = getOperationName(inputDocument);

    // then
    expect(result).toBeFalsy();
    expect(result).toBe("");
  });

  it.each([
    {
      document: "query GetUser { user { id name } }",
      expectedName: "GetUser",
      scenario: "extracting specific query name",
    },
    {
      document: "mutation CreatePost { createPost(input: $input) { id } }",
      expectedName: "CreatePost",
      scenario: "extracting specific mutation name",
    },
    {
      document: "subscription MessageAdded { messageAdded { id content } }",
      expectedName: "MessageAdded",
      scenario: "extracting specific subscription name",
    },
    {
      document: "query getUserProfile($id: ID!) { user(id: $id) { profile } }",
      expectedName: "getUserProfile",
      scenario: "extracting name with variables",
    },
  ])(
    "should return correct operation name for $scenario",
    ({ document, expectedName }) => {
      // given
      const inputDocument = document;
      const expectedOperationName = expectedName;

      // when
      const result = getOperationName(inputDocument);

      // then
      expect(result).toBe(expectedOperationName);
    },
  );
});
