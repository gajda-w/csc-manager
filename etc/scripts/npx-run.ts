/**
 * Helper runner for npx commands since not all libs support Deno yet:
 * - graphql-codegen - https://github.com/dotansimha/graphql-code-generator/issues/6206
 */
const command = new Deno.Command("npx", {
  args: Deno.args,
  stdout: "inherit", // Forward to parent process
  stderr: "inherit", // Forward to parent process
});

await command.spawn();
