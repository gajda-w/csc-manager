// deno-lint-ignore require-await
export const posts = async () => {
  return [
    {
      id: "1",
      title: "title",
      published: true,
      content: "content",
      user: 5,
    },
    {
      id: "2",
      title: "title 2",
      published: true,
      content: "content 2",
      user: 7,
    },
  ];
};
