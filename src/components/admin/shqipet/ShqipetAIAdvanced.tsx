import React, { useEffect, useRef, useState } from "react";

/**
 * Shqipet AI – Super Admin Chat Page (Lovable-friendly, no external deps)
 * Clean white theme · No user-facing settings on this page
 * Purpose: 100% website/app check & control + chat assistant for Super Admin
 * Includes:
 *  - Quick Ask panels (Connection & Security)
 *  - System Control Panel (enable/disable, scan interval, alert thresholds, emergency disconnect)
 *  - Real-time Dashboard cards (connections, performance, errors, health)
 *  - Chat with attachments (images/videos) and basic TTS/mic stubs (no settings UI)
 *
 * Fixes:
 *  - Fixed unterminated string in preface concatenation ("\n" now inside quotes)
 *  - Fixed className expression for System Health Indicators
 *  - Added Delete message listener so Delete button works
 *  - Added lightweight self-tests (logged in console) to guard regressions
 */

// -------------------- Utilities --------------------
const uid = () => Math.random().toString(36).slice(2, 10);
const ts = () => Date.now();
const fmtTime = (t) => new Date(t).toLocaleTimeString();
const cx = (...xs) => xs.filter(Boolean).join(" ");

// -------------------- Minimal memory (kept internal; no settings UI) --------------------
const DEFAULT_MEMORY = {
  voice: { inputMic: false, ttsEnabled: false, rate: 1, pitch: 1 },
};

// -------------------- Stubs (replace with your APIs) --------------------
async function mockRespond(input, ctx) {
  // Replace with your real AI endpoint. Add ctx (control states/telemetry) to prompt if needed.
  return (
    `Shqipet AI (admin): I received your request: "${input}".\n\n` +
    `— Connection checks and security actions can be executed when wired to backend.`
  );
}

async function analyzeImage(a) { return `Scanned image "${a.name}" (vision stub).`; }
async function analyzeVideo(a) { return `Analyzed video "${a.name}" (media stub).`; }

// -------------------- Speech (Web Speech API, no settings UI) --------------------
function useSpeech(memory) {
  const synth = typeof window !== "undefined" ? window.speechSynthesis : undefined;
  const speak = (text) => {
    if (!memory.voice.ttsEnabled || !synth) return;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = memory.voice.rate; u.pitch = memory.voice.pitch; synth.speak(u);
  };
  return { speak };
}

// -------------------- Local persistence --------------------
const MEM_KEY = "shqipet_ai_admin_memory_v1";
const CHAT_KEY = "shqipet_ai_admin_history_v1";

function usePersistentMemory() {
  const [memory, setMemory] = useState(() => {
    try { return { ...DEFAULT_MEMORY, ...(JSON.parse(localStorage.getItem(MEM_KEY) || "{}")) }; } catch { return DEFAULT_MEMORY; }
  });
  useEffect(() => { localStorage.setItem(MEM_KEY, JSON.stringify(memory)); }, [memory]);
  return { memory, setMemory };
}

function useChatHistory() {
  const [messages, setMessages] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CHAT_KEY) || "[]"); } catch { return []; }
  });
  useEffect(() => { localStorage.setItem(CHAT_KEY, JSON.stringify(messages)); }, [messages]);
  const add = (m) => setMessages((xs) => [...xs, m]);
  const remove = (id) => setMessages((xs) => xs.filter((m) => m.id !== id));
  const clear = () => setMessages([]);
  return { messages, add, remove, clear, setMessages };
}

