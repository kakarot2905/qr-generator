"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import QRCode from "qrcode";
import { useAuth } from "@/context/AuthContext";
import LoginPage from "@/components/LoginPage";
import { saveQR, getUserQRs, deleteQR, clearAllQRs } from "@/lib/qrService";

/* ── Icons (thin, minimal) ── */

const I = {
  Link: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  Text: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  Wifi: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
  ),
  Mail: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Phone: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Contact: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  QR: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="3" height="3" />
      <rect x="18" y="14" width="3" height="3" />
      <rect x="14" y="18" width="3" height="3" />
      <rect x="18" y="18" width="3" height="3" />
    </svg>
  ),
  Down: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Copy: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  Trash: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Share: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  ),
  Logout: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
};

/* ── Tab config ── */

const TABS = [
  { id: "url", label: "URL" },
  { id: "text", label: "Text" },
  { id: "wifi", label: "WiFi" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "vcard", label: "vCard" },
];

const ECL = ["L", "M", "Q", "H"];
const ECL_LABEL = { L: "7%", M: "15%", Q: "25%", H: "30%" };

/* ── Toast ── */

function Toasts({ items }) {
  return (
    <div className="toast-wrap">
      {items.map((t) => (
        <div key={t.id} className={`toast ${t.exiting ? "toast-exit" : ""} ${t.type === "error" ? "toast-error" : ""}`}>
          {t.type === "success" ? <I.Check /> : t.type === "error" ? <I.X /> : <I.Check />}
          {t.message}
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════ */

export default function Page() {
  const { user, loading: authLoading, logout } = useAuth();
  const [tab, setTab] = useState("url");

  // inputs
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [ssid, setSsid] = useState("");
  const [wpass, setWpass] = useState("");
  const [wenc, setWenc] = useState("WPA");
  const [eTo, setETo] = useState("");
  const [eSub, setESub] = useState("");
  const [eBody, setEBody] = useState("");
  const [phone, setPhone] = useState("");
  const [vName, setVName] = useState("");
  const [vPhone, setVPhone] = useState("");
  const [vEmail, setVEmail] = useState("");
  const [vOrg, setVOrg] = useState("");

  // style
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const [size, setSize] = useState(256);
  const [ecl, setEcl] = useState("M");

  // output
  const [dataUrl, setDataUrl] = useState(null);
  const [svg, setSvg] = useState(null);
  const [qrText, setQrText] = useState("");
  const [busy, setBusy] = useState(false);

  // intro
  const [introVisible, setIntroVisible] = useState(true);
  const [introExiting, setIntroExiting] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // history & toasts
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const tid = useRef(0);

  // intro timer
  useEffect(() => {
    const t1 = setTimeout(() => setIntroExiting(true), 1800);
    const t2 = setTimeout(() => setIntroVisible(false), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Load history from Firestore when user signs in
  useEffect(() => {
    if (!user) { setHistory([]); return; }
    setHistoryLoading(true);
    getUserQRs(user.uid)
      .then((qrs) => setHistory(qrs))
      .catch(() => {})
      .finally(() => setHistoryLoading(false));
  }, [user]);

  const toast = useCallback((message, type = "success") => {
    const id = ++tid.current;
    setToasts((p) => [...p, { id, message, type, exiting: false }]);
    setTimeout(() => {
      setToasts((p) => p.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
      setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 200);
    }, 2200);
  }, []);

  /* build data string */
  const buildData = useCallback(() => {
    switch (tab) {
      case "url": {
        if (!url.trim()) return null;
        const u = url.trim();
        return /^https?:\/\//i.test(u) ? u : `https://${u}`;
      }
      case "text": return text.trim() || null;
      case "wifi":
        return ssid.trim() ? `WIFI:T:${wenc};S:${ssid};P:${wpass};H:false;;` : null;
      case "email": {
        if (!eTo.trim()) return null;
        let m = `mailto:${eTo.trim()}`;
        const p = [];
        if (eSub.trim()) p.push(`subject=${encodeURIComponent(eSub.trim())}`);
        if (eBody.trim()) p.push(`body=${encodeURIComponent(eBody.trim())}`);
        if (p.length) m += `?${p.join("&")}`;
        return m;
      }
      case "phone": return phone.trim() ? `tel:${phone.trim()}` : null;
      case "vcard": {
        if (!vName.trim()) return null;
        const l = ["BEGIN:VCARD", "VERSION:3.0", `FN:${vName.trim()}`];
        if (vPhone.trim()) l.push(`TEL:${vPhone.trim()}`);
        if (vEmail.trim()) l.push(`EMAIL:${vEmail.trim()}`);
        if (vOrg.trim()) l.push(`ORG:${vOrg.trim()}`);
        l.push("END:VCARD");
        return l.join("\n");
      }
      default: return null;
    }
  }, [tab, url, text, ssid, wpass, wenc, eTo, eSub, eBody, phone, vName, vPhone, vEmail, vOrg]);

  const displayText = useCallback(() => {
    switch (tab) {
      case "url": return url.trim();
      case "text": return text.trim().substring(0, 40);
      case "wifi": return `WiFi: ${ssid.trim()}`;
      case "email": return emailLabel();
      case "phone": return `Tel: ${phone.trim()}`;
      case "vcard": return vName.trim();
      default: return "";
    }
    function emailLabel() { return `${eTo.trim()}`; }
  }, [tab, url, text, ssid, eTo, phone, vName]);

  const ready = useCallback(() => {
    switch (tab) {
      case "url": return url.trim().length > 0;
      case "text": return text.trim().length > 0;
      case "wifi": return ssid.trim().length > 0;
      case "email": return eTo.trim().length > 0;
      case "phone": return phone.trim().length > 0;
      case "vcard": return vName.trim().length > 0;
      default: return false;
    }
  }, [tab, url, text, ssid, eTo, phone, vName]);

  /* generate */
  const generate = useCallback(async () => {
    if (!user) {
      setShowLoginModal(true);
      toast("Please sign in to generate QR codes", "info");
      return;
    }
    const d = buildData();
    if (!d) { toast("Fill in the required fields", "error"); return; }
    setBusy(true);
    try {
      const opts = { errorCorrectionLevel: ecl, width: size, margin: 2, color: { dark: fg, light: bg } };
      const du = await QRCode.toDataURL(d, opts);
      const sv = await QRCode.toString(d, { ...opts, type: "svg" });
      setDataUrl(du);
      setSvg(sv);
      setQrText(d);
      const qrItem = { text: displayText(), data: d, dataUrl: du, type: tab };
      // Save to Firestore in the background so it doesn't block the UI
      if (user) {
        saveQR(user.uid, qrItem)
          .then((docId) => {
            setHistory((p) => [{ id: docId, ...qrItem, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }, ...p]);
          })
          .catch((err) => {
            console.error("Failed to save QR to Firestore:", err);
          });
      }
      toast("QR code generated");
    } catch { toast("Generation failed", "error"); }
    finally { setBusy(false); }
  }, [buildData, ecl, size, fg, bg, tab, displayText, toast, user]);

  /* actions */
  const dlPNG = useCallback(() => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.download = `qr-${Date.now()}.png`;
    a.href = dataUrl;
    a.click();
    toast("PNG saved");
  }, [dataUrl, toast]);

  const dlSVG = useCallback(() => {
    if (!svg) return;
    const b = new Blob([svg], { type: "image/svg+xml" });
    const u = URL.createObjectURL(b);
    const a = document.createElement("a");
    a.download = `qr-${Date.now()}.svg`;
    a.href = u;
    a.click();
    URL.revokeObjectURL(u);
    toast("SVG saved");
  }, [svg, toast]);

  const copy = useCallback(async () => {
    if (!dataUrl) return;
    try {
      const r = await fetch(dataUrl);
      const b = await r.blob();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": b })]);
      toast("Copied to clipboard");
    } catch {
      try { await navigator.clipboard.writeText(qrText); toast("Text copied"); }
      catch { toast("Copy failed", "error"); }
    }
  }, [dataUrl, qrText, toast]);

  const share = useCallback(async () => {
    if (!dataUrl) return;
    if (navigator.share) {
      try {
        const r = await fetch(dataUrl);
        const b = await r.blob();
        const f = new File([b], "qr.png", { type: "image/png" });
        await navigator.share({ title: "QR Code", text: qrText, files: [f] });
      } catch (e) { if (e.name !== "AbortError") toast("Share failed", "error"); }
    } else {
      try { await navigator.clipboard.writeText(qrText); toast("Link copied"); }
      catch { toast("Share unavailable", "error"); }
    }
  }, [dataUrl, qrText, toast]);

  const clear = useCallback(() => { setDataUrl(null); setSvg(null); setQrText(""); toast("Cleared", "info"); }, [toast]);

  /* ── form fields ── */

  const fields = () => {
    switch (tab) {
      case "url":
        return (
          <div className="field">
            <label className="label" htmlFor="url-input">Website URL</label>
            <input id="url-input" className="input" type="url" placeholder="example.com" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && generate()} />
          </div>
        );
      case "text":
        return (
          <div className="field">
            <label className="label" htmlFor="text-input">Text content</label>
            <textarea id="text-input" className="textarea" placeholder="Type anything..." value={text} onChange={(e) => setText(e.target.value)} rows={4} />
          </div>
        );
      case "wifi":
        return (
          <>
            <div className="field">
              <label className="label" htmlFor="wifi-ssid">Network name</label>
              <input id="wifi-ssid" className="input" placeholder="My WiFi" value={ssid} onChange={(e) => setSsid(e.target.value)} />
            </div>
            <div className="field">
              <label className="label" htmlFor="wifi-pass">Password</label>
              <input id="wifi-pass" className="input" type="password" placeholder="Password" value={wpass} onChange={(e) => setWpass(e.target.value)} />
            </div>
            <div className="field">
              <label className="label">Encryption</label>
              <div className="seg">
                {["WPA", "WEP", "nopass"].map((e) => (
                  <button key={e} type="button" className={`seg-btn ${wenc === e ? "active" : ""}`} onClick={() => setWenc(e)}>{e === "nopass" ? "None" : e}</button>
                ))}
              </div>
            </div>
          </>
        );
      case "email":
        return (
          <>
            <div className="field">
              <label className="label" htmlFor="email-to">Email address</label>
              <input id="email-to" className="input" type="email" placeholder="hello@example.com" value={eTo} onChange={(e) => setETo(e.target.value)} />
            </div>
            <div className="field">
              <label className="label" htmlFor="email-sub">Subject</label>
              <input id="email-sub" className="input" placeholder="Optional" value={eSub} onChange={(e) => setESub(e.target.value)} />
            </div>
            <div className="field">
              <label className="label" htmlFor="email-body">Body</label>
              <textarea id="email-body" className="textarea" placeholder="Optional" value={eBody} onChange={(e) => setEBody(e.target.value)} rows={3} />
            </div>
          </>
        );
      case "phone":
        return (
          <div className="field">
            <label className="label" htmlFor="phone-input">Phone number</label>
            <input id="phone-input" className="input" type="tel" placeholder="+1 555 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} onKeyDown={(e) => e.key === "Enter" && generate()} />
          </div>
        );
      case "vcard":
        return (
          <>
            <div className="field">
              <label className="label" htmlFor="vc-name">Full name *</label>
              <input id="vc-name" className="input" placeholder="Jane Doe" value={vName} onChange={(e) => setVName(e.target.value)} />
            </div>
            <div className="row">
              <div className="field">
                <label className="label" htmlFor="vc-phone">Phone</label>
                <input id="vc-phone" className="input" type="tel" placeholder="+1 555 0000" value={vPhone} onChange={(e) => setVPhone(e.target.value)} />
              </div>
              <div className="field">
                <label className="label" htmlFor="vc-email">Email</label>
                <input id="vc-email" className="input" type="email" placeholder="jane@co.com" value={vEmail} onChange={(e) => setVEmail(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="vc-org">Organization</label>
              <input id="vc-org" className="input" placeholder="Company" value={vOrg} onChange={(e) => setVOrg(e.target.value)} />
            </div>
          </>
        );
      default: return null;
    }
  };

  /* ── render ── */

  // Auth loading state
  if (authLoading) {
    return (
      <div className="auth-loading">
        <span className="spin spin-lg" />
      </div>
    );
  }

  return (
    <>
    {/* Intro overlay */}
    {introVisible && (
      <div className={`intro-overlay ${introExiting ? "intro-exit" : ""}`}>
        <div className="intro-content">
          <div className="intro-icon"><I.QR /></div>
          <div className="intro-title">QR Forge</div>
          <div className="intro-line" />
        </div>
      </div>
    )}

    <div className={`app ${introVisible ? "app-hidden" : "app-visible"}`}>
      {/* Header with user bar */}
      <header className="header">
        <div className="header-row">
          <h1>QR Forge<span>generator</span></h1>
          {user ? (
            <div className="user-bar">
              <div className="user-avatar">{(user.displayName || user.email || "U")[0].toUpperCase()}</div>
              <div className="user-info">
                <span className="user-name">{user.displayName || "User"}</span>
                <span className="user-email">{user.email}</span>
              </div>
              <button id="logout-btn" type="button" className="btn btn-ghost" onClick={logout}>
                <I.Logout /> Sign out
              </button>
            </div>
          ) : (
            <button id="login-nav-btn" type="button" className="btn btn-outline" onClick={() => setShowLoginModal(true)}>
              Sign in
            </button>
          )}
        </div>
        <p>Generate QR codes for links, text, WiFi, contacts, and more.</p>
      </header>

      {/* Tabs */}
      <nav className="tabs">
        {TABS.map(({ id, label }) => (
          <button key={id} id={`tab-${id}`} type="button" className={`tab ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </nav>

      {/* Grid */}
      <div className="grid">
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Input card */}
          <div className="card">
            <div className="card-label">Input</div>
            {fields()}
            <button id="generate-btn" type="button" className="btn btn-primary btn-full btn-generate" onClick={generate} disabled={!ready() || busy}>
              {busy ? <><span className="spin" /> Generating…</> : <><I.QR /> Generate</>}
            </button>
          </div>

          {/* Style card */}
          <div className="card">
            <div className="card-label">Style</div>
            <div className="row" style={{ marginBottom: "12px" }}>
              <div className="field">
                <label className="label">Foreground</label>
                <div className="color-row">
                  <div className="swatch"><input type="color" id="fg-color" value={fg} onChange={(e) => setFg(e.target.value)} /></div>
                  <input className="input color-hex" type="text" value={fg} onChange={(e) => setFg(e.target.value)} maxLength={7} />
                </div>
              </div>
              <div className="field">
                <label className="label">Background</label>
                <div className="color-row">
                  <div className="swatch"><input type="color" id="bg-color" value={bg} onChange={(e) => setBg(e.target.value)} /></div>
                  <input className="input color-hex" type="text" value={bg} onChange={(e) => setBg(e.target.value)} maxLength={7} />
                </div>
              </div>
            </div>

            <div className="field">
              <label className="label">Size</label>
              <div className="seg">
                {[128, 256, 384, 512].map((s) => (
                  <button key={s} type="button" className={`seg-btn ${size === s ? "active" : ""}`} onClick={() => setSize(s)}>
                    {s}px
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <label className="label">Error correction</label>
              <div className="seg">
                {ECL.map((l) => (
                  <button key={l} type="button" id={`ecl-${l}`} className={`seg-btn ${ecl === l ? "active" : ""}`} onClick={() => setEcl(l)}>
                    {l}<small>{ECL_LABEL[l]}</small>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right column — preview */}
        <div className="card">
          <div className="card-label">Preview</div>
          <div className="preview-area">
            {dataUrl ? (
              <div className="qr-result">
                <div className="qr-frame">
                  <img
                    src={dataUrl}
                    alt="QR Code"
                    width={size}
                    height={size}
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                </div>
                <span className="qr-meta">{size} × {size} · {ecl} correction</span>

                <div className="actions">
                  <button id="dl-png" type="button" className="btn btn-primary" onClick={dlPNG}><I.Down /> PNG</button>
                  <button id="dl-svg" type="button" className="btn btn-outline" onClick={dlSVG}><I.Down /> SVG</button>
                  <button id="copy-btn" type="button" className="btn btn-outline" onClick={copy}><I.Copy /> Copy</button>
                </div>
                <div className="actions-secondary">
                  <button id="share-btn" type="button" className="btn btn-ghost" onClick={share}><I.Share /> Share</button>
                  <button id="clear-btn" type="button" className="btn btn-danger" onClick={clear}><I.Trash /> Clear</button>
                </div>
              </div>
            ) : (
              <div className="placeholder">
                <div className="placeholder-box"><I.QR /></div>
                <p>Your QR code will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* History */}
      <section className="history">
        <div className="history-top">
          <div className="history-title">
            <I.Clock />
            History
            {history.length > 0 && <span className="badge">{history.length}</span>}
          </div>
          {history.length > 0 && (
            <button id="clear-history" type="button" className="btn btn-danger" onClick={async () => { if (user) { try { await clearAllQRs(user.uid); } catch {} } setHistory([]); toast("History cleared", "info"); }}>
              Clear all
            </button>
          )}
        </div>

        {historyLoading ? (
          <div className="history-empty"><span className="spin" /> Loading...</div>
        ) : history.length === 0 ? (
          <div className="history-empty">No history yet</div>
        ) : (
          <div className="history-list">
            {history.map((h) => (
              <div key={h.id} className="h-card">
                <div className="h-card-qr"><img src={h.dataUrl} alt="" width={36} height={36} /></div>
                <div className="h-card-body">
                  <div className="h-card-text" title={h.text}>{h.text}</div>
                  <div className="h-card-time">{h.type} · {h.time}</div>
                  <div className="h-card-btns">
                    <button type="button" className="btn btn-ghost" onClick={() => { setDataUrl(h.dataUrl); setQrText(h.data); toast("Loaded"); }}>
                      <I.QR /> Load
                    </button>
                    <button type="button" className="btn btn-danger" onClick={async () => { if (user) { try { await deleteQR(user.uid, h.id); } catch {} } setHistory((p) => p.filter((x) => x.id !== h.id)); toast("Removed", "info"); }}>
                      <I.Trash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="foot">
        <div className="foot-author">
          <span className="foot-name">Sudhakar Shinde</span>
          <a className="foot-email" href="mailto:sudhakarshinde2905@gmail.com">sudhakarshinde2905@gmail.com</a>
        </div>
        <a
          id="digital-heroes-btn"
          className="btn btn-hero"
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Built for Digital Heroes
        </a>
        <p className="foot-credit">QR Forge — built with Next.js</p>
      </footer>

      <Toasts items={toasts} />
    </div>
    {showLoginModal && (
      <div className="login-modal-overlay">
        <LoginPage onClose={() => setShowLoginModal(false)} />
      </div>
    )}
    </>
  );
}
