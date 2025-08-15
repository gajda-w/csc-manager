import type { User } from "../../../schema.ts";

// deno-lint-ignore require-await
export const getUserById = async (id: string): Promise<User> => {
  return {
    id,
    name: `name ${id}`,
    email: `email+${id}@example.com`,
    posts: [],
  };
};

export const getUserByIdsLoader = async (
  ids: readonly string[]
): Promise<User[]> => {
  return await Promise.all(ids.map((id) => getUserById(id)));
};
