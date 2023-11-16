import { create } from "zustand";
import { type OptimizedQuery, type QueryResult, type Schema } from "./api";

export interface QueryHistoryItem {
  query: string;
  queryResult: QueryResult;
}

export type Tabs = "query" | "schema" | "optimize" | "history";

export interface Store {
  schema: Schema | null;
  query: string;
  queryResult: QueryResult | null;
  queryHistory: QueryHistoryItem[];
  optimizeQueryInput: string;
  optimizedQuery: OptimizedQuery | null;
  activeTab: Tabs;
  setSchema: (schema: Schema) => void;
  setActiveTab: (tab: Tabs) => void;
  setQuery: (query: string) => void;
  setQueryResult: (result: QueryResult) => void;
  addQueryHistory: (query: string, result: QueryResult) => void;
  clearQueryHistory: () => void;
  setOptimizeQueryInput: (query: string) => void;
  setOptimizedQuery: (query: OptimizedQuery) => void;
}

export const useStore = create<Store>((set) => ({
  schema: null,
  query: "",
  queryResult: null,
  queryHistory: [],
  optimizeQueryInput: "",
  optimizedQuery: null,
  activeTab: "query",
  setSchema: (schema: Schema) => {
    set({ schema });
  },
  setActiveTab: (tab: Tabs) => {
    set({ activeTab: tab });
  },
  setQuery: (query: string) => {
    set({ query });
  },
  setQueryResult: (result: QueryResult) => {
    set({ queryResult: result });
  },
  addQueryHistory: (query: string, result: QueryResult) => {
    set((state: Store) => ({
      queryHistory: [{ query, queryResult: result }, ...state.queryHistory],
    }));
  },
  clearQueryHistory: () => {
    set({ queryHistory: [] });
  },
  setOptimizeQueryInput: (query: string) => {
    set({ optimizeQueryInput: query });
  },
  setOptimizedQuery: (query: OptimizedQuery) => {
    set({ optimizedQuery: query });
  },
}));
