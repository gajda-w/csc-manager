import { config } from 'dotenv';

config();

/**
 * https://github.com/graphql/graphiql/blob/main/packages/graphql-language-service-server/README.md
 */
export default {
  projects: {
    default: {
      schema: './src/apps/handler/api/graphql/schema.graphql',
      documents: ['./src/**/api/graphql/**/*.graphql'],
      schemaCacheTTL: 60 * 60 * 1000, // In ms
      extensions: {
        languageService: {
          cacheSchemaFileForLookup: false,
          enableValidation: true,
          fillLeafsOnComplete: true,
        },
      },
    },
  },
};
