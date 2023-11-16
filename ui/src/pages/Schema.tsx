import { type Schema as SchemaType, fetchSchema } from "@/lib/api";
import { type ReactElement, useEffect } from "react";
import { format } from "sql-formatter";
import CodeEditor from "@uiw/react-textarea-code-editor";
import CopyButton from "@/components/CopyButton";
import { type Store, useStore } from "@/lib/store";

const statePicker = (
  state: Store,
): [SchemaType | null, (schema: SchemaType) => void] => [
  state.schema,
  state.setSchema,
];

export default function Schema(): ReactElement {
  const [schema, setSchema] = useStore(statePicker);

  useEffect(() => {
    if (schema === null) {
      void (async () => {
        const newSchema = await fetchSchema();
        setSchema(newSchema);
      })();
    }
  }, [schema, setSchema]);

  return schema === null ? (
    <p>Loading Schema...</p>
  ) : schema !== undefined ? (
    <div className="flex flex-col">
      <CodeEditor
        value={format(schema.schema)}
        language="sql"
        data-color-mode="light"
        readOnly
        className="bg-muted rounded-md h-[80vh]"
        style={{
          fontSize: "0.875rem",
          overflow: "auto",
          fontFamily:
            "SF Mono,Consolas,Liberation Mono,Menlo,ui-monospace,monospace",
        }}
      />
      <div className="flex flex-row justify-end items-baseline mt-2">
        <p className="flex-1 text-sm text-muted-foreground mr-auto">
          AQO does not currently support changing the schema. You can make
          changes to your schema using your regular DB Client.
        </p>
        <CopyButton text={schema.schema} />
      </div>
    </div>
  ) : (
    <div>
      Error fetching schema from Server. Is the server running and connected to
      a database?
    </div>
  );
}
