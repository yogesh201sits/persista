import {
  Brain,
  Database,
  GitBranch,
  LayoutDashboard,
  Search,
  Settings,
} from "lucide-react";

import { ConversationPanel } from "./components/ConversationPanel";

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
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="flex w-64 shrink-0 flex-col border-r border-white/10 bg-[#0d0d0f]">
          {/* Logo */}
          <div className="border-b border-white/10 px-6 py-5">
            <div className="text-lg font-semibold tracking-tight">
              Persista
            </div>

            <div className="mt-1 text-xs text-white/40">
              Memory infrastructure
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  type="button"
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                    item.label === "Overview"
                      ? "bg-white/10 text-white"
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

          {/* Settings */}
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
              </div>

              <h1 className="text-3xl font-semibold tracking-tight">
                Memory overview
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
                Explore how Persista stores, retrieves, and
                manages persistent memory for your AI
                applications.
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
                value="—"
              />

              <Stat
                label="Conversations"
                value="—"
              />
            </div>

            {/* Workspace */}
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {/* Real Conversation Panel */}
              <ConversationPanel />

              {/* Search Panel */}
              <Panel
                title="Search memories"
                description="Retrieve relevant memories using semantic search."
              >
                <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <div className="text-xs text-white/30">
                    Query
                  </div>

                  <div className="mt-3 min-h-10 text-sm text-white/40">
                    Search input will appear here.
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-4 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Search
                </button>
              </Panel>
            </div>

            {/* Memories */}
            <Panel
              title="Recent memories"
              description="Memories currently stored by Persista."
              className="mt-6"
            >
              <div className="rounded-lg border border-dashed border-white/10 px-6 py-12 text-center">
                <Brain
                  size={22}
                  className="mx-auto text-white/20"
                />

                <div className="mt-3 text-sm text-white/40">
                  No memories loaded yet.
                </div>

                <div className="mt-1 text-xs text-white/25">
                  Add a conversation to create your first
                  memory.
                </div>
              </div>
            </Panel>
          </div>
        </main>
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