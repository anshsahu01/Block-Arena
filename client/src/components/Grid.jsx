import { GRID_SIZE } from "../utils/constants.js";

export const Grid = ({ grid, onBlockClick, currentUserId }) => {
  return (
    <section className="flex-grow bg-surface-container-low rounded-2xl p-6 lg:p-8 relative overflow-hidden flex flex-col">
      {/* Grid Container */}
      <div className="flex-grow flex items-center justify-center bg-surface-container-lowest/30 rounded-xl p-4 border border-outline-variant/5">
        <div
          className="grid-container w-full max-w-[600px] aspect-square"
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const row = Math.floor(i / GRID_SIZE);
            const col = i % GRID_SIZE;
            const id = `${row}-${col}`;
            const block = grid[id];

            if (block?.ownerId) {
              const isOwnedByCurrentUser = block.ownerId === currentUserId;

              // Claimed block
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onBlockClick(id, block)}
                  className="block-claimed"
                  style={{
                    backgroundColor: block.color || "#3c475a",
                  }}
                  title={
                    isOwnedByCurrentUser
                      ? `Block ${id} - Click to release`
                      : `Block ${id} - Claimed by ${block.ownerId}`
                  }
                />
              );
            }

            // Unclaimed block
            return (
              <button
                key={id}
                type="button"
                onClick={() => onBlockClick(id, block)}
                className="block-interactive"
                title="Click to claim"
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
