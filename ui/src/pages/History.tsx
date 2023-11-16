import { type QueryHistoryItem, useStore } from "@/lib/store";
import { caption } from "@/lib/utils";
import { type ReactElement } from "react";

export default function History(): ReactElement {
  const history = useStore((state) => state.queryHistory);
  const [setQuery, setQueryResult, setActiveTab] = useStore((state) => [
    state.setQuery,
    state.setQueryResult,
    state.setActiveTab,
  ]);

  const onQueryClick = (queryHistoryItem: QueryHistoryItem): void => {
    setQuery(queryHistoryItem.query);
    setQueryResult(queryHistoryItem.queryResult);
    setActiveTab("query");
  };

  return (
    <div className="flex flex-col h-full max-h-full overflow-hidden">
      <ul className="flex flex-col border rounded-md max-h-[80%] overflow-auto">
        {history.length > 0 ? (
          history.map((query, index) => (
            <li
              key={index}
              className="flex flex-col border-b last:border-0 items-center hover:bg-muted/50 data-[state=selected]:bg-muted transition-colors"
              onClick={() => {
                onQueryClick(query);
              }}
            >
              <pre className="max-w-prose truncate">{query.query}</pre>
              <div className="max-w-prose truncate">
                {caption(query.queryResult)}
              </div>
            </li>
          ))
        ) : (
          <p className="text-sm text-muted-foreground p-2 text-center w-full">
            No Query History.
          </p>
        )}
      </ul>

      <p className="text-sm text-muted-foreground p-2 text-center w-full">
        Queries you have run. The most recent query is on top. Click on a query
        to see it again in the query tab.
      </p>
    </div>
  );
}
