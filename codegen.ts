
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "./graphql/**/*.ts",
  documents: [
  "app/**/*.{ts,tsx,graphql}",
  "!node_modules",
  "!**/*.test.*",
  "!**/__tests__/**"
],
  generates: {
    "lib/generated/": {
      preset: "client",
      plugins: []
    }
  }
};

export default config;
