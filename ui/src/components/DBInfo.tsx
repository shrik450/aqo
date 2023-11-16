import { useState, type ReactElement, useEffect } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Info } from "lucide-react";
import { type DbInfo, fetchDbInfo } from "@/lib/api";

export default function DBInfo(): ReactElement {
  const [dbInfo, setDbInfo] = useState<DbInfo | null>(null);

  useEffect(() => {
    if (dbInfo === null) {
      void (async () => {
        setDbInfo(await fetchDbInfo());
      })();
    }
  }, [dbInfo, setDbInfo]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Info className="mr-2 h-4 w-4" /> Database Info
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        {dbInfo !== null && dbInfo !== undefined ? (
          <div className="grid gap-4 w-full">
            <div className="grid gap-2 w-full">
              <div className="grid grid-cols-2 items-center gap-4">
                <div>Database Type</div>
                <pre className="text-end">{dbInfo.type}</pre>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <div>Database Name</div>
                <pre className="text-end">{dbInfo.name}</pre>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <div>Database Host</div>
                <pre className="text-end">
                  {dbInfo.host}:{dbInfo.port}
                </pre>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <div>Database Username</div>
                <pre className="text-end">{dbInfo.username}</pre>
              </div>
              <div className="space-y-2 min-w-[35ch] max-w-min">
                <p className="text-sm text-muted-foreground">
                  To change these values, restart the server with a different
                  config file.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p>
            Unable to connect to the server. Are you sure it&rsquo;s running?
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
}
