
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: [
  {
    "http://localhost:3000/api/graphql": {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
  },
],
  documents: "**/*.{ts,tsx}",
  generates: {
    "lib/generated/": {
      preset: "client",
      plugins: []
    }
  }
};

export default config;
