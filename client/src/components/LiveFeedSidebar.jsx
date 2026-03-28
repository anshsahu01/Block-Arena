export const LiveFeedSidebar = ({ feedItems, currentUser }) => {
  return (
    <aside className="lg:w-80 flex flex-col gap-6 shrink-0">
      <div className="bg-surface-container-low rounded-xl p-6 space-y-4 h-full">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-tertiary rounded-full"></div>
          <div>
            <h2 className="font-headline font-black text-lg text-cyan-400 leading-tight">LIVE FEED</h2>
            <p className="text-[10px] text-on-surface-variant font-bold tracking-[0.2em] uppercase">Real-Time Claims</p>
          </div>
        </div>

        <div className="pt-2 border-t border-outline-variant/10">
          {feedItems.length === 0 ? (
            <p className="text-xs text-on-surface-variant/80">No activity yet. New claims and unclaims will appear here.</p>
          ) : (
            <div className="space-y-3">
              {feedItems.map((item, index) => {
                const isCurrentUser = item.actorId === currentUser?.id;
                const actorLabel = isCurrentUser
                  ? currentUser?.username || item.actor || "You"
                  : item.actor || "Unknown";
                const isRelease = item.action === "release";

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3"
                    style={{ opacity: Math.max(0.45, 1 - index * 0.08) }}
                  >
                    <div
                      className="w-6 h-6 rounded text-[10px] flex items-center justify-center font-bold text-white"
                      style={{ backgroundColor: item.color || "#3c475a" }}
                    >
                      {actorLabel.substring(0, 2).toUpperCase()}
                    </div>
                    <p className="text-xs text-on-surface-variant">
                      <span className="text-on-surface font-semibold">{actorLabel}</span>{" "}
                      {isRelease ? "unclaimed" : "claimed"}{" "}
                      <span className="text-primary font-mono tracking-tighter">{item.blockId}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
