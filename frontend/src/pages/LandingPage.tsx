import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Feature card data
const features = [
  {
    icon: '⚡',
    title: 'Blazing Fast',
    description:
      'Built with modern tooling — Vite, React 18, and TypeScript — so your app ships instantly and scales without compromise.',
  },
  {
    icon: '🔐',
    title: 'Secure by Default',
    description:
      'JWT tokens in HTTP-only cookies, bcrypt password hashing, and role-based access control baked in from day one.',
  },
  {
    icon: '☁️',
    title: 'Cloud Native',
    description:
      'MongoDB Atlas gives you a globally distributed database with zero infrastructure headaches right out of the box.',
  },
];

// Step data for the "How it works" section
const steps = [
  {
    step: '01',
    title: 'Create an account',
    description: 'Register with your name, email, and password in under 30 seconds.',
  },
  {
    step: '02',
    title: 'Verify and log in',
    description: 'Receive a secure session via HTTP-only cookie — no tokens exposed to JavaScript.',
  },
  {
    step: '03',
    title: 'Access your dashboard',
    description: 'Protected routes keep your data private. Roles let you control who sees what.',
  },
];

const LandingPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 pt-16">
        {/* ── Hero Section ─────────────────────────────────────────── */}
        <section
          id="hero"
          className="relative overflow-hidden bg-slate-950 py-24 md:py-36"
          aria-label="Hero"
        >
          {/* Background glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div className="h-[600px] w-[600px] rounded-full bg-brand-600/10 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            {/* Badge */}
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-700/50 bg-brand-950/40 px-4 py-1.5 text-xs font-medium text-brand-300">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse" />
              Multi-Tenant SaaS Starter
            </span>

            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
              Launch your SaaS{' '}
              <span className="bg-gradient-to-r from-brand-400 to-brand-300 bg-clip-text text-transparent">
                in minutes
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
              A production-ready scaffold with authentication, JWT sessions, MongoDB Atlas, and
              role-based access control — so you can focus on what makes your product unique.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link to="/register" id="hero-register-btn" className="btn-primary px-8 py-3 text-base">
                Get started free →
              </Link>
              <Link to="/login" id="hero-login-btn" className="btn-ghost px-8 py-3 text-base">
                Sign in
              </Link>
            </div>
          </div>
        </section>

        {/* ── Features Section ─────────────────────────────────────── */}
        <section
          id="features"
          className="bg-slate-900/50 py-20 md:py-28"
          aria-label="Features"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Section heading */}
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Everything you need to ship
              </h2>
              <p className="mt-4 text-slate-400 max-w-xl mx-auto">
                No boilerplate busywork. We've assembled the essential building blocks so you start
                from a solid foundation.
              </p>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="card-glass p-8 group hover:border-brand-700/50 transition-colors duration-300"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-2xl group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it Works Section ─────────────────────────────────── */}
        <section
          id="how-it-works"
          className="bg-slate-950 py-20 md:py-28"
          aria-label="How it works"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Section heading */}
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">How it works</h2>
              <p className="mt-4 text-slate-400 max-w-xl mx-auto">
                From zero to authenticated in three simple steps.
              </p>
            </div>

            <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
              {steps.map((s, i) => (
                <div key={s.step} className="relative flex flex-col items-center text-center">
                  {/* Connector line (except last) */}
                  {i < steps.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="absolute top-8 left-1/2 hidden h-px w-full bg-gradient-to-r from-brand-700/50 to-transparent md:block"
                    />
                  )}
                  {/* Step number */}
                  <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-brand-600/40 bg-brand-600/10 text-brand-400 font-bold text-lg">
                    {s.step}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400 max-w-xs">{s.description}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-16 text-center">
              <Link to="/register" id="landing-cta-btn" className="btn-primary px-10 py-3 text-base">
                Start building →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