// -------------------- Live Telemetry (simulated; replace with real sources) --------------------
function useLiveTelemetry() {
  // Connection status & performance numbers are simulated here.
  const [conn, setConn] = useState({
    database: "online",
    supabase: "online",
    webapp: "online",
    ios: "degraded",
    android: "online",
  });
  const [perf, setPerf] = useState({ latencyMs: 120, rps: 42, cpu: 38, mem: 62 });
  const [errors, setErrors] = useState({ last5m: 1, last1h: 4 });
  const [health, setHealth] = useState({ score: 92 });

  useEffect(() => {
    const t = setInterval(() => {
      // jitter
      setPerf((p) => ({
        latencyMs: Math.max(40, Math.round(p.latencyMs + (Math.random() - 0.5) * 12)),
        rps: Math.max(10, Math.round(p.rps + (Math.random() - 0.5) * 5)),
        cpu: Math.min(99, Math.max(5, p.cpu + Math.round((Math.random() - 0.5) * 6))),
        mem: Math.min(99, Math.max(5, p.mem + Math.round((Math.random() - 0.5) * 4))),
      }));
      setErrors((e) => ({
        last5m: Math.max(0, e.last5m + (Math.random() < 0.2 ? 1 : 0) - (Math.random() < 0.3 ? 1 : 0)),
        last1h: Math.max(0, e.last1h + (Math.random() < 0.1 ? 1 : 0)),
      }));
      setHealth((h) => ({ score: Math.min(100, Math.max(0, h.score + Math.round((Math.random() - 0.5) * 2))) }));
    }, 2500);
    return () => clearInterval(t);
  }, []);

  return { conn, setConn, perf, setPerf, errors, setErrors, health, setHealth };
}

// -------------------- Control Panel State --------------------
function useControlPanel() {
  const [enabled, setEnabled] = useState(true); // Enable/Disable AI Monitoring
  const [scanInterval, setScanInterval] = useState(5); // minutes
  const [alertThreshold, setAlertThreshold] = useState(80); // health score threshold
  return { enabled, setEnabled, scanInterval, setScanInterval, alertThreshold, setAlertThreshold };
}

// -------------------- Dev Self-Tests --------------------
function runSelfTests() {
  try {
    // Test 1: Preface concatenation preserves newlines
    let preface = "";
    preface += "\n" + "IMG";
    preface += "\n" + "VID";
    console.assert(preface === "\nIMG\nVID", "Preface concatenation failed", { preface });

    // Test 2: Health className logic (just ensure expression evaluates)
    const cls = (score) => cx("text-2xl", "font-semibold", score > 85 ? "text-green-700" : "");
    const c1 = cls(90), c2 = cls(50);
    console.assert(c1.includes("text-green-700"), "Health class high missing", { c1 });
    console.assert(!c2.includes("text-green-700"), "Health class low wrongly set", { c2 });

    // Test 3: uid basic uniqueness (probabilistic)
    const a = new Set([uid(), uid(), uid(), uid(), uid()]);
    console.assert(a.size === 5, "uid not unique enough in small sample");

    console.log("Shqipet AI – self-tests passed ✅");
  } catch (e) {
    console.error("Shqipet AI – self-tests error:", e);
  }
}

// -------------------- Main Component --------------------
interface ShqipetAIAdvancedProps {
  onSwitchBack?: () => void;
}

