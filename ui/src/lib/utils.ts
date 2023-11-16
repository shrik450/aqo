import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type QueryResult } from "./api";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const caption = (queryResult: QueryResult): string => {
  const queryTime = queryResult.query_time * 1000; // convert to ms
  const queryTimeStr = queryTime.toFixed(2);
  const baseCaption =
    `Fetched ${queryResult.rowcount} rows in ${queryTimeStr}ms.`;
  if (queryResult.rowcount === queryResult.results.length) {
    return baseCaption;
  } else {
    return `${baseCaption} (Limited to ${queryResult.results.length} rows)`;
  }
};
