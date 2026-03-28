export const ColorPicker = ({ color, onColorChange, onSubmit, username, statusMessage, isLoading }) => {
  return (
    <section className="w-full max-w-md rounded-2xl border border-primary/20 bg-surface-container-high p-6 shadow-card">
      <h2 className="text-2xl font-headline font-bold text-cyan-400 mb-2">Choose Your Color</h2>
      <p className="text-on-surface-variant mb-6 text-sm">
        Hi <span className="font-medium text-primary">{username}</span>, pick your identity color for the grid.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="p-4 bg-surface-container rounded-lg border border-outline-variant/20">
          <label className="flex items-center gap-4">
            <input
              type="color"
              value={color}
              onChange={(e) => onColorChange(e.target.value)}
              className="h-12 w-20 rounded cursor-pointer border border-outline-variant/30"
            />
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Selected Color</p>
              <span className="text-sm font-mono text-primary">{color}</span>
            </div>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-primary text-on-primary font-headline font-bold py-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(83,221,252,0.3)] uppercase tracking-widest text-sm"
        >
          {isLoading ? "Saving..." : "Continue To Grid"}
        </button>
      </form>

      {statusMessage && <p className="mt-4 text-sm text-error text-center">{statusMessage}</p>}
    </section>
  );
};
