import type { ReactElement } from "react";
import DBInfo from "./DBInfo";

export default function Header(): ReactElement {
  return (
    <div className="flex flex-row items-baseline py-4 px-2">
      <h1 className="text-xl font-bold">AQO</h1>
      <div className="flex-1"></div>
      <DBInfo />
    </div>
  );
}
