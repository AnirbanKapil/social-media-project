
type GraphQLDocument = string | { toString(): string };

export async function fetchGraphQL<TData, TVariables>(
  query: GraphQLDocument,
  variables?: TVariables,
): Promise<TData> {
  const res = await fetch("/api/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apollo-require-preflight": "true",
    },
    body: JSON.stringify({ query: query.toString(), variables }),
  });

  const json = await res.json();
  if (!res.ok || json.errors) {
    throw new Error(json.errors?.[0]?.message ?? "GraphQL request failed");
  }
  return json.data as TData;
}

export const useCustomFetcher = <TData, TVariables>(query: GraphQLDocument, variables?: TVariables) => {
  return async (): Promise<TData> => fetchGraphQL<TData, TVariables>(query, variables);
};
