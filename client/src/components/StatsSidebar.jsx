export const StatsSidebar = ({ capturedCount, statusMessage }) => {
  const claimRate = (capturedCount / 60).toFixed(1); // rough estimate

  return (
    <aside className="lg:w-72 flex flex-col gap-6 shrink-0">
      <div className="bg-surface-container-low rounded-xl p-6 space-y-6">
        {/* Command Deck Header */}
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-primary rounded-full"></div>
          <div>
            <h2 className="font-headline font-black text-lg text-cyan-400 leading-tight">COMMAND DECK</h2>
            <p className="text-[10px] text-on-surface-variant font-bold tracking-[0.2em] uppercase">Console</p>
          </div>
        </div>

        {/* Stats Card */}
        <div className="p-4 bg-surface-container rounded-lg border-l-4 border-primary shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant mb-1">Your Stats</p>
          <div className="flex justify-between items-end">
            <span className="text-2xl font-headline font-bold text-on-surface">{capturedCount}</span>
            <span className="text-xs font-medium text-primary">Blocks</span>
          </div>
          <div className="mt-2 text-xs text-on-surface-variant/70 italic">{claimRate} claims / sec</div>
        </div>

        {statusMessage && (
          <div className="p-3 bg-error-container/20 border border-error/30 rounded-lg">
            <p className="text-xs text-error-container text-center font-medium">{statusMessage}</p>
          </div>
        )}
      </div>
    </aside>
  );
};
