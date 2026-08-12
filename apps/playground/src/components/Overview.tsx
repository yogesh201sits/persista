import { ConversationPanel } from "./ConversationPanel";
import { SearchPanel } from "./SearchPanel";
import { MemoryList } from "./MemoryList";

export function Overview() {
  return (
    <div className="mx-auto max-w-7xl p-8">
      <header className="mb-8">
        <p className="text-sm text-white/40">
          Playground
        </p>

        <h1 className="mt-2 text-3xl font-semibold">
          Memory overview
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-white/45">
          Explore how Persista remembers,
          stores and retrieves context.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <ConversationPanel />
        <SearchPanel />
      </div>

      <div className="mt-6">
        <MemoryList />
      </div>
    </div>
  );
}