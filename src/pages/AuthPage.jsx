import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://184.73.245.154:5000";

const AUTH_ENDPOINTS = {
  login: [
    process.env.REACT_APP_AUTH_LOGIN_ENDPOINT,
    "/login",
    "/auth/login",
    "/users/login",
  ].filter(Boolean),
  register: [
    process.env.REACT_APP_AUTH_REGISTER_ENDPOINT,
    "/register",
    "/auth/register",
    "/users/register",
  ].filter(Boolean),
};

function normalizeAuthPayload(data, fallbackEmail, fallbackName) {
  const userCandidate = data?.user || data?.data?.user || data?.account || {};

  return {
    token: data?.token || data?.access_token || data?.jwt || "",
    user: {
      id: userCandidate?.id || userCandidate?.ID || data?.id || data?.user_id || null,
      name:
        userCandidate?.name ||
        userCandidate?.Name ||
        data?.name ||
        data?.Name ||
        fallbackName ||
        "",
      email:
        userCandidate?.email ||
        userCandidate?.Email ||
        data?.email ||
        data?.Email ||
        fallbackEmail ||
        "",
      created_at:
        userCandidate?.created_at ||
        userCandidate?.Created_at ||
        data?.created_at ||
        data?.Created_at ||
        null,
    },
  };
}

export default function AuthPage({ isAuthenticated, onAuthSuccess }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/closet" replace />;
  }

  const isLogin = mode === "login";

  async function submitAuth(e) {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    if (!isLogin) {
      if (!name.trim()) {
        setError("Name is required for sign up.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setIsSubmitting(true);

    const endpointList = isLogin ? AUTH_ENDPOINTS.login : AUTH_ENDPOINTS.register;
    const payload = isLogin
      ? { email: email.trim(), password }
      : { name: name.trim(), email: email.trim(), password };

    let completed = false;

    for (const endpoint of endpointList) {
      try {
        const response = await fetch(`${API_URL}${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.status === 404) {
          continue;
        }

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          const message = data?.message || data?.error || "Authentication failed.";
          setError(message);
          completed = true;
          break;
        }

        const authPayload = normalizeAuthPayload(data, email.trim(), name.trim());

        if (isLogin) {
          onAuthSuccess(authPayload);
          navigate("/closet", { replace: true });
        } else {
          setMode("login");
          setPassword("");
          setConfirmPassword("");
          setInfo("Account created. Sign in with your new credentials.");
        }

        completed = true;
        break;
      } catch (requestError) {
        console.error("Auth request failed:", requestError);
      }
    }

    if (!completed) {
      const tried = (isLogin ? AUTH_ENDPOINTS.login : AUTH_ENDPOINTS.register).join(", ");
      setError(
        `Could not reach any auth endpoint. Tried: ${tried}`
      );
    }

    setIsSubmitting(false);
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl rounded-xl bg-earth-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-earth-moss">
          DressCode Account
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-earth-text">
          {isLogin ? "Sign in" : "Create your account"}
        </h1>
        <p className="mt-3 text-sm text-earth-stone">
          {isLogin
            ? "Access your personalized closet and outfit suggestions."
            : "Create an account to save and manage your own wardrobe."}
        </p>

        <form onSubmit={submitAuth} className="mt-6 space-y-4">
          {!isLogin && (
            <div>
              <label className="mb-1 block text-sm font-medium text-earth-text">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-lg border border-earth-sand/50 bg-earth-card px-3 py-2 text-sm text-earth-text outline-none transition-all duration-200 placeholder:text-earth-stone focus:border-earth-moss focus:ring-2 focus:ring-earth-sand/50"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-earth-text">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-earth-sand/50 bg-earth-card px-3 py-2 text-sm text-earth-text outline-none transition-all duration-200 placeholder:text-earth-stone focus:border-earth-moss focus:ring-2 focus:ring-earth-sand/50"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-earth-text">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-earth-sand/50 bg-earth-card px-3 py-2 pr-16 text-sm text-earth-text outline-none transition-all duration-200 placeholder:text-earth-stone focus:border-earth-moss focus:ring-2 focus:ring-earth-sand/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-semibold text-earth-moss transition-colors hover:text-earth-pine"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="mb-1 block text-sm font-medium text-earth-text">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-earth-sand/50 bg-earth-card px-3 py-2 pr-16 text-sm text-earth-text outline-none transition-all duration-200 placeholder:text-earth-stone focus:border-earth-moss focus:ring-2 focus:ring-earth-sand/50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-semibold text-earth-moss transition-colors hover:text-earth-pine"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          )}

          {error && (
            <p className="rounded-lg bg-[#f7ebe7] px-3 py-2 text-sm text-[#8b4e3d]">{error}</p>
          )}

          {info && (
            <p className="rounded-lg bg-[#e8f1ea] px-3 py-2 text-sm text-[#3f6b4b]">{info}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-earth-moss px-4 py-2.5 text-sm font-semibold text-earth-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:bg-earth-sage hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Please wait..." : isLogin ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="mt-5 text-sm text-earth-stone">
          {isLogin ? "No account yet?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(isLogin ? "register" : "login");
              setError("");
              setInfo("");
            }}
            className="font-semibold text-earth-moss transition-colors hover:text-earth-pine"
          >
            {isLogin ? "Create one" : "Sign in"}
          </button>
        </div>

        <div className="mt-5 border-t border-earth-sand/50 pt-4 text-sm">
          <Link to="/" className="text-earth-stone transition-colors hover:text-earth-text">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
