import { useStore } from "@/lib/store";
import { useState, type ReactElement } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Code, FastForward, Zap } from "lucide-react";
import CopyButton from "@/components/CopyButton";
import { format } from "sql-formatter";
import { type OptimizedQuery, optimizeQuery as optimizeQueryAPI } from "@/lib/api";

const optimizedQueryText = (optimizedQuery: OptimizedQuery): string => {
  let resultString = "";
  if (
    optimizedQuery.query_advice !== null &&
    optimizedQuery.query_advice.length > 0
  ) {
    resultString += `-- ${optimizedQuery.query_advice}\n`;
  }
  if (
    optimizedQuery.query_optimized !== null &&
    optimizedQuery.query_optimized.length > 0
  ) {
    resultString += `${optimizedQuery.query_optimized}\n`;
  }
  if (resultString === "") {
    return "-- No Query Optimization";
  }
  return resultString;
};

const optimizedSchemaText = (optimizedQuery: OptimizedQuery): string => {
  let resultString = "";
  if (
    optimizedQuery.schema_advice !== null &&
    optimizedQuery.schema_advice.length > 0
  ) {
    resultString += `-- ${optimizedQuery.schema_advice}\n`;
  }
  if (
    optimizedQuery.schema_optimized !== null &&
    optimizedQuery.schema_optimized.length > 0
  ) {
    resultString += `${optimizedQuery.schema_optimized}\n`;
  }
  if (resultString === "") {
    return "-- No Schema Optimization";
  }
  return resultString;
};

export default function Optimize(): ReactElement {
  const [optimizeQuery, setOptimizeQuery, optimizedQuery, setOptimizedQuery] =
    useStore((state) => [
      state.optimizeQueryInput,
      state.setOptimizeQueryInput,
      state.optimizedQuery,
      state.setOptimizedQuery,
    ]);

  const [setQuery, setActiveTab] = useStore((state) => [
    state.setQuery,
    state.setActiveTab,
  ]);

  const [loading, setLoading] = useState(false);

  const onOptimizeFormat = (): void => {
    const formattedQuery = format(optimizeQuery);
    setOptimizeQuery(formattedQuery);
  };

  const onOptimize = (): void => {
    void (async () => {
      if (loading) {
        return;
      }
      setLoading(true);
      const response = await optimizeQueryAPI(optimizeQuery);
      setOptimizedQuery(response);
      setLoading(false);
    })();
  };

  const onApply = (): void => {
    if (optimizedQuery === null) {
      return;
    }

    setQuery(optimizedQuery.query_optimized);
    setActiveTab("query");
  };

  return (
    <div className="flex flex-col">
      <CodeEditor
        value={optimizeQuery}
        data-color-mode="light"
        className="bg-muted rounded-md h-[30vh]"
        language="sql"
        placeholder="Enter your query here."
        onChange={(e) => {
          setOptimizeQuery(e.target.value);
        }}
        style={{
          fontSize: "0.875rem",
          fontFamily:
            "SF Mono,Consolas,Liberation Mono,Menlo,ui-monospace,monospace",
          overflow: "auto",
        }}
      />
      <Tabs defaultValue="query">
        <div className="flex flex-row justify-end gap-2 items-end mt-2">
          <TabsList>
            <TabsTrigger value="query">Optimized Query</TabsTrigger>
            <TabsTrigger value="schema">Optimized Schema</TabsTrigger>
            <TabsTrigger value="explanation">Explanation</TabsTrigger>
          </TabsList>
          <div className="flex-1" />
          <Button variant="outline" onClick={onOptimizeFormat}>
            <Code className="mr-2 h-4 w-4" />
            Format
          </Button>
          <CopyButton text={optimizeQuery} />
          <Button variant="default" onClick={onOptimize} disabled={loading}>
            <Zap className="mr-2 h-4 w-4" /> Optimize
          </Button>
        </div>
        <div className="h-[40vh] overflow-auto">
          {loading ? (
            <p className="text-sm text-muted-foreground w-full text-center">
              Optimizing...
            </p>
          ) : optimizedQuery !== null ? (
            <>
              <TabsContent value="query">
                <CodeEditor
                  value={optimizedQueryText(optimizedQuery)}
                  data-color-mode="light"
                  className="bg-muted rounded-md h-[30vh]"
                  language="sql"
                  readOnly
                  style={{
                    fontSize: "0.875rem",
                    fontFamily:
                      "SF Mono,Consolas,Liberation Mono,Menlo,ui-monospace,monospace",
                    overflow: "auto",
                  }}
                />
                <div className="flex flex-row justify-end gap-2 items-end mt-2">
                  <CopyButton text={optimizedQuery.query_optimized} />
                  <Button variant="default" onClick={onApply}>
                    <FastForward className="mr-2 h-4 w-4" /> Apply
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="schema">
                <CodeEditor
                  value={optimizedSchemaText(optimizedQuery)}
                  data-color-mode="light"
                  className="bg-muted rounded-md h-[30vh]"
                  language="sql"
                  readOnly
                  style={{
                    fontSize: "0.875rem",
                    fontFamily:
                      "SF Mono,Consolas,Liberation Mono,Menlo,ui-monospace,monospace",
                    overflow: "auto",
                  }}
                />
                <div className="flex flex-row justify-end gap-2 items-end mt-2">
                  <CopyButton text={optimizedQuery.schema_optimized} />
                </div>
              </TabsContent>
              <TabsContent value="explanation">
                <CodeEditor
                  value={
                    optimizedQuery.explanation ?? "(No Explanation Available)"
                  }
                  data-color-mode="light"
                  className="bg-muted rounded-md h-[30vh]"
                  language="md"
                  readOnly
                  style={{
                    fontSize: "0.875rem",
                    fontFamily:
                      "SF Mono,Consolas,Liberation Mono,Menlo,ui-monospace,monospace",
                    overflow: "auto",
                  }}
                />
              </TabsContent>
            </>
          ) : (
            <p className="p-2 text-sm text-muted-foreground w-full text-center">
              Optimize a Query to see results.
            </p>
          )}
        </div>
        <p className="text-sm text-muted-foreground p-2 text-center w-full">
          Note: Optimization can take time. AI generated results may be
          incorrect or lead to data loss. Be cautious when running queries on
          actual data.
        </p>
      </Tabs>
    </div>
  );
}