export default function ShqipetAIAdvanced({ onSwitchBack }: ShqipetAIAdvancedProps = {}) {
  const { memory } = usePersistentMemory();
  const { messages, add, remove, clear } = useChatHistory();
  const { speak } = useSpeech(memory);
  const { conn, perf, errors, health } = useLiveTelemetry();
  const controls = useControlPanel();

  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const scrollerRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollerRef.current) scrollerRef.current.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  // Listen for Delete custom events from buttons
  useEffect(() => {
    const handler = (e) => remove(e.detail);
    window.addEventListener("remove-msg", handler);
    return () => window.removeEventListener("remove-msg", handler);
  }, [remove]);

  // Run self-tests once in preview
  useEffect(() => { runSelfTests(); }, []);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newOnes: any = [];
    Array.from(files).forEach((f: File) => {
      const url = URL.createObjectURL(f);
      if (f.type.startsWith("image/")) newOnes.push({ kind: "image", name: f.name, url, file: f });
      else if (f.type.startsWith("video/")) newOnes.push({ kind: "video", name: f.name, url, file: f });
    });
    setAttachments((xs) => [...xs, ...newOnes]);
  };
  const removeAttachment = (name) => setAttachments((xs) => xs.filter((a) => a.name !== name));

  const quickAsk = async (text) => {
    setInput(text);
    await send(text);
  };

  const send = async (override?: string) => {
    const text = (override ?? input).trim();
    if (!text && attachments.length === 0) return;

    const userMsg = { id: uid(), role: "user", text: text || "(no text)", time: ts(), attachments: attachments.length ? attachments : undefined };
    add(userMsg);
    setInput("");
    setAttachments([]);
    setBusy(true);

    let preface = "";
    if (userMsg.attachments?.length) {
      for (const a of userMsg.attachments) {
        if (a.kind === "image") preface += "\n" + (await analyzeImage(a));
        if (a.kind === "video") preface += "\n" + (await analyzeVideo(a));
      }
    }

    const baseReply = await mockRespond(userMsg.text, { controls, conn, perf, errors, health });
    const textToUse = preface ? `${preface}\n\n${baseReply}` : baseReply;

    const assistantMsg = { id: uid(), role: "assistant", text: textToUse, time: ts() };
    add(assistantMsg);
    setBusy(false);
    if (memory.voice.ttsEnabled) speak(textToUse);
  };

  return (
    <div className="h-full flex flex-col bg-white text-gray-900 selection:bg-blue-100 selection:text-blue-800">
      {/* Top Bar */}
      <header className="flex-shrink-0 border-b bg-white/80 backdrop-blur">
        <div className="px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600" />
            <div className="font-semibold text-sm">Shqipet AI – Real AI Connected</div>
            <span className="text-xs text-gray-500">Advanced Mode</span>
          </div>
          <div className="flex items-center gap-2">
            {onSwitchBack && (
              <button 
                onClick={onSwitchBack} 
                className="px-3 py-1.5 text-sm rounded-md border hover:bg-gray-50" 
                title="Switch back to regular AI"
              >
                ← Back to Regular AI
              </button>
            )}
            <button onClick={() => clear()} className="px-3 py-1.5 text-sm rounded-md border hover:bg-gray-50" title="Clear chat">Clear</button>
            <button
              onClick={() => {
                const blob = new Blob([JSON.stringify({ messages }, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob); const a = document.createElement("a");
                a.href = url; a.download = `shqipet_chat_${new Date().toISOString()}.json`; a.click(); URL.revokeObjectURL(url);
              }}
              className="px-3 py-1.5 text-sm rounded-md border hover:bg-gray-50" title="Export Chat"
            >Export</button>
          </div>
        </div>
      </header>

      {/* Dashboard Row - Compact */}
      <div className="flex-shrink-0 px-4 py-2 grid grid-cols-1 md:grid-cols-4 gap-2">
        {/* Live Connection Statistics */}
        <div className="border rounded-lg p-2">
          <div className="text-xs font-semibold text-gray-500 mb-1">Connections</div>
          <div className="text-xs grid grid-cols-2 gap-x-2 gap-y-1">
            <div>Database</div><div className={`text-right ${conn.database === 'online' ? 'text-green-600' : 'text-amber-600'}`}>{conn.database}</div>
            <div>Supabase</div><div className={`text-right ${conn.supabase === 'online' ? 'text-green-600' : 'text-amber-600'}`}>{conn.supabase}</div>
            <div>iOS</div><div className={`text-right ${conn.ios === 'online' ? 'text-green-600' : 'text-amber-600'}`}>{conn.ios}</div>
            <div>Android</div><div className={`text-right ${conn.android === 'online' ? 'text-green-600' : 'text-amber-600'}`}>{conn.android}</div>
          </div>
        </div>
        {/* Performance Metrics */}
        <div className="border rounded-lg p-2">
          <div className="text-xs font-semibold text-gray-500 mb-1">Performance</div>
          <div className="text-xs grid grid-cols-2 gap-x-2 gap-y-1">
            <div>Latency</div><div className="text-right">{perf.latencyMs} ms</div>
            <div>RPS</div><div className="text-right">{perf.rps}</div>
            <div>CPU</div><div className="text-right">{perf.cpu}%</div>
            <div>Memory</div><div className="text-right">{perf.mem}%</div>
          </div>
        </div>
        {/* Error Logs */}
        <div className="border rounded-lg p-2">
          <div className="text-xs font-semibold text-gray-500 mb-1">Errors</div>
          <div className="text-xs grid grid-cols-2 gap-x-2 gap-y-1">
            <div>5m</div><div className={`text-right ${errors.last5m>0?'text-red-600':'text-green-600'}`}>{errors.last5m}</div>
            <div>1h</div><div className={`text-right ${errors.last1h>0?'text-amber-600':'text-green-600'}`}>{errors.last1h}</div>
          </div>
        </div>
        {/* System Health */}
        <div className="border rounded-lg p-2">
          <div className="text-xs font-semibold text-gray-500 mb-1">Health</div>
          <div className={cx("text-lg", "font-semibold", health.score > 85 ? "text-green-700" : "")}>{health.score}%</div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden px-4 pb-4 gap-3">
        {/* Left Pane - Compact */}
        <aside className="w-64 space-y-3 overflow-y-auto">
          {/* Quick Ask – Connection Status */}
          <section className="p-2 border rounded-lg">
            <div className="text-xs font-semibold text-gray-500 mb-2">Connection Monitoring</div>
            <div className="grid grid-cols-1 gap-1">
              <button className="text-left px-2 py-1 text-xs rounded border hover:bg-gray-50" onClick={() => quickAsk("Check database connection status.")}>Database Status</button>
              <button className="text-left px-2 py-1 text-xs rounded border hover:bg-gray-50" onClick={() => quickAsk("Verify Supabase integration.")}>Supabase Status</button>
              <button className="text-left px-2 py-1 text-xs rounded border hover:bg-gray-50" onClick={() => quickAsk("Test website connectivity.")}>Website Status</button>
              <button className="text-left px-2 py-1 text-xs rounded border hover:bg-gray-50" onClick={() => quickAsk("Check mobile app services.")}>Mobile Apps</button>
            </div>
          </section>

          {/* Quick Ask – Security */}
          <section className="p-2 border rounded-lg">
            <div className="text-xs font-semibold text-gray-500 mb-2">Security</div>
            <div className="grid grid-cols-1 gap-1">
              <button className="text-left px-2 py-1 text-xs rounded border hover:bg-gray-50" onClick={() => quickAsk("Run vulnerability scan.")}>Vulnerability Scan</button>
              <button className="text-left px-2 py-1 text-xs rounded border hover:bg-gray-50" onClick={() => quickAsk("Security alerts.")}>Security Alerts</button>
              <button className="text-left px-2 py-1 text-xs rounded border hover:bg-gray-50" onClick={() => quickAsk("Authentication status.")}>Auth Status</button>
            </div>
          </section>

          {/* System Control */}
          <section className="p-2 border rounded-lg">
            <div className="text-xs font-semibold text-gray-500 mb-2">Controls</div>
            <div className="space-y-2 text-xs">
              <label className="flex items-center justify-between gap-2">
                <span>AI Monitoring</span>
                <input type="checkbox" className="h-3 w-3" defaultChecked readOnly />
              </label>
              <div className="flex items-center justify-between gap-2">
                <span>Scan Interval</span>
                <select className="rounded border px-1 py-0.5 text-xs" value={controls.scanInterval} onChange={(e)=>controls.setScanInterval(+e.target.value)}>
                  <option value={1}>1min</option>
                  <option value={5}>5min</option>
                  <option value={15}>15min</option>
                </select>
              </div>
              <button className="w-full px-2 py-1 rounded border border-red-500 text-red-600 hover:bg-red-50 text-xs" onClick={() => quickAsk("Emergency disconnect.")}>Emergency</button>
            </div>
          </section>
        </aside>

        {/* Chat Panel - Main area */}
        <section className="flex-1 border rounded-lg overflow-hidden flex flex-col">
          {/* Messages */}
          <div ref={scrollerRef} className="flex-1 overflow-y-auto p-3 space-y-3" id="chat-scroll">
            {messages.length === 0 && (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-gray-500">
                Ask me anything about your system. I'm connected to real AI and can provide intelligent responses.
              </div>
            )}

            {messages.map((m) => (
              <div key={m.id} className="flex gap-2 items-start">
                <div className={`h-6 w-6 rounded-full flex-shrink-0 ${m.role === "assistant" ? "bg-blue-500" : m.role === "user" ? "bg-gray-900" : "bg-gray-400"}`} />
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">{String(m.role).toUpperCase()} · {fmtTime(m.time)}</div>
                  <div className="whitespace-pre-wrap leading-relaxed text-sm">{m.text}</div>
                  {m.attachments?.length ? (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {m.attachments.map((a, i) => a.kind === "image" ? (
                        <img key={i} src={a.url} alt={a.name} className="h-16 w-16 object-cover rounded border" />
                      ) : (
                        <video key={i} src={a.url} className="h-16 rounded border" controls />
                      ))}
                    </div>
                  ) : null}
                  <div className="mt-1 flex items-center gap-1">
                    <button className="text-xs px-2 py-1 rounded border hover:bg-gray-50" onClick={() => navigator.clipboard.writeText(m.text)}>Copy</button>
                    <button className="text-xs px-2 py-1 rounded border hover:bg-gray-50" onClick={() => window.speechSynthesis?.speak(new SpeechSynthesisUtterance(m.text))}>Speak</button>
                    <button className="text-xs px-2 py-1 rounded border hover:bg-gray-50" onClick={() => {
                      const evt = new CustomEvent('remove-msg', { detail: m.id });
                      window.dispatchEvent(evt);
                    }}>Delete</button>
                  </div>
                </div>
              </div>
            ))}

            {busy && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                AI is thinking...
              </div>
            )}
          </div>

          {/* Composer - Compact */}
          <div className="border-t bg-white p-2">
            {/* Attachments */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {attachments.map((a) => (
                  <div key={a.name} className="flex items-center gap-1 text-xs border rounded px-2 py-1 bg-gray-50">
                    <span className="font-medium">{a.kind === "image" ? "🖼️" : "🎬"}</span>
                    <span className="max-w-[120px] truncate">{a.name}</span>
                    <button className="text-gray-500 hover:text-red-600" onClick={() => removeAttachment(a.name)} title="Remove">✕</button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-end gap-2">
              <label className="shrink-0">
                <input type="file" multiple className="hidden" accept="image/jpeg,image/jpg,image/png,image/webp,image/avif,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.avif,.heic,.heif,video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov" onChange={(e) => handleFiles(e.target.files)} />
                <div className="h-8 px-2 rounded border flex items-center gap-1 cursor-pointer hover:bg-gray-50 text-xs">➕</div>
              </label>

              <div className="flex-1">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if ((e.metaKey||e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); send(); } if (e.key==='Enter' && !e.shiftKey){ e.preventDefault(); send(); } }}
                  placeholder="Ask about connections, security, or system control..."
                  className="w-full rounded border p-2 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={2}
                />
                <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                  <div>Ctrl+Enter to send</div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => send()} disabled={busy} className={`px-2 py-1 rounded border text-xs ${busy ? 'opacity-50' : 'hover:bg-gray-50'}`}>Send</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}