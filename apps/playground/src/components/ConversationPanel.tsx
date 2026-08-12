import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { persista } from "../lib/persista";

export function ConversationPanel() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  async function handleRemember() {
    if (!message.trim()) return;

    try {
      setLoading(true);
      setStatus("idle");

      await persista.remember({
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      });

      setStatus("success");
      setMessage("");
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-violet-500/10 p-2 text-violet-400">
          <Sparkles size={18} />
        </div>

        <div>
          <h2 className="font-medium">
            Remember conversation
          </h2>
          <p className="text-sm text-white/40">
            Store meaningful context permanently.
          </p>
        </div>
      </div>

      <textarea
        value={message}
        onChange={(e) =>
          setMessage(e.target.value)
        }
        placeholder="I prefer TypeScript and Bun for backend development..."
        className="h-40 w-full resize-none rounded-xl border border-white/10 bg-black/20 p-4 text-sm outline-none transition placeholder:text-white/20 focus:border-violet-500/40"
      />

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-white/35">
          {status === "success" &&
            "✓ Memory stored successfully"}

          {status === "error" &&
            "Failed to store memory"}
        </div>

        <button
          onClick={handleRemember}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90 disabled:opacity-60"
        >
          {loading && (
            <Loader2
              size={16}
              className="animate-spin"
            />
          )}

          {loading ? "Remembering" : "Remember"}
        </button>
      </div>
    </section>
  );
}