import { useState } from "react";
import { AUTH_MODES, DEFAULT_AUTH_FORM } from "../utils/constants.js";

export const AuthForm = ({ onSubmit, statusMessage, isLoading }) => {
  const [mode, setMode] = useState(AUTH_MODES.LOGIN);
  const [form, setForm] = useState(DEFAULT_AUTH_FORM);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload =
      mode === AUTH_MODES.REGISTER
        ? form
        : { email: form.email, password: form.password };

    await onSubmit(mode, payload);
    setForm(DEFAULT_AUTH_FORM);
  };

  return (
    <section className="w-full max-w-md rounded-2xl border border-primary/20 bg-surface-container-high p-6 shadow-card">
      <h1 className="text-2xl font-headline font-bold text-cyan-400 mb-2">Block Arena</h1>
      <p className="text-on-surface-variant mb-6 text-sm">Sign in to enter the kinetic grid.</p>

      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setMode(AUTH_MODES.LOGIN)}
          className={`px-4 py-2 rounded-lg transition font-headline font-bold text-sm uppercase tracking-wide ${
            mode === AUTH_MODES.LOGIN 
              ? "bg-primary text-on-primary shadow-[0_0_20px_rgba(83,221,252,0.3)]" 
              : "bg-surface-container text-on-surface-variant hover:text-white"
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setMode(AUTH_MODES.REGISTER)}
          className={`px-4 py-2 rounded-lg transition font-headline font-bold text-sm uppercase tracking-wide ${
            mode === AUTH_MODES.REGISTER 
              ? "bg-primary text-on-primary shadow-[0_0_20px_rgba(83,221,252,0.3)]" 
              : "bg-surface-container text-on-surface-variant hover:text-white"
          }`}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === AUTH_MODES.REGISTER && (
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleInput}
            className="w-full rounded-lg bg-surface-container border border-outline-variant/30 px-3 py-2 text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary transition"
            required
          />
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleInput}
          className="w-full rounded-lg bg-surface-container border border-outline-variant/30 px-3 py-2 text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary transition"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password (min 8 chars)"
          value={form.password}
          onChange={handleInput}
          className="w-full rounded-lg bg-surface-container border border-outline-variant/30 px-3 py-2 text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary transition"
          minLength={8}
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-primary text-on-primary font-headline font-bold py-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(83,221,252,0.3)] uppercase tracking-widest text-sm"
        >
          {isLoading ? "Loading..." : mode === AUTH_MODES.REGISTER ? "Create Account" : "Login"}
        </button>
      </form>

      <div className="mt-4 rounded-lg border border-primary/20 bg-surface-container p-3 text-xs text-on-surface-variant">
        <p className="font-bold uppercase tracking-[0.18em] text-primary">Recruiter Note</p>
        <p className="mt-2">
          You can either create a new account to evaluate the full flow, or use the existing demo account below.
        </p>
        <p className="mt-2 break-all">
          Email: <span className="font-mono text-on-surface">anshsahu7705@gmail.com</span>
        </p>
        <p className="break-all">
          Password: <span className="font-mono text-on-surface">newAsh@1</span>
        </p>
      </div>

      {statusMessage && <p className="mt-4 text-sm text-error text-center">{statusMessage}</p>}
    </section>
  );
};
