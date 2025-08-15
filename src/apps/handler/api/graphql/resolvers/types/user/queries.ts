import type { Post } from "../../../schema.ts";
import type { Replace, Resolver } from "../../../types.ts";

export const id: Resolver<number, number> = async (id, _, { loaders }) => {
  const user = await loaders.getUserByIds.load(id);
  return user.id;
};

export const email: Resolver<string, number> = async (id, _, { loaders }) => {
  const user = await loaders.getUserByIds.load(id);
  return user.email;
};

export const name: Resolver<string, number> = async (id, _, { loaders }) => {
  const user = await loaders.getUserByIds.load(id);
  return user.email;
};

export const posts: Resolver<
  Array<Replace<Post, { user: number }>>
// deno-lint-ignore require-await
> = async () => [
  {
    id: "5",
    title: "title",
    user: 3,
    published: true,
    content: "content",
  },
];
