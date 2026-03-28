export const LoadingPage = () => {
  return (
    <main className="min-h-screen bg-background text-on-surface grid place-items-center">
      <div className="text-center">
        <div className="inline-block mb-4">
          <div className="animate-pulse">
            <span className="material-symbols-outlined text-5xl text-primary block">grid_view</span>
          </div>
        </div>
        <p className="text-lg text-on-surface-variant font-headline font-bold tracking-wide">Initializing Kinetic Grid...</p>
      </div>
    </main>
  );
};
