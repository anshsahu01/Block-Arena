import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const navigate = useNavigate();

  const goToAuth = () => {
    navigate("/auth");
  };

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary selection:text-on-primary min-h-screen">
      <nav className="fixed top-0 w-full flex justify-between items-center px-6 py-4 z-50 bg-[#060e20]/70 backdrop-blur-xl shadow-[0px_24px_48px_-12px_rgba(0,104,123,0.12)]">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold tracking-tighter text-cyan-500 bg-clip-text font-headline">Block Arena</span>
          <div className="hidden md:flex gap-6">
            <a className="text-cyan-400 border-b-2 border-cyan-500 pb-1 font-headline tracking-tight text-sm" href="#hero">Home</a>
            <a className="text-[#a3aac4] hover:text-cyan-200 transition-colors font-headline tracking-tight text-sm" href="#features">Features</a>
            <button onClick={goToAuth} className="text-[#a3aac4] hover:text-cyan-200 transition-colors font-headline tracking-tight text-sm" type="button">Enter Grid</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 mr-2">
            <span className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer">notifications</span>
            <span className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer">account_circle</span>
          </div>
          <button
            onClick={goToAuth}
            className="bg-primary text-on-primary px-5 py-2 rounded font-headline font-bold text-sm tracking-tight hover:scale-105 active:scale-95 transition-all duration-200 shadow-[0px_0px_15px_rgba(83,221,252,0.4)]"
          >
            Enter Grid
          </button>
        </div>
      </nav>

      <main className="relative pt-20">
        <section id="hero" className="relative min-h-[88vh] flex flex-col items-center justify-center px-6 overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-tertiary/5 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="relative z-10 max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-variant/50 border border-outline-variant/20 mb-8 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-tertiary"></span>
              <span className="text-[10px] font-bold tracking-[0.1em] text-tertiary uppercase font-label">System Online: 4,281 Blocks Active</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black font-headline tracking-tighter text-on-surface leading-[0.9] mb-6">
              Claim the <span className="text-primary italic">Grid</span>.
              <br />
              Rule the Arena.
            </h1>

            <p className="text-xl md:text-2xl text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
              A real-time collaborative block-claiming game. Compete globally, claim your territory, and climb the leaderboard.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={goToAuth}
                className="w-full sm:w-auto px-10 py-4 bg-primary text-on-primary rounded-lg font-headline font-bold text-lg tracking-tight hover:shadow-[0px_0px_25px_#53ddfc] transition-all duration-300"
              >
                Enter Grid
              </button>
              <button className="w-full sm:w-auto px-10 py-4 border border-outline-variant/30 text-on-surface rounded-lg font-headline font-bold text-lg tracking-tight hover:bg-surface-variant transition-all duration-300 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">play_circle</span>
                Watch Live
              </button>
            </div>
          </div>

          <div className="relative z-10 mt-20 w-full max-w-5xl aspect-video glass-hud rounded-xl border border-outline-variant/10 shadow-2xl overflow-hidden group">
            <img
              alt="Tactical Grid Interface"
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1roVy0wVlSSin13Z8B-9fIUhkgpPFI3euKLQba-pWJBb5Ha_G1AIf69o6M9znwI03ALZhyr4ZkZUnyDeQWM9rYEuwbeh7jDf7ZzXAmuw7lvxe0TN8VMtJ51MJIkG4rGcvdZ_87FukypbgsEPMHz5hrxTZ5uXtaBIrO05pVh0rXqrCZA87wwtyVFQyePFHYesZZRhiYMSRj4jppfLNVgpnxf_dISSCDrE2nnAUkIaHLJA6GfIGZffAagdaotfnuGEfoeto9aCxSSQ"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          </div>
        </section>

        <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 group relative overflow-hidden bg-surface-container rounded-xl p-8 border border-outline-variant/5 hover:border-primary/20 transition-all duration-500">
              <div className="relative z-10 h-full flex flex-col">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary">hub</span>
                </div>
                <h3 className="text-3xl font-bold font-headline mb-4">Real-time Multiplayer</h3>
                <p className="text-on-surface-variant leading-relaxed max-w-md">
                  Experience zero-latency synchronization. Watch the grid pulse and shift in real-time as players claim their territory.
                </p>
              </div>
            </div>

            <div className="md:col-span-4 group bg-surface-container-high rounded-xl p-8 border border-outline-variant/5 hover:border-tertiary/20 transition-all duration-500">
              <div className="w-12 h-12 rounded-lg bg-tertiary-container/20 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-tertiary">bolt</span>
              </div>
              <h3 className="text-2xl font-bold font-headline mb-4">Instant Claiming</h3>
              <p className="text-on-surface-variant leading-relaxed text-sm">
                Optimized for velocity. Register actions fast and capture blocks before rivals do.
              </p>
            </div>

            <div className="md:col-span-12 group bg-surface-container rounded-xl p-8 border border-outline-variant/5 hover:border-primary/20 transition-all duration-500">
              <h3 className="text-3xl font-bold font-headline mb-4 italic">Strategic Command</h3>
              <p className="text-on-surface-variant leading-relaxed max-w-3xl">
                Choose your rhythm: tactical manual claims or aggressive rapid captures. Your strategy defines your rank in Block Arena.
              </p>
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-surface-container-low/40">
          <div className="max-w-3xl mx-auto text-center rounded-3xl bg-gradient-to-br from-surface-variant to-surface-container-lowest p-12 border border-outline-variant/10 relative overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none"></div>
            <h2 className="text-4xl md:text-5xl font-black font-headline tracking-tighter mb-6 relative z-10">Ready to Claim Your First Block?</h2>
            <p className="text-on-surface-variant text-lg mb-10 max-w-xl mx-auto relative z-10">
              Join the global competition today. The grid is waiting for its next commander.
            </p>
            <button
              onClick={goToAuth}
              className="relative z-10 bg-primary text-on-primary px-12 py-5 rounded-lg font-headline font-bold text-xl tracking-tight hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0px_0px_30px_rgba(83,221,252,0.3)]"
            >
              Initialize Grid Entry
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
