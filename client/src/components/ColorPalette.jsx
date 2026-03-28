export const ColorPalette = ({ color, onColorChange, onConfirm, isLoading }) => {
  const colorPalette = [
    "#53ddfc",
    "#ff716c",
    "#c5ffc9",
    "#fbd8fb",
    "#ffd8a3",
    "#a3defe",
    "#b1a3ff",
    "#ffb1b1",
    "#deffb1",
    "#b1fff1",
    "#f9ffb1",
    "#ffffff",
  ];

  return (
    <aside className="lg:w-80 flex flex-col gap-6">
      <div className="bg-surface-container-high rounded-xl p-6 border border-primary/20 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-headline font-bold text-sm tracking-wide uppercase">Active Palette</h4>
          <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded">
            CUSTOM
          </span>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-8">
          {colorPalette.map((paletteColor) => (
            <button
              key={paletteColor}
              onClick={() => onColorChange(paletteColor)}
              className={`aspect-square rounded-full transition-transform hover:scale-105 ${
                color === paletteColor
                  ? "border-2 border-white ring-4 ring-primary/20 flex items-center justify-center shadow-lg scale-110"
                  : ""
              }`}
              style={{ backgroundColor: paletteColor }}
              title={paletteColor}
            >
              {color === paletteColor && (
                <svg
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  className="h-3.5 w-3.5 text-on-primary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3.5 8.5 6.5 11.5 12.5 5.5" />
                </svg>
              )}
            </button>
          ))}
        </div>

        <div className="p-3 bg-surface-container rounded-lg border border-outline-variant/10 mb-6">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase">Hex Code</span>
            <span className="text-[10px] font-mono text-primary uppercase">{color}</span>
          </div>
          <div className="w-full h-1 bg-primary rounded-full"></div>
        </div>

        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="w-full py-3 bg-surface-container-highest border border-primary/40 text-primary rounded-lg font-bold text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-on-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : "Confirm Color"}
        </button>
      </div>

      <div className="bg-surface-container rounded-xl p-4 h-48 relative overflow-hidden group">
        <div className="absolute inset-0 opacity-10 group-hover:scale-110 transition-transform duration-700 bg-gradient-to-br from-primary/20 to-tertiary/20"></div>
        <div className="relative z-10 h-full flex flex-col justify-between">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">
            Sector Overview
          </p>
          <div className="flex items-center justify-between text-[10px] font-bold text-on-surface-variant uppercase">
            <span>Grid Pos: 42, 128</span>
            <span>Zoom: 100%</span>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-2 border-primary/50 rounded animate-pulse"></div>
      </div>
    </aside>
  );
};
