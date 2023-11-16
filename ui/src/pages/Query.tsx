import { useState, type ReactElement } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { format } from "sql-formatter";
import { Button } from "@/components/ui/button";
import CopyButton from "@/components/CopyButton";
import { Code, Play } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type QueryResult, runQuery } from "@/lib/api";
import QueryResultTable from "@/components/QueryResultTable";

export default function Query(): ReactElement {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<QueryResult | null>(null);
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
      setLoading(false);
    })();
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
            <TabsTrigger value="errors">Errors</TabsTrigger>
            <TabsTrigger value="explain">Explain</TabsTrigger>
          </TabsList>
          <div className="flex-1" />
          <Button variant="outline" onClick={onFormat}>
            <Code className="mr-2 h-4 w-4" />
            Format
          </Button>
          <CopyButton text={query} />
          <Button variant="default" onClick={onRun}>
            <Play className="mr-2 h-4 w-4" /> Run
          </Button>
        </div>
        {loading ? (
          <div className="text-muted-foreground text-center w-full">
            Loading...
          </div>
        ) : (
          <div className="border rounded-md h-[40vh] overflow-auto mt-2">
            <TabsContent value="result">
              {result !== null && result !== undefined ? (
                result.query_error === null ? (
                  <QueryResultTable queryResult={result} />
                ) : (
                  <div className="text-muted-foreground text-center w-full">
                    Query failed. See the Errors tab for details.
                  </div>
                )
              ) : (
                <div className="text-muted-foreground text-center w-full">
                  No results to display.
                </div>
              )}
            </TabsContent>
            <TabsContent value="errors">
              <div className="p-4">
                {result !== null &&
                result !== undefined &&
                result.query_error !== null ? (
                  <p>{result.query_error}</p>
                ) : (
                  <p>No errors to display.</p>
                )}
              </div>
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
