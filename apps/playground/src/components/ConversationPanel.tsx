import { useState } from "react";
import { Loader2} from "lucide-react";
import { persista } from "../lib/persista";

export function ConversationPanel() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");

  async function handleRemember() {
    const content = message.trim();

    if (!content || loading) {
      return;
    }

    setLoading(true);
    setStatus("idle");
    setError("");

    try {
      await persista.remember({
        messages: [
          {
            role: "user",
            content,
          },
        ],
      });

      setMessage("");
      setStatus("success");
    } catch (error) {
      console.error(
        "Failed to remember conversation:",
        error,
      );

      setStatus("error");

      setError(
        error instanceof Error
          ? error.message
          : "Failed to store memory.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <div className="mb-5 flex items-start gap-3">
        <div>
          <h2 className="font-medium">
            Remember conversation
          </h2>

          <p className="mt-1 text-sm text-white/40">
            Store meaningful context permanently.
          </p>
        </div>
      </div>

      <textarea
        value={message}
        onChange={(event) => {
          setMessage(event.target.value);

          if (status !== "idle") {
            setStatus("idle");
            setError("");
          }
        }}
        placeholder="I prefer TypeScript and Bun for backend development..."
        disabled={loading}
        className="h-40 w-full resize-none rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-violet-500/40 disabled:cursor-not-allowed disabled:opacity-50"
      />

      <div className="mt-4 flex min-h-8 items-center justify-between gap-4">
        <div className="min-w-0 text-xs">
          {status === "success" && (
            <span className="text-emerald-400">
              Memory stored successfully
            </span>
          )}

          {status === "error" && (
            <span className="text-red-400">
              {error}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleRemember}
          disabled={!message.trim() || loading}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading && (
            <Loader2
              size={16}
              className="animate-spin"
            />
          )}

          {loading
            ? "Remembering..."
            : "Remember"}
        </button>
      </div>
    </section>
  );
}