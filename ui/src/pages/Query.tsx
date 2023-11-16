import { useState, type ReactElement } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { format } from "sql-formatter";
import { Button } from "@/components/ui/button";
import CopyButton from "@/components/CopyButton";
import { Code, FastForward, Play } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { runQuery } from "@/lib/api";
import QueryResultTable from "@/components/QueryResultTable";
import { useStore } from "@/lib/store";

export default function Query(): ReactElement {
  const [query, setQuery] = useStore((state) => [state.query, state.setQuery]);
  const addQueryToHistory = useStore((state) => state.addQueryHistory);
  const [setOptimizeQuery, setActiveTab] = useStore((state) => [
    state.setOptimizeQueryInput,
    state.setActiveTab,
  ]);
  const [result, setResult] = useStore((state) => [
    state.queryResult,
    state.setQueryResult,
  ]);
  const [loading, setLoading] = useState(false);

  const onFormat = (): void => {
    const formattedQuery = format(query);
    setQuery(formattedQuery);
  };

  const onRun = (): void => {
    setLoading(true);
    void (async () => {
      const response = await runQuery(query);
      setResult(response);
      addQueryToHistory(query, response);
      setLoading(false);
    })();
  };

  const onOptimize = (): void => {
    setOptimizeQuery(query);
    setActiveTab("optimize");
  };

  return (
    <div className="flex flex-col">
      <CodeEditor
        value={query}
        data-color-mode="light"
        className="bg-muted rounded-md h-[30vh]"
        language="sql"
        placeholder="Enter your query here."
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        style={{
          fontSize: "0.875rem",
          fontFamily:
            "SF Mono,Consolas,Liberation Mono,Menlo,ui-monospace,monospace",
          overflow: "auto",
        }}
      />
      <Tabs defaultValue="result">
        <div className="flex flex-row justify-end gap-2 items-end mt-2">
          <TabsList>
            <TabsTrigger value="result">Result</TabsTrigger>
            <TabsTrigger value="explain">Explain</TabsTrigger>
          </TabsList>
          <div className="flex-1" />
          <Button variant="outline" onClick={onFormat}>
            <Code className="mr-2 h-4 w-4" />
            Format
          </Button>
          <CopyButton text={query} />
          <Button variant="outline" onClick={onOptimize}>
            <FastForward className="mr-2 h-4 w-4" /> Optimize
          </Button>
          <Button variant="default" onClick={onRun} disabled={loading}>
            <Play className="mr-2 h-4 w-4" /> Run
          </Button>
        </div>
        {loading ? (
          <p className="text-sm text-muted-foreground text-center w-full">
            Running...
          </p>
        ) : (
          <div className="h-[40vh] overflow-auto mt-2">
            <TabsContent value="result">
              {result !== null && result !== undefined ? (
                result.query_error === null ? (
                  <QueryResultTable queryResult={result} />
                ) : (
                  <div className="text-center w-full px-4">
                    <p className="text-muted-foreground">
                      Error: Query failed due to an error.
                    </p>
                    <p className="text-destructive">{result.query_error}</p>
                  </div>
                )
              ) : (
                <div className="text-muted-foreground text-center w-full">
                  No results to display.
                </div>
              )}
            </TabsContent>
            <TabsContent value="explain">
              <div className="p-4">
                {result !== null && result !== undefined ? (
                  <pre>{result.explain}</pre>
                ) : (
                  <p>No explain plan to show.</p>
                )}
              </div>
            </TabsContent>
          </div>
        )}
      </Tabs>
    </div>
  );
}
