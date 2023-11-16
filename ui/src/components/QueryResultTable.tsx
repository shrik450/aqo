import { type QueryResult } from "@/lib/api";
import { type ReactElement } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const caption = (queryResult: QueryResult): string => {
  const queryTime = queryResult.query_time * 1000; // convert to ms
  const queryTimeStr = queryTime.toFixed(2);
  const baseCaption = `Fetched ${queryResult.rowcount} rows in ${queryTimeStr}ms.`;
  if (queryResult.rowcount === queryResult.results.length) {
    return baseCaption;
  } else {
    return `${baseCaption} (Limited to ${queryResult.results.length} rows)`;
  }
};

export default function QueryResultTable({
  queryResult,
}: {
  queryResult: QueryResult;
}): ReactElement {
  return (
    <Table className="caption-top">
      <TableCaption>{caption(queryResult)}</TableCaption>
      <TableHeader>
        <TableRow>
          {queryResult.headers.map((header) => (
            <TableHead key={header}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {queryResult.results.map((row) => (
          <TableRow key={row[0]}>
            {row.map((cell) => (
              <TableCell key={cell}>{cell}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
