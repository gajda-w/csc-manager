import type { CodegenConfig } from '@graphql-codegen/cli';
import type { IGraphQLConfig } from 'graphql-config';

export const baseCodegenConfig: CodegenConfig['config'] = {
  avoidOptionals: {
    defaultValue: false,
    field: true,
    inputValue: false,
    object: false,
  },
  dedupeFragments: true,
  dedupeOperationSuffix: true,
  documentMode: 'string',
  enumsAsTypes: true,
  exportFragmentSpreadSubTypes: true,
  extractAllFieldsToTypes: true,
  mergeFragmentTypes: true,
  omitOperationSuffix: true,
  scalars: {
    Date: 'string',
    DateTime: 'string',
    Day: 'number',
    Decimal: 'number',
    GenericScalar: 'unknown',
    JSON: 'unknown',
    JSONString: 'string',
    Metadata: 'Record<string, string>',
    Minute: 'number',
    PositiveDecimal: 'number',
    UUID: 'string',
    Upload: 'unknown',
    WeightScalar: 'unknown',
    Hour: 'number',
    _Any: 'unknown',
  },
  skipTypename: true,
  strictScalars: true,
  useTypeImports: true,
};

const config: IGraphQLConfig = {
  projects: {
    handler: {
      schema: './src/apps/handler/api/graphql/schema.graphql',
      extensions: {
        codegen: {
          overwrite: true,
          generates: {
            './src/apps/handler/api/graphql/schema.ts': {
              plugins: ['typescript'],
              config: baseCodegenConfig,
            },
          },
        },
      },
    },
  },
};

export default config;
