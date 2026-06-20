"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

/* Google "G" logo SVG */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

export default function LoginPage({ onClose }) {
  const { login, signup, loginWithGoogle } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function friendlyError(err) {
    const code = err?.code;
    const map = {
      "auth/email-already-in-use": "This email is already registered. Try signing in.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/weak-password": "Password must be at least 6 characters.",
      "auth/user-not-found": "No account found with this email.",
      "auth/wrong-password": "Incorrect password.",
      "auth/invalid-credential": "Invalid email or password.",
      "auth/too-many-requests": "Too many attempts. Please try again later.",
      "auth/popup-closed-by-user": "Sign-in popup was closed.",
    };
    if (err) {
      console.error("Auth Error:", err);
    }
    return map[code] || err?.message || "Something went wrong. Please try again.";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (isSignUp) {
        await signup(email, password, name);
      } else {
        await login(email, password);
      }
      if (onClose) onClose();
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setBusy(true);
    try {
      await loginWithGoogle();
      if (onClose) onClose();
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError(friendlyError(err));
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        {onClose && (
          <button
            type="button"
            className="login-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
        <div className="login-header">
          <h1 className="login-logo">QR Forge</h1>
          <p className="login-sub">{isSignUp ? "Create your account" : "Sign in to your account"}</p>
        </div>

        {/* Google button */}
        <button
          id="google-signin-btn"
          type="button"
          className="btn-google"
          onClick={handleGoogle}
          disabled={busy}
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="login-divider">
          <span>or</span>
        </div>

        {/* Email/Password form */}
        <form onSubmit={handleSubmit} className="login-form">
          {isSignUp && (
            <div className="field">
              <label className="label" htmlFor="auth-name">Full name</label>
              <input
                id="auth-name"
                className="input"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
          )}
          <div className="field">
            <label className="label" htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              className="input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="field">
            <label className="label" htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              className="input"
              type="password"
              placeholder={isSignUp ? "At least 6 characters" : "Your password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={isSignUp ? "new-password" : "current-password"}
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button
            id="auth-submit-btn"
            type="submit"
            className="btn btn-primary btn-full"
            disabled={busy}
            style={{ marginTop: "4px" }}
          >
            {busy ? <span className="spin" /> : isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>

        <p className="login-switch">
          {isSignUp ? "Already have an account?" : "Don\u2019t have an account?"}
          <button
            id="auth-toggle-btn"
            type="button"
            className="login-switch-btn"
            onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </p>
      </div>

      <p className="login-footer">QR Forge — built with Next.js & Firebase</p>
    </div>
  );
}
