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
import { caption } from "@/lib/utils";

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
