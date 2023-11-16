const BASE_URL = "http://localhost:8000";

const apiFetch = async (
  path: string | URL,
  options?: RequestInit | undefined,
): Promise<Response> => {
  const finalUrl = new URL(path, BASE_URL);
  return await fetch(finalUrl.href, options);
};

export interface DbInfo {
  type: string;
  host: string;
  port: string;
  name: string;
  username: string;
  password: string;
}

export const fetchDbInfo = async (): Promise<DbInfo> => {
  const response = await apiFetch("/database");
  const dbinfo = await response.json() as DbInfo;
  return dbinfo;
};

export interface Schema {
  schema: string;
}

export const fetchSchema = async (): Promise<Schema> => {
  const response = await apiFetch("/schema");
  const schema = await response.json() as Schema;
  return schema;
};

export interface QueryResult {
  headers: string[];
  results: any[][];
  rowcount: number;
  query_time: number;
  query_error?: string;
  explain: string;
}

export const runQuery = async (query: string): Promise<QueryResult> => {
  const response = await apiFetch("/query", {
    method: "POST",
    body: JSON.stringify({ query }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await response.json() as QueryResult;
  return result;
};

export interface OptimizedQuery {
  query_advice: string;
  schema_advice: string;
  query_optimized: string;
  schema_optimized: string;
  explanation: string;
  error: string | null;
}

export const optimizeQuery = async (query: string): Promise<OptimizedQuery> => {
  const response = await apiFetch("/optimize", {
    method: "POST",
    body: JSON.stringify({ query }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await response.json() as OptimizedQuery;
  return result;
};
