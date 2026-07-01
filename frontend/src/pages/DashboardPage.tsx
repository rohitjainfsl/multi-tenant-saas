import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import type { AxiosError } from 'axios';

// ─── Types ────────────────────────────────────────────────────────────────────
interface PredictResult {
  success: boolean;
  prediction: string;
  confidence: number;
  model_version: string;
}

type PredictStatus = 'idle' | 'loading' | 'success' | 'error';

// ─── Prediction Panel ─────────────────────────────────────────────────────────
const PredictionPanel = () => {
  const [feature1, setFeature1] = useState('5.1');
  const [feature2, setFeature2] = useState('3.5');
  const [feature3, setFeature3] = useState('1.4');
  const [feature4, setFeature4] = useState('0.2');

  const [status, setStatus] = useState<PredictStatus>('idle');
  const [result, setResult] = useState<PredictResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handlePredict = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setResult(null);
    setErrorMsg('');

    try {
      const { data } = await api.post<PredictResult>('/ml/predict', {
        feature1: parseFloat(feature1),
        feature2: parseFloat(feature2),
        feature3: parseFloat(feature3),
        feature4: parseFloat(feature4),
      });

      setResult(data);
      setStatus('success');
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setErrorMsg(
        axiosErr.response?.data?.message ?? 'Prediction request failed.'
      );
      setStatus('error');
    }
  };

  return (
    <section
      aria-label="ML Prediction"
      className="mt-10 card-glass p-6 border-slate-700/40"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400 text-lg">
          🤖
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">ML Prediction</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Calls Express → Python ML service via <code className="text-violet-400">POST /ml/predict</code>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input form */}
        <form
          id="predict-form"
          onSubmit={(e) => void handlePredict(e)}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'predict-f1', label: 'Feature 1', value: feature1, set: setFeature1 },
              { id: 'predict-f2', label: 'Feature 2', value: feature2, set: setFeature2 },
              { id: 'predict-f3', label: 'Feature 3', value: feature3, set: setFeature3 },
              { id: 'predict-f4', label: 'Feature 4', value: feature4, set: setFeature4 },
            ].map(({ id, label, value, set }) => (
              <div key={id}>
                <label htmlFor={id} className="mb-1 block text-xs font-medium text-slate-400">
                  {label}
                </label>
                <input
                  id={id}
                  type="number"
                  step="0.1"
                  required
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  className="input-field text-sm py-2"
                />
              </div>
            ))}
          </div>

          <button
            id="predict-submit-btn"
            type="submit"
            disabled={status === 'loading'}
            className="btn-primary w-full py-2.5 text-sm"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
          >
            {status === 'loading' ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Running prediction…
              </>
            ) : (
              '▶ Run Prediction'
            )}
          </button>
        </form>

        {/* Result panel */}
        <div className="flex flex-col justify-center">
          {status === 'idle' && (
            <div className="flex flex-col items-center justify-center h-full py-6 text-center">
              <p className="text-slate-600 text-sm">
                Enter feature values and click<br />
                <span className="text-slate-500">▶ Run Prediction</span> to see the result.
              </p>
            </div>
          )}

          {status === 'error' && (
            <div
              id="predict-error"
              role="alert"
              className="rounded-lg bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-400"
            >
              <p className="font-semibold mb-1">Error</p>
              <p>{errorMsg}</p>
            </div>
          )}

          {status === 'success' && result && (
            <div
              id="predict-result"
              className="rounded-xl bg-violet-500/10 border border-violet-500/30 p-5 space-y-3"
            >
              {/* Prediction label */}
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Prediction</p>
                <p className="text-2xl font-bold text-violet-300">{result.prediction}</p>
              </div>

              {/* Confidence bar */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs uppercase tracking-widest text-slate-500">Confidence</p>
                  <p className="text-xs font-semibold text-violet-400">
                    {(result.confidence * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-400 transition-all duration-700"
                    style={{ width: `${result.confidence * 100}%` }}
                  />
                </div>
              </div>

              {/* Model version */}
              <div className="flex items-center justify-between pt-1 border-t border-violet-500/20">
                <p className="text-xs text-slate-500">Model version</p>
                <code className="text-xs text-violet-400">{result.model_version}</code>
              </div>

              {/* Call chain confirmation */}
              <div className="flex items-center gap-2 pt-1 text-xs text-slate-600">
                <span className="text-green-500">✓</span>
                Browser → Express → Python ML service
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// ─── Dashboard Page ───────────────────────────────────────────────────────────
const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  const initials = user?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top bar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-500 text-white text-xs font-bold">
                S
              </span>
              <span className="text-white font-semibold text-sm">
                Saas<span className="text-brand-400">Kit</span>
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-600/30">
                  {initials}
                </div>
                <span className="hidden sm:block text-sm text-slate-300">{user?.name}</span>
              </div>

              <button
                id="dashboard-logout-btn"
                onClick={() => void handleLogout()}
                className="btn-ghost text-sm py-1.5 px-4"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome banner */}
        <section aria-label="Welcome" className="mb-10">
          <h1 className="text-3xl font-bold text-white">
            Welcome back,{' '}
            <span className="text-brand-400">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="mt-2 text-slate-400">
            You're successfully authenticated. This is your protected dashboard.
          </p>
        </section>

        {/* Info cards grid */}
        <section aria-label="Account info" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Email card */}
          <div className="card-glass p-6">
            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-slate-500">
              Email
            </p>
            <p className="text-base font-medium text-white truncate">{user?.email}</p>
          </div>

          {/* Role card */}
          <div className="card-glass p-6">
            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-slate-500">
              Role
            </p>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                user?.role === 'admin'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
              }`}
            >
              {user?.role}
            </span>
          </div>

          {/* Phone card */}
          <div className="card-glass p-6">
            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-slate-500">
              Phone
            </p>
            <p className="text-base font-medium text-white">
              {user?.phone ?? (
                <span className="text-slate-600">Not provided</span>
              )}
            </p>
          </div>

          {/* Member since */}
          <div className="card-glass p-6 sm:col-span-2 lg:col-span-3">
            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-slate-500">
              Member since
            </p>
            <p className="text-base font-medium text-white">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : '—'}
            </p>
          </div>
        </section>

        {/* Protected route confirmation */}
        <div className="mt-5 card-glass p-6 border-brand-700/30 bg-brand-950/20 flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-brand-400 text-lg">
            🔒
          </div>
          <div>
            <p className="font-semibold text-white">Protected Route Active</p>
            <p className="mt-1 text-sm text-slate-400">
              This page is only accessible when authenticated. Unauthenticated visitors are
              automatically redirected to the login page.
            </p>
          </div>
        </div>

        {/* ML Prediction Panel */}
        <PredictionPanel />
      </main>
    </div>
  );
};

export default DashboardPage;
