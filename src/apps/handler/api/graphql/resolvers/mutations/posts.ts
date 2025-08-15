// @ts-expect-error example
// deno-lint-ignore require-await
export const publish = async (_, { id }) => {
  return {
    id,
    title: "title",
    published: true,
    content: "Just published!",
    user: 999,
  };
};
