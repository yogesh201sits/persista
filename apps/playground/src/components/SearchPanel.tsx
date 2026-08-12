import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { persista } from "../lib/persista";

interface SearchResult {
  id: string;
  score: number;
  sources: string[];
  memory: {
    id: string;
    score: number;
    metadata: {
      content: string;
      type:
        | "fact"
        | "identity"
        | "preference"
        | "goal"
        | "relationship";
      confidence: number;
      value?: string;
      createdAt?: string;
      [key: string]: unknown;
    };
  };
}

export function SearchPanel() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch() {
    const value = query.trim();

    if (!value || loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await persista.search(value);

      console.log("Search response:", response);

      setResults(response);
    } catch (error) {
      console.error(
        "Failed to search memories:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to search memories.",
      );

      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      {/* Header */}
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
          <Search size={18} />
        </div>

        <div>
          <h2 className="font-medium text-white">
            Search memories
          </h2>

          <p className="mt-1 text-sm text-white/40">
            Retrieve relevant memories using semantic search.
          </p>
        </div>
      </div>

      {/* Search input */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
        />

        <input
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setError("");
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSearch();
            }
          }}
          placeholder="What does the user prefer?"
          className="h-12 w-full rounded-xl border border-white/10 bg-black/20 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-blue-500/40 focus:bg-black/30"
        />
      </div>

      {/* Search button */}
      <button
        type="button"
        onClick={handleSearch}
        disabled={!query.trim() || loading}
        className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading && (
          <Loader2
            size={16}
            className="animate-spin"
          />
        )}

        {loading ? "Searching..." : "Search"}
      </button>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-400">
          {error}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/30">
              {results.length}{" "}
              {results.length === 1
                ? "result"
                : "results"}
            </span>

            <span className="text-xs text-white/20">
              Semantic matches
            </span>
          </div>

          {results.map((result) => {
            const memory = result.memory;
            const metadata = memory.metadata;

            return (
              <div
                key={result.id}
                className="rounded-xl border border-white/10 bg-black/20 p-4 transition hover:border-white/15 hover:bg-white/[0.03]"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-blue-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-blue-400">
                        {metadata.type}
                      </span>

                      {metadata.value && (
                        <span className="text-xs text-white/30">
                          {metadata.value}
                        </span>
                      )}
                    </div>

                    {/* Memory content */}
                    <p className="mt-3 text-sm leading-6 text-white/80">
                      {metadata.content}
                    </p>
                  </div>

                  {/* Score */}
                  <div className="shrink-0 text-right">
                    <div className="text-[10px] uppercase tracking-wider text-white/20">
                      Score
                    </div>

                    <div className="mt-1 text-sm font-medium text-white">
                      {memory.score.toFixed(3)}
                    </div>
                  </div>
                </div>

                {/* Bottom metadata */}
                <div className="mt-4 flex items-center gap-4 border-t border-white/5 pt-3">
                  <span className="text-[11px] text-white/25">
                    Confidence{" "}
                    {metadata.confidence.toFixed(2)}
                  </span>

                  <span className="text-[11px] text-white/25">
                    Source{" "}
                    {result.sources.join(", ")}
                  </span>

                  {metadata.createdAt && (
                    <span className="ml-auto text-[11px] text-white/20">
                      {new Date(
                        metadata.createdAt,
                      ).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!loading &&
        !error &&
        results.length === 0 && (
          <div className="mt-6 rounded-xl border border-dashed border-white/10 px-5 py-8 text-center">
            <Search
              size={20}
              className="mx-auto text-white/20"
            />

            <p className="mt-3 text-sm text-white/35">
              Search your memories
            </p>

            <p className="mt-1 text-xs text-white/20">
              Ask a question about previously stored
              context.
            </p>
          </div>
        )}
    </section>
  );
}