import React from "react";
import "./App.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import Header from "./components/Header";
import { Separator } from "./components/ui/separator";
import Query from "./pages/Query";
import Schema from "./pages/Schema";

function App(): React.ReactElement {
  return (
    <div className="flex flex-col max-w-screen">
      <div className="w-[1000px] max-w-full overflow-x-hidden mx-auto">
        <Header />
        <Separator />
        <div className="p-4">
          <Tabs defaultValue="query" className="">
            <TabsList>
              <TabsTrigger value="schema">Database Schema</TabsTrigger>
              <TabsTrigger value="query">Query</TabsTrigger>
              <TabsTrigger value="optimize">Optimize</TabsTrigger>
            </TabsList>
            <TabsContent value="query">
              <Query />
            </TabsContent>
            <TabsContent value="schema">
              <Schema />
            </TabsContent>
            <TabsContent value="optimize">
              <div>Optimize</div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default App;
