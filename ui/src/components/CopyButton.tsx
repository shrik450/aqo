import { Check, Copy } from "lucide-react";
import { type ReactElement, useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function CopyButton({ text }: { text: string }): ReactElement {
  const [copied, setCopied] = useState(false);

  const onClick = useCallback(() => {
    void navigator.clipboard.writeText(text);
    setCopied(true);
  }, [text]);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [copied]);

  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="transition-all ease-in-out"
    >
      {copied ? (
        <Check className="mr-2 h-4 w-4" />
      ) : (
        <Copy className="mr-2 h-4 w-4" />
      )}
      {copied ? "Copied!" : "Copy"}
    </Button>
  );
}
