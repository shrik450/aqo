import React from "react";
import "./App.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import Header from "./components/Header";
import { Separator } from "./components/ui/separator";
import Query from "./pages/Query";
import Schema from "./pages/Schema";
import History from "./pages/History";
import { useStore } from "./lib/store";
import Optimize from "./pages/Optimize";

function App(): React.ReactElement {
  const [activeTab, setActiveTab] = useStore((state) => [
    state.activeTab,
    state.setActiveTab,
  ]);

  return (
    <div className="flex flex-col max-w-screen">
      <div className="w-[1000px] max-w-full overflow-x-hidden mx-auto">
        <Header />
        <Separator />
        <div className="p-4">
          <Tabs
            defaultValue="query"
            value={activeTab}
            onValueChange={(value) => {
              // @ts-expect-error radix doesn't know my tabs
              setActiveTab(value);
            }}
          >
            <TabsList>
              <TabsTrigger value="schema">Database Schema</TabsTrigger>
              <TabsTrigger value="query">Query</TabsTrigger>
              <TabsTrigger value="optimize">Optimize</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="query">
              <Query />
            </TabsContent>
            <TabsContent value="schema">
              <Schema />
            </TabsContent>
            <TabsContent value="optimize">
              <Optimize />
            </TabsContent>
            <TabsContent value="history">
              <History />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default App;
