import { useState } from "react";
import {
  Brain,
  Database,
  GitBranch,
  LayoutDashboard,
  Search,
  Send,
  Settings,
  Trash2,
} from "lucide-react";

import {
  PersistaClient,
  type HybridSearchResult,
} from "@persista/sdk";

const client = new PersistaClient({
  baseUrl: "http://localhost:3000",
});

const navigation = [
  {
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    label: "Memories",
    icon: Brain,
  },
  {
    label: "Search",
    icon: Search,
  },
  {
    label: "Graph",
    icon: GitBranch,
    comingSoon: true,
  },
];

function App() {
  const [activePage, setActivePage] =
    useState("Overview");

  const [conversation, setConversation] =
    useState("");

  const [query, setQuery] = useState("");

  const [searchResponse, setSearchResponse] =
    useState<HybridSearchResult | null>(null);

  const [remembering, setRemembering] =
    useState(false);

  const [searching, setSearching] =
    useState(false);

  const [rememberMessage, setRememberMessage] =
    useState("");

  const [searchError, setSearchError] =
    useState("");

  async function handleRemember() {
    if (!conversation.trim()) {
      return;
    }

    setRemembering(true);
    setRememberMessage("");

    try {
      await client.remember({
        messages: [
          {
            role: "user",
            content: conversation.trim(),
          },
        ],
      });

      setRememberMessage(
        "Memory stored successfully.",
      );

      setConversation("");
    } catch (error) {
      setRememberMessage(
        error instanceof Error
          ? error.message
          : "Failed to store memory.",
      );
    } finally {
      setRemembering(false);
    }
  }

  async function handleSearch() {
    if (!query.trim()) {
      return;
    }

    setSearching(true);
    setSearchError("");
    setSearchResponse(null);

    try {
      const response =
        await client.hybridSearch(
          query.trim(),
          {
            limit: 10,
            depth: 2,
          },
        );

      console.log(
        "Hybrid search response:",
        response,
      );

      setSearchResponse(response);
    } catch (error) {
      console.error(
        "Hybrid search failed:",
        error,
      );

      setSearchError(
        error instanceof Error
          ? error.message
          : "Hybrid search failed.",
      );
    } finally {
      setSearching(false);
    }
  }

  function clearSearch() {
    setQuery("");
    setSearchResponse(null);
    setSearchError("");
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <div className="flex min-h-screen">
        {/* Sidebar */}

        <aside className="flex w-64 shrink-0 flex-col border-r border-white/10 bg-[#0d0d0f]">
          <div className="border-b border-white/10 px-6 py-5">
            <div className="text-lg font-semibold tracking-tight">
              Persista
            </div>

            <div className="mt-1 text-xs text-white/40">
              Memory infrastructure
            </div>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const Icon = item.icon;

              const active =
                activePage === item.label;

              return (
                <button
                  key={item.label}
                  type="button"
                  disabled={item.comingSoon}
                  onClick={() =>
                    setActivePage(item.label)
                  }
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                    active
                      ? "bg-white/10 text-white"
                      : item.comingSoon
                        ? "cursor-not-allowed text-white/20"
                        : "text-white/50 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon
                    size={17}
                    strokeWidth={1.8}
                  />

                  <span>{item.label}</span>

                  {item.comingSoon && (
                    <span className="ml-auto rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/30">
                      Soon
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="border-t border-white/10 p-4">
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/50 transition hover:bg-white/5 hover:text-white"
            >
              <Settings
                size={17}
                strokeWidth={1.8}
              />

              <span>Settings</span>
            </button>
          </div>
        </aside>

        {/* Main */}

        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-7xl px-8 py-10">
            {/* Header */}

            <div className="mb-10">
              <div className="mb-2 flex items-center gap-2 text-sm text-white/40">
                <Database size={15} />

                <span>Playground</span>

                <span className="text-white/20">
                  /
                </span>

                <span>{activePage}</span>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight">
                Memory overview
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
                Explore how Persista stores,
                retrieves, and manages persistent
                memory for your AI applications.
              </p>
            </div>

            {/* Stats */}

            <div className="grid gap-4 sm:grid-cols-3">
              <Stat
                label="Memories"
                value="—"
              />

              <Stat
                label="Searches"
                value={
                  searchResponse
                    ? "1"
                    : "—"
                }
              />

              <Stat
                label="Conversations"
                value="—"
              />
            </div>

            {/* Remember + Search */}

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {/* Remember */}

              <Panel
                title="Remember"
                description="Add a conversation and let Persista extract what matters."
              >
                <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <div className="text-xs text-white/30">
                    Conversation
                  </div>

                  <textarea
                    value={conversation}
                    onChange={(event) =>
                      setConversation(
                        event.target.value,
                      )
                    }
                    placeholder="I prefer TypeScript for my projects..."
                    rows={5}
                    className="mt-3 w-full resize-none bg-transparent text-sm text-white outline-none placeholder:text-white/20"
                  />
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    disabled={
                      remembering ||
                      !conversation.trim()
                    }
                    onClick={handleRemember}
                    className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Send size={14} />

                    {remembering
                      ? "Remembering..."
                      : "Remember"}
                  </button>

                  {rememberMessage && (
                    <span className="text-xs text-white/40">
                      {rememberMessage}
                    </span>
                  )}
                </div>
              </Panel>

              {/* Hybrid Search */}

              <Panel
                title="Hybrid search"
                description="Retrieve relevant memories using semantic vector search and graph retrieval."
              >
                <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <div className="text-xs text-white/30">
                    Query
                  </div>

                  <input
                    type="text"
                    value={query}
                    onChange={(event) =>
                      setQuery(
                        event.target.value,
                      )
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        !searching
                      ) {
                        handleSearch();
                      }
                    }}
                    placeholder="What do I prefer?"
                    className="mt-3 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/20"
                  />
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    disabled={
                      searching ||
                      !query.trim()
                    }
                    onClick={handleSearch}
                    className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Search size={14} />

                    {searching
                      ? "Searching..."
                      : "Search"}
                  </button>

                  {searchResponse && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/50 transition hover:bg-white/10 hover:text-white"
                    >
                      <Trash2 size={13} />

                      Clear
                    </button>
                  )}
                </div>

                {searchError && (
                  <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-300">
                    {searchError}
                  </div>
                )}
              </Panel>
            </div>

            {/* Vector + Graph Results */}

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {/* Vector */}

              <Panel
                title="Vector results"
                description="Semantically relevant memories retrieved from the vector store."
              >
                {searchResponse ? (
                  <ResultViewer
                    value={
                      searchResponse.vector
                    }
                    label="Vector retrieval"
                    icon={
                      <Search size={17} />
                    }
                  />
                ) : (
                  <EmptyResult
                    icon={
                      <Search size={22} />
                    }
                    title="No vector results yet."
                    description="Run a hybrid search to retrieve semantic memories."
                  />
                )}
              </Panel>

              {/* Graph */}

              <Panel
                title="Graph results"
                description="Entities and relationships retrieved from the knowledge graph."
              >
                {searchResponse ? (
                  <ResultViewer
                    value={
                      searchResponse.graph
                    }
                    label="Graph retrieval"
                    icon={
                      <GitBranch
                        size={17}
                      />
                    }
                  />
                ) : (
                  <EmptyResult
                    icon={
                      <GitBranch
                        size={22}
                      />
                    }
                    title="No graph results yet."
                    description="Run a hybrid search to retrieve graph context."
                  />
                )}
              </Panel>
            </div>

            {/* Raw Response */}

            <Panel
              title="Hybrid search response"
              description="Raw response returned by the Persista SDK."
              className="mt-6"
            >
              {searchResponse ? (
                <div className="overflow-hidden rounded-lg border border-white/10 bg-black/40">
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-400" />

                      <span className="text-xs text-white/40">
                        Hybrid response
                      </span>
                    </div>

                    <span className="text-[10px] text-white/20">
                      Persista SDK
                    </span>
                  </div>

                  <pre className="max-h-[600px] overflow-auto p-5 font-mono text-xs leading-6 text-white/70">
                    {JSON.stringify(
                      searchResponse,
                      null,
                      2,
                    )}
                  </pre>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-white/10 px-6 py-12 text-center">
                  <Search
                    size={22}
                    className="mx-auto text-white/20"
                  />

                  <div className="mt-3 text-sm text-white/40">
                    No response yet.
                  </div>

                  <div className="mt-1 text-xs text-white/25">
                    Run a hybrid search to inspect
                    vector and graph retrieval.
                  </div>
                </div>
              )}
            </Panel>

            {/* Memories */}

            <Panel
              title="Recent memories"
              description="Memory management will become a dashboard later."
              className="mt-6"
            >
              <div className="rounded-lg border border-dashed border-white/10 px-6 py-10 text-center">
                <Brain
                  size={22}
                  className="mx-auto text-white/20"
                />

                <div className="mt-3 text-sm text-white/40">
                  Memory dashboard coming later.
                </div>

                <div className="mt-1 text-xs text-white/25">
                  For now, the Playground shows
                  retrieval results and raw API
                  responses.
                </div>
              </div>
            </Panel>
          </div>
        </main>
      </div>
    </div>
  );
}

function ResultViewer({
  value,
  label,
  icon,
}: {
  value: unknown;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-black/40">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <div className="text-white/30">
          {icon}
        </div>

        <span className="text-xs text-white/40">
          {label}
        </span>
      </div>

      <pre className="max-h-[400px] overflow-auto p-4 font-mono text-xs leading-6 text-white/65">
        {JSON.stringify(
          value,
          null,
          2,
        )}
      </pre>
    </div>
  );
}

function EmptyResult({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-white/10 px-6 py-10 text-center">
      <div className="flex justify-center text-white/20">
        {icon}
      </div>

      <div className="mt-3 text-sm text-white/40">
        {title}
      </div>

      <div className="mt-1 text-xs text-white/25">
        {description}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0d0d0f] p-5">
      <div className="text-xs text-white/35">
        {label}
      </div>

      <div className="mt-2 text-2xl font-semibold tracking-tight">
        {value}
      </div>
    </div>
  );
}

function Panel({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border border-white/10 bg-[#0d0d0f] p-5 ${className}`}
    >
      <div className="mb-5">
        <h2 className="text-sm font-medium">
          {title}
        </h2>

        <p className="mt-1 text-xs leading-5 text-white/35">
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}

export default App;